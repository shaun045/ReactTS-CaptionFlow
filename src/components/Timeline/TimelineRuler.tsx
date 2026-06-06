
interface TimelineRulerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string | null;
  duration: number;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  zoom: number;
  rulerRef: React.RefObject<HTMLDivElement | null>;
}


export default function TimelineRuler({
      videoRef, 
      duration, 
      setCurrentTime,
      rulerRef,
      zoom
  }: TimelineRulerProps) {
  
  const interval = duration <= 60 ? 5 : duration <= 300 ? 10 : duration <= 600 ? 30 : 60;
  
  function handleRulerClick(e: React.MouseEvent<HTMLDivElement>) {
    const ruler = rulerRef.current;
    const video = videoRef.current;
    if (!ruler || !video || !duration) return;

    const rect = ruler.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekTime = clickX / zoom;

    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  }

  return (
    <div className="relative flex flex-col flex-1 mx-3 mb-3">
    
    <div 
      ref={rulerRef} 
      onClick={handleRulerClick} 
      className="relative h-6 mb-1 cursor-pointer overflow-x-hidden">
      <div className="relative h-full"
        style={{ width: `${duration * zoom}px` }}
      >

        {duration > 0 && Array.from({ length: Math.floor(duration / interval) + 1 }).map((_, i) => {
          const timeAtTick = i * interval;
          const left = timeAtTick * zoom;
          const timelineWidth = duration * zoom;

          if (left > timelineWidth) return null;
          return (
            <div key={i} className="absolute flex flex-col items-start bottom-0" style={{ left: `${left}px` }}>
              <span className="text-[10px] text-[#6b5a80]">
                {timeAtTick >= 60
                  ? `${Math.floor(timeAtTick / 60)}m${timeAtTick % 60 > 0 ? `${timeAtTick % 60}s` : ""}`
                  : `${timeAtTick}s`}
              </span>
              <div className="w-px h-3 bg-[#5a4070]"/>
            </div>
          );
        })}
      </div>
    </div>

  </div>
  )
}