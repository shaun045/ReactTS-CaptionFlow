import MainEditor from "../components/MainEditor/MainEditor";
import SideBar from "../components/SideBar/SideBar";
import SubtitlePanel from "../components/SubtitlePanel/SubtitlePanel";
import Timeline from "../components/Timeline/Timeline";

export default function EditorPage() {
  return (
    <div className='flex flex-col'>
      <h1>CAPTION FLOW</h1>

      <div className='grid grid-cols-3'>
        <SideBar />
        <MainEditor />
        <SubtitlePanel />
      </div>

      <Timeline />

    </div>
)
}