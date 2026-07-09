import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { VideoSegment } from "./types";




export async function extractAudio(
  videoFile: File, 
  videoSegments: VideoSegment[]
): Promise<Blob> {
  const ffmpeg = new FFmpeg(); 
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
    const outName = `audio_seg${i}.wav`;

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
    "output_audio.wav",
  ]);

  const data = await ffmpeg.readFile("output_audio.wav");

  return new Blob([data as Uint8Array<ArrayBuffer>], {
    type: "audio/wav"
  });
}