import { useRef, useState, useEffect } from "react";
import MainEditor from "../components/MainEditor/MainEditor";
import SideBar from "../components/SideBar/SideBar";
import SubtitlePanel from "../components/SubtitlePanel/SubtitlePanel";
import Timeline from "../components/Timeline/Timeline";
import logo from "../assets/logo/Logo-bgremoved.png";
import type { EditorState, Subtitle, VideoSegment, SubtitlePos } from "../utils/types";

export default function EditorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([
    {
      id: 1,
      text: "Hello CaptionFlow!",
      startTime: 0,
      endTime: 5
    }
  ]);
  const [videoSegments, setVideoSegments] = useState<VideoSegment[]>([]);
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [selectedSeg, setSelectedSeg] = useState<number | null>(null);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(24);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [subtitlePos, setSubtitlePos] = useState<SubtitlePos>({ x: 50, y: 80 });
  const [history, setHistory] = useState<EditorState[]>([]);
  const [future, setFuture] = useState<EditorState[]>([]);
  const [duration, setDuration] = useState(0);


  function pushHistory() {
    setHistory(prev => [...prev, {subtitles, videoSegments, subtitlePos}]);
    setFuture([]);
  }

  function deleteSubtitle(id: number) {
    pushHistory();
    setSubtitles(prev => prev.filter(sub => sub.id !== id));
  }

  function deleteVideoSegment(id: number) {
    pushHistory();
    
    const seg = videoSegments.find(seg => seg.id === id);
    if (!seg) return;

    const segDuration = seg.endTime - seg.startTime;

    setSubtitles(prev => prev
      .filter(sub => !(sub.startTime >= seg.startTime && sub.endTime <= seg.endTime))
      .map(sub => {
        if (sub.startTime >= seg.endTime) {
          return {
            ...sub,
            startTime: sub.startTime - segDuration,
            endTime: sub.endTime - segDuration,
          };
        }
        return sub;
      })
    )

    setVideoSegments(prev => prev.filter(seg => seg.id !== id));
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedSub !== null) {
          deleteSubtitle(selectedSub);
          setSelectedSub(null);
        }
        if (selectedSeg !== null) {
          deleteVideoSegment(selectedSeg);
          setSelectedSeg(null);
        }
      
      }

      if (e.ctrlKey && e.key === "z") {
        const prev = history[history.length - 1];
        if (!prev) return;
        setFuture(f => [...f, {subtitles, videoSegments, subtitlePos}]);
        setHistory(h => h.slice(0, -1));
        setSubtitles(prev.subtitles);
        setVideoSegments(prev.videoSegments);
        setSubtitlePos(prev.subtitlePos);
      }

      if (
        (e.ctrlKey && e.key === "y") || 
        (e.ctrlKey && e.shiftKey && e.key === "z")
      ) {
        const next = future[future.length - 1];
        if (!next) return;
        setHistory(h => [...h, {subtitles, videoSegments, subtitlePos}]);
        setFuture(f => f.slice(0, -1));
        setSubtitles(next.subtitles);
        setVideoSegments(next.videoSegments);
        setSubtitlePos(next.subtitlePos);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSub, selectedSeg, history, future, subtitles, videoSegments, subtitlePos]);

  useEffect(() => {
    if (!selectedFont) return;

    const existingLink = document.querySelector(`link[href*="${selectedFont.replace(/ /g, "+")}"]`);
    if (existingLink) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g, "+")}`;
    document.head.appendChild(link);
  }, [selectedFont]);



  return (
    <div className='flex flex-col text-white items-center w-full h-screen'>
      <div className="flex w-full py-2 bg-[#1d0d27]">
        <img src={logo} alt="logo" className="w-10"/>
        <h1 className="flex text-xl font-bold items-center">
          CAPTION FLOW
        </h1>
      </div>

      <div className='flex flex-1 overflow-hidden w-full h-screen'>

        <SideBar 
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          fontSize={fontSize}
          setFontSize={setFontSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
        />

        <MainEditor 
          videoRef={videoRef} 
          videoURL={videoURL} 
          setVideoURL={setVideoURL}
          subtitles={subtitles}
          videoFile={videoFile}
          setVideoFile={setVideoFile}
          selectedFont={selectedFont}
          fontSize={fontSize}
          selectedColor={selectedColor}
          videoSegments={videoSegments}

          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          subtitlePos={subtitlePos}
          setSubtitlePos={setSubtitlePos}

          pushHistory={pushHistory}
        />

        <SubtitlePanel 
          videoRef={videoRef}
          videoURL={videoURL}
          subtitles={subtitles}
          setSubtitles={setSubtitles}
          videoFile={videoFile}
          deleteSubtitle={deleteSubtitle}
        />
      </div>

      <div className="flex flex-col w-full h-70 overflow-hidden">
        <Timeline 
          videoRef={videoRef}
          videoURL={videoURL}
          subtitles={subtitles}
          setSubtitles={setSubtitles}
          videoSegments={videoSegments}
          setVideoSegments={setVideoSegments}
          deleteSubtitle={deleteSubtitle}
          deleteVideoSegment={deleteVideoSegment}
          selectedSub={selectedSub}
          setSelectedSub={setSelectedSub}
          selectedSeg={selectedSeg}
          setSelectedSeg={setSelectedSeg}
          duration={duration}
          setDuration={setDuration}
        />
      </div>

    </div>
  )
}