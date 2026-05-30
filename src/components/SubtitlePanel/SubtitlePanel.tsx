
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


export default function SubtitlePanel() {
  const [subtitles, setSubtitles] = useState<string []>([]);
   
  function addSubtitle() {
    const newSubtitle = {
      id: Date.now(),
      subtitle: "subtitle"
    }
    setSubtitles([
      ...subtitles,
      newSubtitle
    ])
  }

  return(
    <div className="flex flex-col h-full w-100">
      <div className="bg-[#1b1431] flex p-3 justify-between">
        <h1 className="text-xl">Subtitle Panel</h1>
        <button className="flex p-1 px-3 rounded-md bg-[#9D2CFA] hover:cursor-pointer"
        onClick={() => addSubtitle()}
        >
          Add
        </button>
      </div>
      <ul className="flex flex-col h-full bg-[#151027] p-2">
        <li className="flex border border-gray-600 p-2 w-full h-10 justify-between mb-1 rounded-sm items-center align-center">
          <span className="flex text-xs text-align w-48">
            0:01:00 - 0:02:00
          </span>
          <p className="flex w-full px-2">
            Subtitle
          </p>
          <div className="flex gap-2">
            <button className="hover:cursor-pointer">
              <FaEdit/>
            </button>
            <button className="hover:cursor-pointer">
              <MdDelete />
            </button>
          </div>
        </li>
        
      </ul>
    </div>
  )
}