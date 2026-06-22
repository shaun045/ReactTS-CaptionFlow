import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { Subtitle, VideoSegment } from "../utils/types";

export async function exportVideo(
  videoFile: File,
  subtitles: Subtitle[],
  subtitlePos: {x: number; y: number},
  fontSize: number,
  selectedFont: string | null,
  selectedColor: string | null,
  videoSegments: VideoSegment[],
  onProgress?: (progress: number) => void
) {
  const ffmpeg = new FFmpeg();

  ffmpeg.on("progress", ({progress}) => {
    onProgress?.(Math.round(progress * 100));
  }); 

  await ffmpeg.load();
  await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

  const segments = [...videoSegments].sort((a, b) => a.startTime - b.startTime);

  const filterParts: string[] = [];
  const contactInputs: string[] = [];

  segments.forEach((seg, i) => {
    filterParts.push(
      `[0:v]trim=start=${seg.startTime}:end=${seg.endTime},setpts=PTS-STARTPTS[v${i}]`,
      `[0:a]atrim=start=${seg.startTime}:end=${seg.endTime},asetpts=PTS-STARTPTS[a${i}]`
    );
    contactInputs.push(`[v${i}][a${i}]`);
  });

  filterParts.push(
    `${contactInputs.join("")}contact=n=${segments.length}:v=1:a=1[outv][outa]`
  );

  const adjustedSubtitles = adjustedSubtitleTime(subtitles, segments);
  const srtContent = generateSRT(adjustedSubtitles);
  await ffmpeg.writeFile("subtitles.srt", srtContent);

  const color = cssColorToASS(selectedColor ?? "white");
  const size = fontSize ?? 24;
  const fontName = selectedFont ?? "Arial";
  const marginV = Math.round((subtitlePos.y / 100) * 100);

  filterParts.push(
    `[outv]subtitles=subtitles.srt:force_style='FontName=${fontName}, FontSize=${size}, PrimaryColour=${color}, MarginV=${marginV}'[finalv]`
  );

  await ffmpeg.exec([
    "-i", "input.mp4",
    "-filter_complex", filterParts.join(";"),
    "-map", "[finalv]",
    "-map", "[outa]",
    "-c:v", "libx264",
    "-c:a", "aac",
    "output.mp4"
  ]);

  const data = await ffmpeg.readFile("output.mp4");
  const blob = new Blob([data as Uint8Array<ArrayBuffer>], {type: "video/mp4"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "captionflow_export.mp4";
  a.click();
  URL.revokeObjectURL(url);
}

function generateSRT(subtitles: Subtitle[]): string {
  return subtitles.map((sub, i) => {
    const start = formatSRTTime(sub.startTime);
    const end = formatSRTTime(sub.endTime);
    return `${i + 1}\n${start} --> ${end}\n${sub.text}\n`;
  }).join("\n"); 
}

function formatSRTTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  const ms = Math.round((seconds % 1) * 1000).toString().padStart(3, "0");
  return `${h}:${m}:${s},${ms}`;
}

function cssColorToASS(color: string): string {
  if (color.includes("gradient")) return "&H00FFFFFF";

  const canvas = document.createElement("canvas");
  canvas.width =  canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `&H00${b.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${r.toString(16).padStart(2, "0")}`.toUpperCase();
}

function adjustedSubtitleTime(subtitles: Subtitle[], segments: VideoSegment[]): Subtitle[] {
  const result: Subtitle[] = [];

  let timeOffset = 0;

  for (const seg of segments) {
    const segDuration = seg.endTime - seg.startTime;

    const matching = subtitles.filter(
      sub => sub.startTime >= seg.startTime && sub.endTime <= seg.endTime
    );

    for (const sub of matching) {
      result.push({
        ...sub,
        startTime: sub.startTime - seg.startTime + timeOffset,
        endTime: sub.endTime - seg.startTime + timeOffset,
      });
    }
    timeOffset += segDuration;
  }
  return result;
}