import { useState, useEffect, useRef } from "react";
import { PiScissorsBold } from "react-icons/pi";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import { IoPlaySharp } from "react-icons/io5";
import { IoPauseSharp } from "react-icons/io5";
import { BiSolidDownArrow } from "react-icons/bi";


interface TimelineProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string | null;
  subtitles: Subtitle[];
}

interface Subtitle {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

export default function Timeline({videoRef, videoURL, subtitles}: TimelineProps) {

  const [isPlaying, setIsPlaying] = useState(false);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  }

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoURL]);

  const rulerRef = useRef<HTMLDivElement>(null);

  function handleRulerClick(e: React.MouseEvent<HTMLDivElement>) {
    const ruler = rulerRef.current;
    const video = videoRef.current;
    if (!ruler || !video || !duration) return;

    const rect = ruler.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const seekTime = percent * duration;

    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  }

  const interval = duration <= 60 ? 5 : duration <= 300 ? 10 : duration <= 600 ? 30 : 60;

  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  function handlePlayheadMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setIsDraggingPlayhead(true);
  }

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDraggingPlayhead) return;

      const ruler = rulerRef.current;
      const video = videoRef.current;
      if (!ruler || !video || !duration) return;

      const rect = ruler.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = x / rect.width;
      const seekTime = percent * duration;

      video.currentTime = seekTime;
      setCurrentTime(seekTime);
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

  
  
  return(
    <div className="flex flex-col w-full h-70 bg-[#1a1025] border-t border-[#2e1f40]">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <PiScissorsBold className="text-xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"/>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#a89bc0] tabular-nums">{formatTime(currentTime)}</span>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e2d9f3] text-[#1a1025] hover:bg-white transition-colors hover:cursor-pointer"
          onClick={togglePlay}
          disabled={!videoURL}
          >
            {isPlaying ? <IoPauseSharp className="text-sm"/> : <IoPlaySharp className="text-sm ml-1"/>}
          </button>
          <span className="text-xs text-[#a89bc0] tabular-nums">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center gap-2">
          <MdZoomOut className="text-xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"/>
          <MdZoomIn className="text-xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"/>
        </div>
      </div>

        {/* Ruler */}
        <div className="relative flex flex-col flex-1 mx-3 mb-3">
    
        <div ref={rulerRef} onClick={handleRulerClick} className="relative h-6 mb-1 cursor-pointer">
          <div className="relative w-full h-full">

            {duration > 0 && Array.from({ length: Math.floor(duration / interval) + 1 }).map((_, i) => {
              const timeAtTick = i * interval;
              const percent = (timeAtTick / duration) * 100;
              if (percent > 100) return null;
              return (
                <div key={i} className="absolute flex flex-col items-start bottom-0" style={{ left: `${percent}%` }}>
                  <span className="text-[10px] text-[#6b5a80]">
                    {timeAtTick >= 60
                      ? `${Math.floor(timeAtTick / 60)}m${timeAtTick % 60 > 0 ? `${timeAtTick % 60}s` : ""}`
                      : `${timeAtTick}s`}
                  </span>
                  <div className="w-px h-2.5 bg-[#5a4070]"/>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track area */}
        <div className="flex-1 bg-[#120c1c] rounded-lg border border-[#2e1f40] overflow-x-auto">
          {videoURL
            ? (
              <div className="w-full h-full px-2 py-2"
                style={{ width: `${duration * 100}px` }}
              >

              {/* Subtitle Track */}
              <div className="relative h-12 bg-[#2e1a4a] rounded-md border border-[#4a2e70] mb-2">
                {subtitles.map((subtitle) => {
                  const left =
                    duration > 0
                      ? (subtitle.startTime / duration) * 100
                      : 0;

                  const width =
                    duration > 0
                      ? Math.max(((subtitle.endTime - subtitle.startTime) / duration) * 100, 5)
                      : 5;

                  return (
                    <div
                      key={subtitle.id}
                      className="absolute top-0 h-full bg-purple-500 rounded text-xs px-2 flex items-center overflow-hidden whitespace-nowrap"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`
                      }}
                    >
                      {subtitle.text}
                    </div>
                  );
                })}
              </div>

              {/* Video Track */}
              <div className="relative h-12 bg-[#1e2f5c] rounded border border-blue-700">
                <div className="absolute inset-0 flex items-center px-2">
                  video.mp4
                </div>
              </div>
              
              </div>
            )
            : <span className="text-sm text-[#4a3660]">+ Add media to this project</span>
          }
        </div>

        {/* Single playhead spanning ruler + track */}
        {videoURL && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#7c5cbf] pointer-events-none"
            style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          >
            <BiSolidDownArrow 
            onMouseDown={handlePlayheadMouseDown}
            className={`absolute -top-1 left-1/2 -translate-x-1/2 text-sm text-[#7c5cbf] pointer-events-auto ${isDraggingPlayhead ? "cursor-grabbing" : "cursor-grab"}`}/>
          </div> 
        )}

      </div>

    </div>
  )
}