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
) {
  const ffmpeg = new FFmpeg();

  ffmpeg.on("progress", ({progress}) => {
    onProgress?.(Math.round(progress * 100));
  }); 

  await ffmpeg.load();

  await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

  const srtContent = generateSRT(subtitles);
  await ffmpeg.writeFile("subtitles.srt", srtContent);

  const color = selectedColor ?? "white";
  const size = fontSize ?? 24;
  const fontName = selectedFont ?? "Arial";
  const marginV = Math.round((subtitlePos.y / 100) * 100);

  const subtitleFilter = `subtitles=subtitles.srt:force_style='FontName=${fontName},FontSize=${size},PrimaryColour=${color},MarginV=${marginV}'`;

  await ffmpeg.exec([
    "-i", "input.mp4",
    "-vf", subtitleFilter,
    "-c:a", "copy",
    "-c:v", "libx264",
    "output.mp4"
  ]);

  const data = await ffmpeg.readFile("output.mp4");
  const blob = new Blob([data], {type: "video/mp4"});
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