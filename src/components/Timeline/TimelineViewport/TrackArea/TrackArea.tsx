import SubtitleTrack from "./SubtitleTrack";
import Playhead from "./Playhead";
import VideoThumbnail from "./VideoThumbnail";

interface Subtitle {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

interface TrackAreaProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  videoURL: string | null;
  subtitles: Subtitle[];
  rulerRef: React.RefObject<HTMLDivElement | null>;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  duration: number;
  zoom: number;
}

export default function TrackArea({
      videoRef,
      videoURL,
      rulerRef,
      subtitles,
      currentTime,
      setCurrentTime,
      duration,
      zoom
  }: TrackAreaProps) {

  return (
    <div className="flex bg-[#120c1c] rounded-lg border border-[#2e1f40] h-50 overflow-hidden">
      {videoURL
        ? (
            <div className="h-full px-3 py-2"
              style={{ width: `${duration * zoom}px` }}
            >

            {/* Subtitle Track */}
            <SubtitleTrack 
              subtitles={subtitles}
              zoom={zoom}
            />

            {/* Video Track */}
            <div className="relative h-12 bg-[#1e2f5c] rounded border border-blue-700 overflow-hidden">
              <VideoThumbnail 
                videoRef={videoRef}
                videoURL={videoURL}
                duration={duration}
                zoom={zoom}
              />
            </div>

            {/* Single playhead spanning ruler + track */}
            {videoURL && (
              <Playhead 
                videoRef={videoRef}
                rulerRef={rulerRef}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                zoom={zoom}
                duration={duration}
              />
            )}
            
            </div>
        )
        : <span className="text-sm text-[#4a3660]">+ Add media to this project</span>
      }
      
    </div>
  )
}