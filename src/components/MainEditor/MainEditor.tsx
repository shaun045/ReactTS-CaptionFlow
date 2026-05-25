import { FaPlus } from "react-icons/fa6";
import { MdUpload } from "react-icons/md";
import { PiExportBold } from "react-icons/pi";
import { useState, useRef } from "react";


export default function MainEditor() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    setVideoURL(URL.createObjectURL(file));
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



      <div 
        onDragOver={(e) => {e.preventDefault(); setIsDragging(true);}}
        onDragLeave={() => setIsDragging(false)}
        onDrop={
          (e) => {
            e.preventDefault(); 
            setIsDragging(false); 
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        className={`flex justify-center items-center h-100 w-100 bg-[#13111C] rounded-xl border-2 transition-colors duration-200
          ${isDragging ? "border-purple-500 bg-[#1e1530]" : "border-transparent"}`}
        >
        {videoURL
          ? <video src={videoURL} controls className="h-full w-full rounded-xl object-contain"/>
          : <FaPlus className="text-5xl text-gray-600"/>
        }
        
      </div>

      <button className="flex py-2 w-100 items-center justify-center gap-1 rounded-md mt-5 hover:cursor-pointer bg-[#241f38]"
        onClick={() => fileInputRef.current?.click()}
      >
        <MdUpload className="text-xl"/>
        <span className="font-medium text-lg">
          Upload
        </span>
      </button>
    </main>
  )
}