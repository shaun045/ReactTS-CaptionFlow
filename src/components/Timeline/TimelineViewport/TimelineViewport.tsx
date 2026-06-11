import TimelineRuler from "./TimelineRuler";
import TrackArea from "./TrackArea/TrackArea";
import { RAZOR_CURSOR } from "../../../utils/cursors";
import { useState } from "react";

interface Subtitle {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

interface VideoSegment {
  id: number;
  startTime: number;
  endTime: number;
}

interface TimelineViewportProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string | null;
  subtitles: Subtitle[];
  duration: number;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  zoom: number;
  rulerRef: React.RefObject<HTMLDivElement | null>;
  activeTool: "select" | "cut";
  setActiveTool: React.Dispatch<React.SetStateAction<"select" | "cut">>;
  setSubtitles: React.Dispatch<React.SetStateAction<{
      id: number;
      text: string;
      startTime: number;
      endTime: number;
  }[]>>;
  videoSegments: VideoSegment[];
  setVideoSegments: React.Dispatch<React.SetStateAction<{
      id: number;
      startTime: number;
      endTime: number;
  }[]>>
}

export default function TimelineViewport({
    videoRef,
    videoURL,
    subtitles,
    duration,
    currentTime,
    setCurrentTime,
    zoom,
    rulerRef,
    activeTool,
    setSubtitles,
    videoSegments,
    setVideoSegments
  }:TimelineViewportProps) {

  function getTimeFromClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = e.currentTarget.scrollLeft;
    const x = e.clientX - rect.left + scrollLeft;
    const trackWidth = duration * zoom
    return (x / trackWidth) * duration;
  }

  function handleCut(time: number) {
    const target = subtitles.find(
      (sub) => time >= sub.startTime && time <= sub.endTime
    );

    if (!target) return;

    setSubtitles(prev => prev.flatMap(sub => 
      sub.id === target.id
        ? [
          {...sub, endTime: time},
          {...sub, id: Date.now(), startTime: time}
        ]
        : [sub]
    ));
  }

  function handleCutVideo(time: number) {
    const target = videoSegments.find(
      (seg) => time >= seg.startTime && time <= seg.endTime
    );

    if (!target) return;

    setVideoSegments(prev => prev.flatMap(seg =>
      seg.id === target.id
        ? [
          {...seg, endTime: time},
          {...seg, id: Date.now(), startTime: time}
        ]
        : [seg]
    ));
  }

  const [hoverX, setHoverX] = useState<number | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (activeTool !== "cut") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = e.currentTarget.scrollLeft;
    setHoverX(e.clientX - rect.left + scrollLeft);
  }

  function handleMouseLeave() {
    setHoverX(null);
  }

  
  
  return (
    <div className="relative overflow-x-auto overflow-y-hidden"
        style={{cursor: activeTool === "cut" ? RAZOR_CURSOR : "default"}}
        onMouseDown={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          if (activeTool !== "cut") return;
          const time = getTimeFromClick(e);
          handleCut(time);
        }}
    >
    {activeTool === "cut" && hoverX !== null && (
      <div
        className="absolute top-0 bottom-0 w-px bg-red-400 pointer-events-none z-50"
        style={{ left: `${hoverX}px` }}
      />
    )}
      
      <div
        className="min-w-full"
        style={{ width: `${duration * zoom}px` }}
      >
        {/* Ruler */}
        <TimelineRuler 
          videoRef={videoRef}
          videoURL={videoURL}
          duration={duration}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          zoom={zoom}
          rulerRef={rulerRef}
          activeTool={activeTool}
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
          activeTool={activeTool}
        />
      </div>
    </div>
  )
}