import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { Subtitle } from "../utils/types";


export async function exportVideo(videoFile: File, subtitles: Subtitle[]) {
  console.log("Inside exportVideo");

  const ffmpeg = new FFmpeg();

  await ffmpeg.load();
  console.log("Loading FFMPEG");

  await ffmpeg.writeFile(
    "input.mp4",
    await fetchFile(videoFile)
  )
  console.log("Writing file");

  const instructions = subtitleInstructions(subtitles);
  console.log("BUilding subtitles");
  const filter = instructions.join(",");

  await ffmpeg.exec([
    "-i",
    "input.mp4",
    "-vf",
    filter,
    "output.mp4"
  ])
  console.log("Running FFmpeg");

  console.log("Video exported!");
}

function subtitleInstructions(subtitles: Subtitle[]) {
  return subtitles.map(sub => {
    return (
      `drawtext=text='${escapeSub(sub.text)}'` + 
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