import { useEffect, useState } from "react";

interface VideoThumbnail {
    time: number;
    dataURL: string;
  }

interface VideoThumbnailProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string;
}


export default function VideoThumbnail({
    videoRef,
    videoURL
  }: VideoThumbnailProps) {
    
  console.log("VideoThumbnail rendered");
  const [thumbnails, setThumbnails] = useState<VideoThumbnail[]>([]); 
  
  async function generateThumbnails(
    video: HTMLVideoElement,
    duration: number
  ) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
  
    canvas.width = 160;
    canvas.height = 90;
  
    const thumbs = [];
  
    for (let t = 0; t < duration; t += 5) {
      console.log("Seeking to", t);

      video.currentTime = t;
  
      await new Promise((resolve) => {
        video.onseeked = () => {
          console.log("Seeked to", t);
          resolve(null);
        };
      });

      console.log("Drawing", t);
  
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      thumbs.push({
        time: t,
        dataURL: canvas.toDataURL(),
      });
    }
    return thumbs;
  }
  

  useEffect(() => {
    console.log("VideoThumbnail effect fired");

    async function loadThumbnails() {
      console.log("loadThumbnails called");

      const video = videoRef.current;

      console.log("videoRef.current =", video);
    
      if (!video) return;
    
      console.log("video.duration =", video.duration)

      const thumbs = await generateThumbnails(
        video,
        video.duration
      );

      console.log("thumbs =", thumbs.length);
    
      setThumbnails(thumbs)
    }

    if (videoURL) {
      loadThumbnails();
    }
  }, [videoURL, videoRef]) 
  
  return (
    <div className="flex h-full">
      {thumbnails?.map((thumb) => (
        <img 
          src={thumb.dataURL} 
          key={thumb.time}
          className="h-full w-auto object-cover flex shrink-0"
        />
      ))}
    </div>
  )
}