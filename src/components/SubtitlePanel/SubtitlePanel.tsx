
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


export default function SubtitlePanel() {
  return(
    <div className="flex flex-col h-full w-100">
      <div className="bg-[#1b1431] flex p-3 justify-between">
        <h1 className="text-xl">Subtitle Panel</h1>
        <button className="flex p-1 px-3 rounded-md bg-[#9D2CFA]">
          Add
        </button>
      </div>
      <ul className="flex flex-col h-full bg-[#151027] p-3">
        <li className="flex border border-gray-600 p-2 w-full h-10 justify-between mb-1 rounded-sm">
          <span>
            0:01:00 - 0:02:00
          </span>
          <p>Subtitle</p>
          <div className="flex gap-2">
            <button>
              <FaEdit/>
            </button>
            <button>
              <MdDelete />
            </button>
          </div>
        </li>
        
      </ul>
    </div>
  )
}