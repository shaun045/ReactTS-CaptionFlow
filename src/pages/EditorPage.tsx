import { useRef, useState } from "react";
import MainEditor from "../components/MainEditor/MainEditor";
import SideBar from "../components/SideBar/SideBar";
import SubtitlePanel from "../components/SubtitlePanel/SubtitlePanel";
import Timeline from "../components/Timeline/Timeline";
import logo from "../assets/logo/Logo-bgremoved.png";

export default function EditorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<{id: number, text: string, startTime: number, endTime: number}[]>([]);

  return (
    <div className='flex flex-col text-white items-center w-full h-screen'>
      <div className="flex w-full py-2 bg-[#1d0d27]">
        <img src={logo} alt="logo" className="w-10"/>
        <h1 className="flex text-xl font-bold items-center">
          CAPTION FLOW
        </h1>
      </div>

      <div className='flex flex-1 overflow-hidden w-full h-screen'>
        <SideBar />
        <MainEditor 
          videoRef={videoRef} 
          videoURL={videoURL} 
          setVideoURL={setVideoURL}
        />
        <SubtitlePanel 
          videoRef={videoRef}
          videoURL={videoURL}
          subtitles={subtitles}
          setSubtitles={setSubtitles}
        />
      </div>

      <Timeline 
        videoRef={videoRef}
        videoURL={videoURL}
      />

    </div>
)
}