import type { Subtitle, SubtitleStyle } from "./types"


export default function rendererSubtitleFrame(
    canvas: HTMLCanvasElement,
    currentTime: number,
    subtitles: Subtitle[], 
    style: SubtitleStyle,
    videoWidth: number,
    videoHeight: number
) {

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const visibleSubs = subtitles.filter(sub => currentTime >= sub.startTime && currentTime <= sub.endTime);
  console.log(visibleSubs);

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  // const subStyle = `${style.fontSize}px ${style.font}`;
  
  // ctx.font = subStyle;
  // ctx.fillStyle = style.color ?? "white";

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
      style:SubtitleStyle, 
      x:number, 
      y:number, 
      ) {
    const metrics = ctx.measureText(text);
    const padding = 10;
    const textHeight = style.fontSize;
    const rectWidth = metrics.width + padding * 10;
    const rectHeight = textHeight + padding * 5;
    const rectX = x - rectWidth / 2;
    const rectY = y - rectHeight / 2;
    const borderRadius = 20;

    ctx.save();

    ctx.clearRect(rectX - 1, rectY - 1, rectWidth + 2, rectHeight + 2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.beginPath(); 
    ctx.roundRect(rectX, rectY, rectWidth, rectHeight, borderRadius); 
    ctx.fill();

    ctx.restore();
    
    // ctx.fillRect(
    //   rectX, 
    //   rectY,
    //   rectWidth,
    //   rectHeight   
    // );
  }

  function drawSubtitle(
      ctx: CanvasRenderingContext2D, 
      subtitle: Subtitle, 
      style: SubtitleStyle, 
      x: number, 
      y: number
  ) {
      // SET FONT
      ctx.font = `${style.fontSize}px ${style.font}`;
      ctx.fillStyle = style.color ?? "white";
      
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const gradient = ctx.createLinearGradient(
        x1, y1,
        x2, y2
      );

      gradient.addColorStop(0, "red");
      gradient.addColorStop(1, "blue");

      const isGradient = style.color?.startsWith("linear-gradient");
      if (isGradient) {
        const gradientColors = style.color
                    ?.replace("linear-gradient(to right,", "")
                    .replace(")", "")
                    .split(",");

      const startColor = gradientColors?.[0].trim();
      const endColor = gradientColors?.[1].trim();
      console.log(startColor, endColor);
      }
      
      ctx.fillStyle = gradient;
      

      switch (style.style) {
        case "background": 
            applyBackgroundStyle(ctx, subtitle.text, style, x, y);
            break;
        case "outline": 
            applyOutlineStyle(ctx); 
            ctx.strokeText(subtitle.text, x, y);
            break;
        case "glow": 
            applyGlowStyle(ctx, style);
            break;
        case "shadow": 
            applyShadowStyle(ctx, style);
            break;
      }

      //DRAW THE TEXT
      ctx.fillText(subtitle.text, x, y);

      console.log("Drawing: ", subtitle.text, x, y);
  }
  
  console.log(style.color);

  visibleSubs.forEach(sub => {
    const x = (style.pos.x * canvas.width) / 100;
    const y = (style.pos.y * canvas.height) / 100;

    drawSubtitle(ctx, sub, style, x, y)
    
  })
  canvas.style.border = "2px solid red";

  return canvas;
}

