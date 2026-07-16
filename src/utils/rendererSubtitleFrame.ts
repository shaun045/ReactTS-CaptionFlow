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

  if (!ctx) return;

  const visibleSubs = subtitles.filter(sub => currentTime >= sub.startTime && currentTime <= sub.endTime);

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  

  const subStyle = `${style.fontSize}px ${style.font}`;
  
  ctx.font = subStyle;
  ctx.fillStyle = style.color ?? "white";

  function applyGlowStyle(ctx:CanvasRenderingContext2D, style: SubtitleStyle) {
      ctx.shadowColor = style.color ?? "white";
      ctx.shadowBlur = 20;
  }

  function applyOutlineStyle(ctx:CanvasRenderingContext2D) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
  }

  function applyShadowStyle(ctx:CanvasRenderingContext2D, style: SubtitleStyle) {
    ctx.shadowColor = style.color ?? "white";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
  }

  function applyBackgroundStyle(
      ctx:CanvasRenderingContext2D, 
      text:string, 
      x:number, 
      y:number, 
      style:SubtitleStyle) {
    const metrics = ctx.measureText(text);
    const padding = 5;
    const textHeight = style.fontSize;
    ctx.fillRect(
      x, 
      y,
      metrics.width + padding * 2,
      textHeight
    )
  }


  visibleSubs.forEach(sub => {
    const x = (style.pos.x * canvas.width) / 100;
    const y = (style.pos.y * canvas.height) / 100;

    ctx.fillText(sub.text, x, y);
    
  })
}