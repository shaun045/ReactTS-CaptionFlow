
export default function SubtitlePanel() {
  return(
    <div className="flex flex-col h-full w-100">
      <div className="bg-[#1b1431] flex p-3 justify-between">
        <h1 className="text-xl">Subtitle Panel</h1>
        <button>Add</button>
      </div>
      <ul className="flex flex-col h-full bg-[#151027] p-3">
        <li className="flex border p-2 w-full h-10 justify-between mb-1">
          <span>
            minute
          </span>
          <p>Subtitle</p>
          <div>
            <button>edit</button>
            <button>delete</button>
          </div>
        </li>
        
      </ul>
    </div>
  )
}