import { useEffect, useState } from "react";
import type { VideoSegment } from "../../../../utils/types";

interface VideoThumbnail {
    time: number;
    dataURL: string;
  }

interface VideoThumbnailProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string;
  duration: number;
  zoom: number;
  activeTool: "select" | "cut";
  videoSegments: VideoSegment[];
  deleteVideoSegment: (id: string) => void;
  selectedSeg: string | null;
  setSelectedSeg: React.Dispatch<React.SetStateAction<string | null>>;
}


export default function VideoThumbnail({
    videoRef,
    videoURL,
    duration,
    zoom,
    videoSegments,
    selectedSeg,
    setSelectedSeg
  }: VideoThumbnailProps) {

  const [thumbnails, setThumbnails] = useState<VideoThumbnail[]>([]); 


  async function generateThumbnails(
      video: HTMLVideoElement,
      videoDuration: number
    ) {
      const FIXED_COUNT = 20;

      const timeStep = videoDuration / FIXED_COUNT;
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
    
      canvas.width = 160;
      canvas.height = 90;
    
      const thumbs: VideoThumbnail[] = [];
    
      for (let i = 0; i < FIXED_COUNT; i++) {
        const t = i * timeStep;
        video.currentTime = t;
    
        await new Promise((resolve) => {
          video.onseeked = () => {
            resolve(null);
          };
        });
    
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        thumbs.push({
          time: t,
          dataURL: canvas.toDataURL(),
        });
      }
      return thumbs;
    }
  

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !videoURL) return;

    async function loadThumbnails() {
      const thumbs = await generateThumbnails(
        videoElement!,
        videoElement!.duration
      );

      setThumbnails(thumbs);
    }

    const handleLoadedMetadata = () => {
      loadThumbnails();
    };

    if (!Number.isNaN(videoElement.duration) && videoElement.duration > 0) {
      loadThumbnails();
    } else {
      videoElement.addEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    }

    return () => {
      videoElement.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    };
  }, [videoURL, videoRef]) 

  const trackWidth = duration * zoom;

  return (
    <>
      {videoSegments.map((seg) => {
        const left = seg.timelineStart * zoom;
        const width = (seg.timelineEnd - seg.timelineStart) * zoom;
        const thumbnailWidth = trackWidth / thumbnails.length;
        const offset = seg.sourceStart * zoom


        return (
          <div 
            key={seg.id}
            style={{ left: `${left + 1}px`, width: `${width - 2}px` }}
            onClick={() => setSelectedSeg(prev => prev === seg.id ? null : seg.id)}
            className={`fabsolute h-full overflow-hidden flex rounded-sm border bg-[#1e2f5c] ${selectedSeg === seg.id ? "border-white" : "border-blue-400"}`}
          >
            <div className="flex h-full shrink-0"
              style={{
                transform: `translateX(-${offset}px)`,
                left: `${left + 1}px`, width: `${width - 2}px`
            }}
            >
              {thumbnails.map((thumb) => (
                <img 
                  src={thumb.dataURL} 
                  key={thumb.time}
                  className="h-full object-cover shrink-0"
                  style={{ width: `${thumbnailWidth}px` }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  )
}