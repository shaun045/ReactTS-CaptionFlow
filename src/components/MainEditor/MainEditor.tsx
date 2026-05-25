import { FaPlus } from "react-icons/fa6";
import { MdUpload } from "react-icons/md";
import { PiExportBold } from "react-icons/pi";


export default function MainEditor() {
  return (
    <main className="relative flex justify-center items-center flex-col h-full flex-1">
      <button className="absolute top-4 right-4 p-1.5 px-5 text-sm rounded-sm bg-[#1d0d27] flex gap-2 items-center hover:cursor-pointer">
        <span>
          Export
        </span>
        <PiExportBold className="text-md"/>
      </button>

      <div className="flex justify-center items-center h-100 w-100 bg-[#13111C] rounded-xl">
        <FaPlus className="text-5xl text-gray-600"/>
      </div>

      <button className="flex py-2 w-100 items-center justify-center gap-1 rounded-md mt-5 hover:cursor-pointer bg-[#241f38]">
        <MdUpload className="text-xl"/>
        <span className="font-medium text-lg">
          Upload
        </span>
      </button>
    </main>
  )
}