import TimelineRuler from "./TimelineRuler";
import TrackArea from "./TrackArea/TrackArea";

interface Subtitle {
  id: number;
  text: string;
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
}

export default function TimelineViewport({
    videoRef,
    videoURL,
    subtitles,
    duration,
    currentTime,
    setCurrentTime,
    zoom,
    rulerRef
  }:TimelineViewportProps) {
  
  
  return (
    <div className="relative overflow-x-auto overflow-y-hidden">
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