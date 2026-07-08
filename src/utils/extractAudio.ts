import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { VideoSegment } from "./types";

const ffmpeg = new FFmpeg(); 



export async function extractAudio(videoFile: File, videoSegments: VideoSegment[]) {
  if (!ffmpeg.loaded) {
    await ffmpeg.load();
  }

  await ffmpeg.writeFile(
    "input.mp4",
    await fetchFile(videoFile)
  );

  const segmentFiles: string[] = [];

  for (let i = 0; i < videoSegments.length; i++) {
    const seg = videoSegments[i];
    const outName = `audio_seg${i}.mp4`;

    await ffmpeg.exec([
      "-i", "input.mp4",
      "-ss", String(seg.sourceStart),
      "-to", String(seg.sourceEnd),
      "-avoid_negative_ts", "make_zero",
      "-vn",
      outName,
    ]);
    segmentFiles.push(outName);
  }

  const concatList = segmentFiles.map(f => `file '${f}'`).join("\n");
  await ffmpeg.writeFile("concat.txt", concatList);

  await ffmpeg.exec([
    "-f", "concat",
    "-safe", "0",
    "-i", "concat.txt",
    "-c", "copy",
    "output_audio.mp3",
  ]);

  const data = await ffmpeg.readFile("output_audio.mp3");

  return new Blob([data as Uint8Array<ArrayBuffer>], {
    type: "audio/mp3"
  });
}