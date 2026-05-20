import MainEditor from "../components/MainEditor/MainEditor";
import SideBar from "../components/SideBar/SideBar";
import SubtitlePanel from "../components/SubtitlePanel/SubtitlePanel";
import Timeline from "../components/Timeline/Timeline";
import logo from "../assets/logo/Logo-bgremoved.png";

export default function EditorPage() {
  return (
    <div className='flex flex-col text-white items-center'>
      <div className="flex w-full py-2 bg-[#1d0d27]">
        <img src={logo} alt="logo" className="w-10"/>
        <h1 className="flex text-xl font-bold items-center">
          CAPTION FLOW
        </h1>
      </div>

      <div className='grid grid-cols-3 gap-50 h-full w-full'>
        <SideBar />
        <MainEditor />
        <SubtitlePanel />
      </div>

      <Timeline />

    </div>
)
}