import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg(); 

export async function extractAudio(videoFile: File) {
  if (!ffmpeg.loaded) {
    await ffmpeg.load();
  }

  await ffmpeg.writeFile(
    "input.mp4",
    await fetchFile(videoFile)
  );

  await ffmpeg.exec([
    "-i",
    "input.mp4",
    "output.mp3"
  ]);

  const data = await ffmpeg.readFile("output.mp3");

  return new Blob([data as unknown as BlobPart], {
    type: "audio/mpeg"
  });
}