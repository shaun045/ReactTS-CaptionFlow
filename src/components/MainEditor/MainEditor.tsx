import { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdUpload } from "react-icons/md";
import { PiExportBold } from "react-icons/pi";
import { FaWindowClose } from "react-icons/fa";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import type { Subtitle } from "../../utils/types";
import { exportVideo } from "../../export/exportVideo";

interface VideoSegment {
  id: number;
  startTime: number;
  endTime: number;
}

interface MainEditorProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string | null;
  setVideoURL: (url: string | null) => void;
  subtitles: Subtitle[];
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  selectedFont: string | null;
  fontSize: number;
  selectedColor: string | null;
  selectedStyle: string | null;
  setSelectedStyle: React.Dispatch<React.SetStateAction<string | null>>;
  subtitlePos:  {
                      x: number;
                      y: number;
                  }
  setSubtitlePos: React.Dispatch<React.SetStateAction<{
                    x: number;
                    y: number;
                }>>;
  pushHistory: () => void;
  videoSegments: VideoSegment[];
  }


export default function MainEditor({
    videoRef, 
    videoURL, 
    setVideoURL, 
    subtitles, 
    setVideoFile,
    selectedFont,
    fontSize,
    selectedColor,
    selectedStyle,
    subtitlePos,
    setSubtitlePos,
    pushHistory,
    videoSegments,
    videoFile
  }: MainEditorProps) {
  
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

  const isGradient = selectedColor?.includes("linear-gradient") || selectedColor?.includes("radial-gradient");
  const subtitleStyle: React.CSSProperties = {
    fontFamily: selectedFont ?? undefined,
    fontSize: `${fontSize}px`,
    width: "90%",
    textAlign: "center",
    ...getStyleCSS(selectedStyle),
  };

  if (isGradient) {
    subtitleStyle.backgroundImage = selectedColor ?? undefined;
    subtitleStyle.WebkitBackgroundClip = "text";
    subtitleStyle.WebkitTextFillColor = "transparent";
  } else {
    subtitleStyle.color = selectedColor ?? "white";
    subtitleStyle.backgroundImage = "none";
    subtitleStyle.WebkitBackgroundClip = "border-box";
    subtitleStyle.WebkitTextFillColor = "unset";
  }

  function getStyleCSS(style: string | null): React.CSSProperties {
    switch(style) {
      case "shadow": return {textShadow: "3px 3px 4px rgba(0,0,0,0.8)"};
      case "glow": return {textShadow: "0 0 10px #cc66ff, 0 0 20px #cc66ff"};
      case "background": return {backgroundColor: "rgba(0,0,0,0.6)", padding: "4px 12px", borderRadius: "6px"};
      case "outline": return {WebkitTextStroke: "1px white"};
      default: return {};
    }
  }

  const [videoZoom, setVideoZoom] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({x: 0, y: 0});
  const [panOffset, setPanOffset] = useState({x: 0, y: 0});

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1) return;
    e.preventDefault();
    setIsPanning(true);
    lastMousePos.current = {x: e.clientX, y: e.clientY};
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current ={x: e.clientX, y: e.clientY};
    setPanOffset(prev => ({x: prev.x + dx, y: prev.y + dy}));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button !== 1) return;
    setIsPanning(false);
  }


  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  async function handleExport() {
    if (!videoFile) return;
    setIsExporting(true);
    await exportVideo(
      videoFile,
      subtitles,
      subtitlePos,
      fontSize,
      selectedFont,
      selectedColor,
      videoSegments,
      (progress) => setExportProgress(progress)
    );
    setIsExporting(false);
  }


  return (
    <main className="relative flex justify-center items-center flex-col h-full flex-1"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {setIsPanning(false)}}
      style={{cursor: isPanning ? "grabbing" : "default"}}
    >

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

      <button className="absolute top-4 right-4 p-1.5 px-5 text-sm rounded-sm bg-[#1d0d27] flex gap-2 items-center hover:cursor-pointer"
      onClick={handleExport}
      disabled={isExporting}
      >
        <span>
          {isExporting ? `Exporting ${exportProgress}%` : "Export"}
        </span>
        <PiExportBold className="text-md"/>
      </button>



      {videoURL
        ? (
          <>
          <div className=" absolute flex flex-col gap-2 px-2 left-1 top-1"
            >
              <MdZoomIn className="text-6xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"
                onClick={() => setVideoZoom(prev => Math.min(prev + 10, 200))}
              />
              <MdZoomOut className="text-6xl text-[#a89bc0] cursor-pointer hover:text-white transition-colors"
                onClick={() => setVideoZoom(prev => Math.min(prev - 10, 50))}
              />
            </div>
          <div className="relative group flex">
            
            <div className="relative group overflow-hidden"
              style={{transform: `scale(${videoZoom / 100})`, transformOrigin: "top center", translate: `${panOffset.x}px ${panOffset.y}px`}}
            >
                <video ref={videoRef} src={videoURL} className="relative rounded-xl max-w-230"
                onTimeUpdate={updateCurrentSubtitle}
                />
                {currentSubtitle && (
                    <p 
                      className="absolute cursor-move px-4 py-2 rounded font-semibold overflow-auto"
                      style={{
                        left: `${subtitlePos.x}%`,
                        top: `${subtitlePos.y}%`,
                        transform: "translate(-50%, -50%)",
                        ...subtitleStyle
                      }}
                      draggable
                      onDragEnd={(e) => {
                        pushHistory();
                        const videoEl = videoRef.current;
                        if (!videoEl) return;
                        const rect = videoEl.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        setSubtitlePos({ 
                          x: Math.min(Math.max(x, 0), 100), 
                          y: Math.min(Math.max(y, 0), 100)  
                        });
                      }}
                      >
                      {currentSubtitle}
                    </p>    
                )}
                <button className="absolute top-2 right-2 text-4xl cursor-pointer opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200"
                onClick={() => removeVideo()}
                >
                  <FaWindowClose className="text-red-400 hover:text-red-500"/>
                </button>
              </div>
            </div>
          </>
          )
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