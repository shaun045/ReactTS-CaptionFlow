import { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdUpload } from "react-icons/md";
import { PiExportBold } from "react-icons/pi";
import { FaWindowClose } from "react-icons/fa";

interface MainEditorProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string | null;
  setVideoURL: (url: string | null) => void;
  subtitles: Subtitle[];
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
}

interface Subtitle {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}


export default function MainEditor({videoRef, videoURL, setVideoURL, subtitles, setVideoFile}: MainEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    setVideoURL(URL.createObjectURL(file));
    setVideoFile(file);
  }

  function removeVideo() {
    setVideoURL(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const [currentSubtitle, setCurrentSubtitle] = useState("");

  function updateCurrentSubtitle() {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;

    const activeSubtitle = subtitles.find(
      (subtitle) =>
        currentTime >= subtitle.startTime &&
        currentTime <= subtitle.endTime
    );
    setCurrentSubtitle(activeSubtitle?.text ?? "");
    console.log(activeSubtitle?.text);
  }

  return (
    <main className="relative flex justify-center items-center flex-col h-full flex-1">

      {
        <input 
          ref={fileInputRef}
          type="file" 
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      }

      <button className="absolute top-4 right-4 p-1.5 px-5 text-sm rounded-sm bg-[#1d0d27] flex gap-2 items-center hover:cursor-pointer">
        <span>
          Export
        </span>
        <PiExportBold className="text-md"/>
      </button>



      {videoURL
        ? (<div className="relative group">
            <video ref={videoRef} src={videoURL} className="rounded-xl max-w-230"
            onTimeUpdate={updateCurrentSubtitle}
            />
            {currentSubtitle && (
              <div className="absolute bottom-8 left-0 w-full flex justify-center">
                <p className="bg-black/50 px-4 py-2 rounded text-white text-xl font-semibold">
                  {currentSubtitle}
                </p>
              </div>
            )}
            <button className="absolute top-2 right-2 text-4xl cursor-pointer opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200"
            onClick={() => removeVideo()}
            >
              <FaWindowClose className="text-red-400 hover:text-red-500"/>
            </button>
          </div>)
        : (<div 
            onDragOver={(e) => {e.preventDefault(); setIsDragging(true);}}
            onDragLeave={() => setIsDragging(false)}
            onDrop={
              (e) => {
                e.preventDefault(); 
                setIsDragging(false); 
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
              }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex justify-center items-center h-50 w-50 bg-[#13111C] rounded-xl border-2 transition-colors duration-200
              ${isDragging ? "border-purple-500 bg-[#1e1530]" : "border-transparent"}`}
            >
              <FaPlus className="text-5xl text-gray-600"/>
          </div>)
      }

      {videoURL 
        ? <div></div>
        : (
          <button className="flex py-2 w-100 items-center justify-center gap-1 rounded-md mt-5 hover:cursor-pointer bg-[#241f38]"
            onClick={() => fileInputRef.current?.click()}
          >
            <MdUpload className="text-xl"/>
            <span className="font-medium text-lg">
              Upload
            </span>
          </button>
        )
      }
      
    </main>
  )
}