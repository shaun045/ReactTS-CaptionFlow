
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { transcribeVideo } from "../../utils/transcribe";

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
}

export default function SubtitlePanel({subtitles, setSubtitles, videoRef, videoURL}: SubtitlePanelProps) {

  function addSubtitle() {
    const newSubtitle = {
      id: Date.now(),
      text: "",
      startTime: 0,
      endTime: 0
    }
    setSubtitles([
      ...subtitles,
      newSubtitle
    ])
  }

  function deleteSubtitle(id: number) {
    setSubtitles(subtitles.filter(sub => id !== sub.id))
  }

  const [editingId, setEditingId] = useState<number | null>(null);

  function updateSubtitle(id: number, text: string) {
    setSubtitles(subtitles.map(sub => sub.id === id ? {...sub, text} : sub));
  }

  const [isTranscribing, setIsTranscribing] = useState(false);

  async function handleTranscribe() {
    if (!videoURL) return;
    setIsTranscribing(true);
    const results = await transcribeVideo(videoURL);
    setSubtitles(results);
    setIsTranscribing(false);
;  }

   

  return(
    <div className="flex flex-col h-full w-100">
      <div className="bg-[#1b1431] flex p-3s justify-between items-center">
        <h1 className="text-xl p-2">Subtitle Panel</h1>
        <button
          onClick={handleTranscribe}
          disabled={!videoURL || isTranscribing}
          className="flex p-1 px-3 rounded-md items-center bg-[#7c5cbf] hover:cursor-pointer disabled:opacity-50"
        >
          {isTranscribing ? "Transcribing..." : "Auto"}
        </button>
        <button className="flex p-1 px-3 rounded-md items-center bg-[#9D2CFA] mr-3 hover:cursor-pointer"
        onClick={() => addSubtitle()}
        >
          Add
        </button>
      </div>
      
      <ul className="flex flex-col h-full bg-[#151027] p-2">
        {subtitles.map((subtitle) => (
          <li key={subtitle.id} className="flex border border-gray-600 p-2 w-full h-10 justify-between mb-1 rounded-sm items-center">
            <span className="flex text-xs w-48">
              0:00:00 - 0:00:00
            </span>

            {editingId === subtitle.id
              ? <input 
                  type="text" 
                  autoFocus
                  className="flex w-full px-2 bg-transparent border-b border-purple-500 outline-none text-sm"
                  value={subtitle.text}
                  onChange={(e) => updateSubtitle(subtitle.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                />
              : <p className="flex w-full px-2 text-sm truncate">
                  {subtitle.text || "Empty subtitle"}
                </p>
            }


            <div className="flex gap-2">
              {editingId === subtitle.id
                ? <button><FaCheck /></button>
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