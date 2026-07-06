import { useEffect, useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import { timelineSourceTime } from "../../../../utils/timelineUtils";
import type { VideoSegment } from "../../../../utils/types";

interface PlayheadProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  rulerRef: React.RefObject<HTMLDivElement | null>;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  zoom: number;
  duration: number;
  videoSegments: VideoSegment[];
}

export default function Playhead({
    videoRef,
    rulerRef,
    currentTime,
    setCurrentTime,
    zoom,
    duration,
    videoSegments
  }: PlayheadProps) {
  
  const playheadLeft = currentTime * zoom;

  function handlePlayheadMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setIsDraggingPlayhead(true);
  }

  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDraggingPlayhead) return;

      const ruler = rulerRef.current;
      const video = videoRef.current;
      if (!ruler || !video || !duration) return;

      const rect = ruler.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const timelineTime = x / zoom;
      const sourceTime = timelineSourceTime(timelineTime, videoSegments)

      video.currentTime = sourceTime;
      setCurrentTime(timelineTime);
    }
    function handleMouseUp() {
      setIsDraggingPlayhead(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingPlayhead, duration]);

  return (
    <div
      className="absolute top-0 bottom-0 w-0.5 bg-[#7c5cbf] pointer-events-none"
      style={{ left: `${playheadLeft}px` }}
    >
      <BiSolidDownArrow 
      onMouseDown={handlePlayheadMouseDown}
      className={`absolute -top-1 left-1/2 -translate-x-1/2 text-sm text-[#7c5cbf] pointer-events-auto ${isDraggingPlayhead ? "cursor-grabbing" : "cursor-grab"}`}/>
    </div>
  )
}

