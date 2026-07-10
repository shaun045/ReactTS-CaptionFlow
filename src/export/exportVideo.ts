import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { Subtitle, VideoSegment } from "../utils/types";

interface SubtitleStyle {
  font: string | null;
  fontSize: number;
  color: string | null;
  style: string | null;
  pos: {x: number; y: number};
}

export async function exportVideo(
  videoFile: File, 
  subtitles: Subtitle[],
  duration: number,
  videoSegments: VideoSegment[],
  subtitleStyle: SubtitleStyle
) {


  const ffmpeg = new FFmpeg();

  ffmpeg.on("log", ({message}) => {
    console.log(message);
  });

  await ffmpeg.load();

  await ffmpeg.writeFile(
    "input.mp4",
    await fetchFile(videoFile)
  )
  await ffmpeg.writeFile(
    "arial.ttf",
    await fetchFile("/fonts/arial.ttf")
  );

  const segmentFiles: string[] =[];


  for (let i = 0; i < videoSegments.length; i++) {
    const seg = videoSegments[i];
    const outName = `segment${i}.mp4`;

    const segSubtitles = subtitles
      .filter(sub => sub.endTime > seg.sourceStart && sub.startTime < seg.sourceEnd)
      .map(sub => ({
        ...sub,
        startTime: Math.max(0, sub.startTime - seg.sourceStart),
        endTime: Math.min(seg.sourceEnd - seg.sourceStart, sub.endTime - seg.sourceStart)
      }));
    
    const args = [
      "-i", "input.mp4",
      "-ss", String(seg.sourceStart), 
      "-to", String(seg.sourceEnd), 
      "-avoid_negative_ts", "make_zero",
    ];

    if (segSubtitles.length > 0) {
      const filter = subtitleInstructions(segSubtitles, subtitleStyle).join(",");
      args.push("-vf", filter);
    }

    args.push(outName);
    await ffmpeg.exec(args);
    segmentFiles.push(outName);
  }
  
  const concatList = segmentFiles.map(f => `file '${f}'`).join("\n");
  await ffmpeg.writeFile("concat.txt", concatList);

  await ffmpeg.exec([
    "-f", 
    "concat",
    "-safe",
    "0",
    "-i",
    "concat.txt",
    "-c",
    "copy",
    "output.mp4"
  ]);

  const data = await ffmpeg.readFile("output.mp4");

  // console.log(data.length);
  const blob = new Blob(
    [data as Uint8Array<ArrayBuffer>],
    {type: "video/mp4"}
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = videoFile.name.replace(/\.[^/.]+$/, "") + "_edited.mp4";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
  // window.open(url);
}

function getStyleParams(style: string | null, color: string): string {
    switch (style) {
      case "shadow": return `:shadowx=3:shadowy=3:shadowcolor=black@0.8`;
      case "glow": return `:shadowx=0:shadowy=0:shadowcolor=${color}@0.8`;
      case "background": return `:box=1:boxcolor=black@0.6:boxborderw=10`;
      case "outline": return `:borderw=2:bordercolor=white`;
      default: return "";
    }
  }

function subtitleInstructions(subtitles: Subtitle[], style: SubtitleStyle) {
  const isGradient = style.color?.includes("gradient");
  const safeColor = isGradient ? "white" : (style.color ?? "white");
  const styleParams = getStyleParams(style.style, safeColor);

  return subtitles.map(sub => {
    return (
      `drawtext=` +
      `text='${escapeSub(sub.text)}'` +
      `:fontfile=/arial.ttf` +
      `:fontsize=${style.fontSize}` +
      `:fontcolor=${style.color ?? "white"}` +
      `:x=w*${style.pos.x / 100}-text_w/2` +
      `:y=h*${style.pos.y / 100}-text_h/2` +
      styleParams +
      `:enable='between(t,${sub.startTime},${sub.endTime})'`
    );
  });
}

function escapeSub(text: string): string {
  return text
    .replace(/'/g, "\u2019")
    .replace(/:/g, "\\:")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]");
}