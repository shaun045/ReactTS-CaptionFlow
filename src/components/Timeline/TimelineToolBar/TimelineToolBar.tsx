import { useState, useEffect } from "react";
import { PiScissorsBold } from "react-icons/pi";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import { IoPlaySharp } from "react-icons/io5";
import { IoPauseSharp } from "react-icons/io5";


interface TimelineToolBarProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  videoURL: string | null;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  currentTime: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  duration: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  activeTool: "select" | "cut";
  setActiveTool: React.Dispatch<React.SetStateAction<"select" | "cut">>;
}


export default function TimelineToolBar({
      videoRef, 
      videoURL, 
      setCurrentTime,
      currentTime,
      setDuration,
      duration,
      setZoom,
      activeTool,
      setActiveTool
    }: TimelineToolBarProps) {
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

  function zoomIn() {
      setZoom(prev => prev + 50);
    }
  
  function zoomOut() {
    setZoom(prev => Math.max(50, prev -  50));
  }

  return (
    <div className="flex items-center justify-between px-3 py-2">

      <div className="flex items-center gap-2">
        <PiScissorsBold 
          onClick={() => setActiveTool(prev => prev === "cut" ? "select" : "cut")}
          className={`hover:cursor-pointer ${activeTool === "cut" ? "text-white" : "text-[#a89bc0]"}`}
        />
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
        <MdZoomOut className="text-xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"
          onClick={zoomOut}
        />

        <MdZoomIn className="text-xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"
          onClick={zoomIn}
        />
      </div>
  </div>
  )
}