import { PiScissorsBold } from "react-icons/pi";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import { IoPlaySharp } from "react-icons/io5";
import { IoPauseSharp } from "react-icons/io5";
import { useState } from "react";

interface TimelineProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string | null;
}

export default function Timeline({videoRef, videoURL}: TimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  }

  return(
    <div className="flex flex-col w-full h-60 bg-[#1a1025] border-t border-[#2e1f40]">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <PiScissorsBold className="text-xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"/>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#a89bc0] tabular-nums">0:00:00</span>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e2d9f3] text-[#1a1025] hover:bg-white transition-colors hover:cursor-pointer"
          onClick={togglePlay}
          disabled={!videoURL}
          >
            {isPlaying ? <IoPauseSharp className="text-sm ml-1"/> : <IoPlaySharp className="text-sm ml-1"/>}
          </button>
          <span className="text-xs text-[#a89bc0] tabular-nums">0:00:00</span>
        </div>

        <div className="flex items-center gap-2">
          <MdZoomOut className="text-xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"/>
          <MdZoomIn className="text-xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"/>
        </div>
      </div>

      {/* Ruler */}
      <div className="relative h-6 mx-3 mb-1">
        <div className="flex items-end h-full gap-0">
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} className="flex flex-col items-start" style={{ flex: 1 }}>
              <span className="text-[10px] text-[#6b5a80]">{i === 0 ? "0s" : `${i * 5}s`}</span>
              <div className="w-px h-2.5 bg-[#5a4070]"/>
            </div>
          ))}
        </div>
      </div>

      {/* Track area */}
      <div className="flex-1 mx-3 mb-3 bg-[#120c1c] rounded-lg border border-[#2e1f40] flex items-center justify-center">
        {videoURL
          ? (
            <div className="w-full h-full px-2 py-2 flex items-center">
              <div className="h-8 flex-1 bg-[#2e1a4a] rounded-md border border-[#4a2e70] flex items-center px-3 gap-2">
                <span className="text-xs text-[#c4a8e8]">video.mp4</span>
              </div>
            </div>
          )
          : <span className="text-sm text-[#4a3660]">+ Add media to this project</span>
        }
      </div>

    </div>
  )
}