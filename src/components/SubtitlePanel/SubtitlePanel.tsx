
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { transcribeAudio } from "../../utils/transcribe";
import { extractAudio } from "../../utils/extractAudio";

interface Subtitle {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

interface SubtitlePanelProps {
  subtitles: Subtitle[];
  setSubtitles: (subtitles: Subtitle[]) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoURL: string | null;
  videoFile: File | null;
  deleteSubtitle: (id: number) => void;
}

export default function SubtitlePanel({subtitles, setSubtitles, videoURL, videoRef, videoFile, deleteSubtitle}: SubtitlePanelProps) {

  function addSubtitle() {
    const currentTime = videoRef.current?.currentTime ?? 0;

    const newSubtitle = {
      id: Date.now(),
      text: "",
      startTime: currentTime,
      endTime: currentTime + 3
    }
    setSubtitles([
      ...subtitles,
      newSubtitle
    ])
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const [editingId, setEditingId] = useState<number | null>(null);

  function updateSubtitle(id: number, text: string) {
    setSubtitles(subtitles.map(sub => sub.id === id ? {...sub, text} : sub));
  }

  function updateTimeStamp(id: number, startTime: number, endTime: number) {
    setSubtitles(subtitles.map(sub => sub.id === id ? {...sub, startTime, endTime} : sub));
  }

  const [isTranscribing, setIsTranscribing] = useState(false);

  async function handleTranscribe() {
    if (!videoURL || !videoFile) return;
    try {
      setIsTranscribing(true);

      const audioBlob = await extractAudio(videoFile);

      const results = await transcribeAudio(audioBlob);

      console.log(results);

      setSubtitles(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTranscribing(false);
    }
  }

  const [selectedSub, setSelectedSub] = useState<number | null>(null);

  function seekToSubtitle(startTime: number) {
    if (!videoRef.current) return;

    videoRef.current.currentTime = startTime;
  }

   

  return(
    <div className="flex flex-col h-full w-100">
      <div className="bg-[#1b1431] flex p-3s justify-between items-center">
        <h1 className="text-xl p-2">Subtitle Panel</h1>
        <button
          onClick={handleTranscribe}
          disabled={!videoURL || isTranscribing}
          className="flex p-1 px-3 rounded-md items-center bg-[#7c5cbf] hover:cursor-pointer disabled:opacity-50"
        >
          {isTranscribing ? "Transcribing..." : "Transcribe"}
        </button>
        <button className="flex p-1 px-3 rounded-md items-center bg-[#9D2CFA] mr-3 hover:cursor-pointer"
        onClick={() => addSubtitle()}
        >
          Add
        </button>
      </div>
      
      <ul className="flex flex-col h-full bg-[#151027] p-2 overflow-auto">
        {subtitles.map((subtitle) => (
          <li key={subtitle.id} 
          className={`flex border p-2 w-full h-10 justify-between mb-1 rounded-sm items-center 
            ${selectedSub === subtitle.id ? "border-purple-500" : "border-gray-600" }
          `}
          onClick={() => (
            seekToSubtitle(subtitle.startTime),
            setSelectedSub(subtitle.id)
          )}
          >
            {editingId === subtitle.id ? (
              <span className="flex text-xs w-48">
                <input 
                  className="flex w-15 px-2 bg-transparent outline-none text-sm border"
                  type="number"
                  value={subtitle.startTime}
                  onChange={(e) => updateTimeStamp(
                    subtitle.id, 
                    Number(e.target.value), 
                    subtitle.endTime
                  )}
                />
                <input 
                  className="flex w-15 px-2 bg-transparent outline-none text-sm border"
                  type="number"
                  value={subtitle.endTime} 
                  onChange={(e) => updateTimeStamp(
                    subtitle.id, 
                    subtitle.startTime,
                    Number(e.target.value)
                  )}
                />
              </span>
            ) : (
              <span className="flex text-xs w-48">
                {formatTime(subtitle.startTime)}
                {" - "}
                {formatTime(subtitle.endTime)}
              </span>
            )}
            

            {editingId === subtitle.id
              ? (<input 
                  type="text" 
                  autoFocus
                  className="flex w-full px-2 bg-transparent border-b border-purple-500 outline-none text-sm"
                  value={subtitle.text}
                  onChange={(e) => updateSubtitle(subtitle.id, e.target.value)}
                  // onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                />)
              : (
                <p className="flex w-full px-2 text-sm truncate">
                  {subtitle.text || "Empty subtitle"}
                </p>
              )}


            <div className="flex gap-2">
              {editingId === subtitle.id
                ? <button
                  onClick={() => setEditingId(null)}
                  >
                    <FaCheck />
                  </button>
                : <button className="hover:cursor-pointer"
                    onClick={() => setEditingId(subtitle.id)}
                  >
                    <FaEdit/>
                  </button>
              }
              
              <button className="hover:cursor-pointer"
                onClick={() => deleteSubtitle(subtitle.id)}
              >
                <MdDelete/>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}