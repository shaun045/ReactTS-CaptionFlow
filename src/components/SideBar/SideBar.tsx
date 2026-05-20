import { useState } from "react";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { MdFontDownload } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { BsFonts } from "react-icons/bs";
import FontPanel from "./Panels/FontPanel";
import ColorsPanel from "./Panels/ColorsPanel";
import StylesPanel from "./Panels/StylesPanel";



export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  return (
    <aside className={`flex flex-col h-screen transition-all duration-500 ${isCollapsed ? "w-13" : "w-100"} justify-between`}>

    <div className="flex flex-col flex-1">
      <div className="flex justify-end px-2 py-1 bg-[#1d0d27]">
        <FaAngleDoubleLeft className={`cursor-pointer transition-all duration-500 ${isCollapsed ? "rotate-180" : ""}`}
          onClick={() => {
            setIsCollapsed(!isCollapsed)
            if (!isCollapsed) setActivePanel(null)
          }}
        />
      </div>

      <div className="flex h-full">
        <ul className="flex flex-col items-start p-2 gap-2 bg-[#1d0d27]">
          <li>
            <BsFonts className="text-4xl cursor-pointer rounded-sm p-1 hover:bg-[#201c31] transition-colors duration-200"
            onClick={() => setActivePanel(activePanel === 'fonts' ? null : 'fonts')}
            />
          </li>
          <li>
            <IoIosColorPalette className="text-4xl cursor-pointer rounded-sm p-1 hover:bg-[#201c31] transition-colors duration-200"
            onClick={() => setActivePanel(activePanel === 'colors' ? null : 'colors')}
            />
          </li>
          <li>
            <MdFontDownload className="text-4xl cursor-pointer rounded-sm p-1 hover:bg-[#201c31] transition-colors duration-200"
            onClick={() => setActivePanel(activePanel === 'styles' ? null : 'styles')}
            />
          </li>
        </ul>
        <div className="w-100 bg-[#291336]">
          {activePanel === 'fonts' && <FontPanel />}
          {activePanel === 'colors' && <ColorsPanel/>}
          {activePanel === 'styles' && <StylesPanel/>}
        </div>
      </div>
    </div>

    <button className="flex items-start p-2 bg-[#1d0d27]">
      <IoSettings className="text-2xl"/>
    </button>

    </aside>
  )
}