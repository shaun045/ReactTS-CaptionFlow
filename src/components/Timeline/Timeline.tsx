import { useState, useRef } from "react";
import TimelineToolBar from "./TimelineToolBar/TimelineToolBar"
import TimelineViewport from "./TimelineViewport/TimelineViewport";

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [activeTool, setActiveTool] = useState<"select" | "cut">("select");
  const rulerRef = useRef<HTMLDivElement>(null);
  
  return(
    <div className="flex flex-col w-full h-70 bg-[#1a1025] border-t border-[#2e1f40]">

    {/* Toolbar */}
    <TimelineToolBar 
      videoRef={videoRef}
      videoURL={videoURL}
      setCurrentTime={setCurrentTime}
      currentTime={currentTime}
      setDuration={setDuration}
      duration={duration}
      setZoom={setZoom}

      activeTool={activeTool}
      setActiveTool={setActiveTool}
    />

    <TimelineViewport 
      videoRef={videoRef}
      videoURL={videoURL}
      subtitles={subtitles}
      currentTime={currentTime}
      setCurrentTime={setCurrentTime}
      duration={duration}
      rulerRef={rulerRef}
      zoom={zoom}

      activeTool={activeTool}
      setActiveTool={setActiveTool}
    />

    </div>
  )
}