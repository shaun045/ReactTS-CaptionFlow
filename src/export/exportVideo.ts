import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { Subtitle } from "../utils/types";

export async function exportVideo(
  videoFile: File,
  subtitles: Subtitle[],
  subtitlePos: {x: number; y: number},
  fontSize: number,
  selectedFont: string | null,
  selectedColor: string | null,
  onProgress?: (progress: number) => void
) {}