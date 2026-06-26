import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { Subtitle } from "../utils/types";


export async function exportVideo(videoFile: File, subtitles: Subtitle[]) {

  const ffmpeg = new FFmpeg();

  ffmpeg.on("log", ({message}) => {
    console.log(message);
  });

  await ffmpeg.load();

  await ffmpeg.writeFile(
    "input.mp4",
    await fetchFile(videoFile)
  )

  const fontData = await fetchFile("/fonts/arial.ttf");
  console.log("Font size:", fontData.length);

  await ffmpeg.writeFile(
    "arial.ttf",
    fontData
  );

  const written = await ffmpeg.readFile("arial.ttf");
  console.log("Written font size:", (written as Uint8Array).length);

  const instructions = subtitleInstructions(subtitles);
  const filter = instructions.join(",");
  console.log(filter);

  await ffmpeg.exec([
    "-i",
    "input.mp4",
    "-vf",
    filter,
    "output.mp4"
  ])
  
  const data = await ffmpeg.readFile("output.mp4");
  console.log(data.length);
  
  const blob = new Blob(
    [data as Uint8Array<ArrayBuffer>],
    {type: "video/mp4"}
  );

  const url = URL.createObjectURL(blob);

  window.open(url);
  console.log(url);

  console.log("Video exported!");
}

function subtitleInstructions(subtitles: Subtitle[]) {
  return subtitles.map(sub => {
    return (
      `drawtext=` +
      `text='${escapeSub(sub.text)}'` +
      `:fontfile=/arial.ttf` +
      `:fontsize=48` +
      `:fontcolor=white` +
      `:x=(w-text_w)/2` +
      `:y=h-100` +
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