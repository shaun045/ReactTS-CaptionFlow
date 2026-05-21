
interface ColorPickerModalProps {
  onAddColor: (color: string) => void
  onClose: () => void
}

export default function ColorPickerModal({
  onAddColor, 
  onClose
}: ColorPickerModalProps) {


  return (
    <div className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-4 w-64 flex flex-col absolute z-50 m-7">
      <div className="flex">
        <p>div circle</p>
        <p>div circle</p>
      </div>
      <div>
        <div 
        className="w-full h-36 rounded-md cursor-crosshair"
        style={{ 
          background: `linear-gradient(to bottom, transparent, #000), 
                       linear-gradient(to right, #fff, #ff0000)` 
        }}
      />
      </div>

      <div>
        <input 
          type="range"
          min="0"
          max="360"
          className="w-full cursor-pointer"
          style={{
            background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)"
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full flex shrink-0 border border-gray-600"
          style={{ backgroundColor: "#ff0000" }}
        />
        <input 
          type="text"
          value="#ff0000"
          className="flex-1 bg-[#2a2a3e] text-white p-2 rounded-md text-sm border border-gray-600 outline-none"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  )
}