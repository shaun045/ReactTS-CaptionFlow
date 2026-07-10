import type { Subtitle } from "../../../../utils/types";

interface SubtitleTrackProps {
  subtitles: Subtitle[];
  zoom: number;
  activeTool: "select" | "cut";
  deleteSubtitle: (id: string) => void;
  selectedSub: string | null;
  setSelectedSub: React.Dispatch<React.SetStateAction<string | null>>
}

export default function SubtitleTrack({subtitles, zoom, activeTool, selectedSub, setSelectedSub}: SubtitleTrackProps) {

  return (
    <div className="relative h-15 rounded-lg mb-2 overflow-hidden">
      {subtitles.map((subtitle) => {
        
        const pixelsPerSecond = zoom;
        const left = subtitle.startTime * pixelsPerSecond;
        const subEndTime = subtitle.endTime - 0.02;

        const width = Math.max(
          (subEndTime - subtitle.startTime) * pixelsPerSecond, 50
        )

        return (
          <div
            key={subtitle.id}
            onClick={() => setSelectedSub(prev => prev === subtitle.id ? null : subtitle.id)}
            className={`
              absolute
              top-1
              bottom-1
              bg-purple-500
              rounded-md
              text-xs
              px-2
              flex
              items-center
              overflow-hidden
              text-ellipsis
              ${activeTool === "cut"
                ? ""
                : "hover:cursor-pointer"
              }
              ${subtitle.id === selectedSub 
                ? "border-2 border-white"
                : ""
              }
              `}
            style={{
              left: `${left}px`,
              width: `${width}px`
            }}
          >
            {subtitle.text}
          </div>
        );
      })}
    </div>
  )
}