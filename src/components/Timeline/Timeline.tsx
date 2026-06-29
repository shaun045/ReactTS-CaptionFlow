import { useState, useRef } from "react";
import TimelineToolBar from "./TimelineToolBar/TimelineToolBar"
import TimelineViewport from "./TimelineViewport/TimelineViewport";
import type { VideoSegment } from "../../utils/types";

interface TimelineProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string | null;
  subtitles: Subtitle[];
  setSubtitles: React.Dispatch<React.SetStateAction<Subtitle[]>>;
  videoSegments: VideoSegment[];
  setVideoSegments: React.Dispatch<React.SetStateAction<VideoSegment[]>>;
  deleteSubtitle: (id: number) => void;
  deleteVideoSegment: (id: number) => void;
  selectedSub: number | null;
  setSelectedSub: React.Dispatch<React.SetStateAction<number | null>>;
  selectedSeg: number | null;
  setSelectedSeg: React.Dispatch<React.SetStateAction<number | null>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

interface Subtitle {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

export default function Timeline({
    videoRef, 
    videoURL, 
    subtitles, 
    setSubtitles, 
    videoSegments, 
    setVideoSegments,
    deleteSubtitle,
    deleteVideoSegment,
    selectedSub,
    setSelectedSub,
    selectedSeg,
    setSelectedSeg,
    duration,
    setDuration
  }: TimelineProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [activeTool, setActiveTool] = useState<"select" | "cut">("select");
  const rulerRef = useRef<HTMLDivElement>(null);

  function handleSetDuration(d: number) {
    setDuration(d);
    setVideoSegments([
      {
        id: 1, 
        sourceStart: 0, 
        sourceEnd: d,
        timelineStart: 0,
        timelineEnd: d,
      }
    ]);
  }
  
  return(
    <div className="flex flex-col w-full h-70 bg-[#1a1025] border-t border-[#2e1f40]">

    {/* Toolbar */}
    <TimelineToolBar 
      videoRef={videoRef}
      videoURL={videoURL}
      setCurrentTime={setCurrentTime}
      currentTime={currentTime}
      setDuration={handleSetDuration}
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
      setSubtitles={setSubtitles}
      videoSegments={videoSegments}
      setVideoSegments={setVideoSegments}

      deleteSubtitle={deleteSubtitle}
      deleteVideoSegment={deleteVideoSegment}
      selectedSub={selectedSub}
      setSelectedSub={setSelectedSub}
      selectedSeg={selectedSeg}
      setSelectedSeg={setSelectedSeg}
    />

    </div>
  )
}