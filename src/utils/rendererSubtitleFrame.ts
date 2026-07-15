import type { Subtitle, SubtitleStyle } from "./types"


export default function rendererSubtitleFrame(
    currentTime: number,
    subtitles: Subtitle[], 
    style: SubtitleStyle,
    videoWidth: number,
    videoHeight: number
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const visibleSubs = subtitles.filter(sub => currentTime >= sub.startTime && currentTime <= sub.endTime);

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  const x = (style.pos.x * canvas.width) / 100;
  const y = (style.pos.y * canvas.height) / 100;

  const subStyle = `${style.fontSize}px ${style.font}`;

  visibleSubs.forEach(sub => {
    ctx.font = subStyle;
    ctx?.fillText(sub.text, x, y);
  })
}