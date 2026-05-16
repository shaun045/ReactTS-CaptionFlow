import { useState } from 'react'
import './App.css'
import SideBar from './components/SideBar/SideBar'
import MainEditor from './components/MainEditor/MainEditor'
import SubtitlePanel from './components/SubtitlePanel/SubtitlePanel'
import Timeline from './components/Timeline/Timeline'
import LoginPage from './pages/LoginPage'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)}/>
  }

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

export default App
