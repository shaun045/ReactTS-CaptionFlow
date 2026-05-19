import { useState } from "react";
import { FaAngleDoubleLeft } from "react-icons/fa";

export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`flex flex-col h-screen border transition-all duration-500 ${isCollapsed ? "w-16" : "w-100"}`}>

      <div className="flex justify-end px-2 py-1">
        <FaAngleDoubleLeft className={`cursor-pointer transition-all duration-500 ${isCollapsed ? "rotate-180" : ""}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      <ul className="border">
        <li>Fonts</li>
        <li>Colors</li>
        <li>Styles</li>
      </ul>

      <button>Settings</button>
    </aside>
  )
}