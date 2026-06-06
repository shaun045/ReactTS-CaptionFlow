import { useState, useRef } from "react";
import TimelineRuler from "./TimelineRuler";
import TimelineToolBar from "./TimelineToolBar";
import TrackArea from "./TrackArea/TrackArea";

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
    />
    <div className="relative">
      {/* Ruler */}
      <TimelineRuler 
        videoRef={videoRef}
        videoURL={videoURL}
        duration={duration}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        zoom={zoom}
        rulerRef={rulerRef}
      />

      {/* Track area */}
      <TrackArea 
        videoRef={videoRef}
        videoURL={videoURL}
        subtitles={subtitles}
        rulerRef={rulerRef}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        duration={duration}
        zoom={zoom}
      />
    </div>

    </div>
  )
}