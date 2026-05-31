
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


export default function SubtitlePanel() {
  const [subtitles, setSubtitles] = useState<{id: number, text: string, startTime: number, endTime: number}[]>([]);
   
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

  return(
    <div className="flex flex-col h-full w-100">
      <div className="bg-[#1b1431] flex p-3s justify-between items-center">
        <h1 className="text-xl p-2">Subtitle Panel</h1>
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
            <p className="flex w-full px-2">
              {subtitle.text}
            </p>
            <div className="flex gap-2">
              <button className="hover:cursor-pointer"><FaEdit/></button>
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