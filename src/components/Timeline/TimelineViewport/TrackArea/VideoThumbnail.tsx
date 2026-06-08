import { useEffect, useState } from "react";

interface VideoThumbnail {
    time: number;
    dataURL: string;
  }

interface VideoThumbnailProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string;
  duration: number;
  zoom: number;
}


export default function VideoThumbnail({
    videoRef,
    videoURL,
    duration,
    zoom
  }: VideoThumbnailProps) {

  const [thumbnails, setThumbnails] = useState<VideoThumbnail[]>([]); 
  
  async function generateThumbnails(
    video: HTMLVideoElement,
    videoDuration: number
  ) {
    const clipWidth = videoDuration * zoom;
    const thumbnailWidth = 80;
    const thumbnailCount = Math.ceil(clipWidth / thumbnailWidth);
    console.log("thumbnailCount =", thumbnailCount)

    const timeStep = videoDuration / thumbnailCount;

    console.log("Timestep =", timeStep);



    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
  
    canvas.width = 160;
    canvas.height = 90;
  
    const thumbs = [];
  
    for (let i = 0; i < thumbnailCount; i++) {
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
  
  return (
    <div className="flex h-full">
      {thumbnails?.map((thumb) => (
        <img 
          src={thumb.dataURL} 
          key={thumb.time}
          className="h-full object-cover shrink-0"
          style={{ width: "80px" }}
        />
      ))}
    </div>
  )
}