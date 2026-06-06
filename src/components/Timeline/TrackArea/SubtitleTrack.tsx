
interface Subtitle {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

interface SubtitleTrackProps {
  subtitles: Subtitle[];
  zoom: number;
}

export default function SubtitleTrack({subtitles, zoom}: SubtitleTrackProps) {
  return (
    <div className="relative h-15 rounded-md mb-2">
      {subtitles.map((subtitle) => {
        
        const pixelsPerSecond = zoom;
        const left = subtitle.startTime * pixelsPerSecond;
        const subEndTime = subtitle.endTime - 0.05;

        const width = Math.max(
          (subEndTime - subtitle.startTime) * pixelsPerSecond, 50
        )

        return (
          <div
            key={subtitle.id}
            className="
              absolute
              top-1
              bottom-1
              bg-purple-500
              rounded-md
              text-xs
              px-3
              flex
              items-center
              overflow-hidden
              text-ellipsis
              "
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