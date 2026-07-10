import SubtitleTrack from "./SubtitleTrack";
import Playhead from "./Playhead";
import VideoThumbnail from "./VideoThumbnail";
import type { VideoSegment, Subtitle } from "../../../../utils/types";


interface TrackAreaProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  videoURL: string | null;
  subtitles: Subtitle[];
  rulerRef: React.RefObject<HTMLDivElement | null>;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  duration: number;
  zoom: number;
  activeTool: "select" | "cut";
  videoSegments: VideoSegment[];
  deleteSubtitle: (id: string) => void;
  deleteVideoSegment: (id: string) => void;
  selectedSub: string | null;
  setSelectedSub: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSeg: string | null;
  setSelectedSeg: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function TrackArea({
      videoRef,
      videoURL,
      rulerRef,
      subtitles,
      currentTime,
      setCurrentTime,
      duration,
      zoom,
      activeTool,
      videoSegments,
      deleteSubtitle,
      deleteVideoSegment,
      selectedSub,
      setSelectedSub,
      selectedSeg,
      setSelectedSeg
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
              activeTool={activeTool}
              deleteSubtitle={deleteSubtitle}
              selectedSub={selectedSub}
              setSelectedSub={setSelectedSub}
            />

            {/* Video Track */}
            <div className="relative h-12 flex overflow-hidden gap-1">
              <VideoThumbnail 
                videoRef={videoRef}
                videoURL={videoURL}
                duration={duration}
                zoom={zoom}
                activeTool={activeTool}
                videoSegments={videoSegments}
                deleteVideoSegment={deleteVideoSegment}
                selectedSeg={selectedSeg}
                setSelectedSeg={setSelectedSeg}
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
                videoSegments={videoSegments}
              />
            )}
            
            </div>
        )
        : <span className="text-sm text-[#4a3660]">+ Add media to this project</span>
      }
      
    </div>
  )
}