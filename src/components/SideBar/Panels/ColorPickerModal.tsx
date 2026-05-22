import { useState } from "react"

interface ColorPickerModalProps {
  onAddColor: (color: string) => void
  onClose: () => void
}

export default function ColorPickerModal({
  onAddColor, 
}: ColorPickerModalProps) {

  const rings = ['ring1', 'ring2']
  const [selectedRing, setSelectedRing] = useState<string>('ring1');
  const [ringColors, setRingColors] = useState<Record<string, string>>({
    ring1: '#ffffff', 
    ring2: '#ffffff'   
  })

  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [hue, setHue] = useState(0);

  return (
    <div className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-4 w-64 flex flex-col absolute z-50 m-7">
      <div className="flex mb-3 justify-between">
        <div className="flex gap-1">
          {rings.map((ring) => (
            <div
              key={ring}
              onClick={() => setSelectedRing(ring)}
              className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all duration-200
                ${selectedRing === ring ? "border-white border-2 scale-110" : "border-gray-600"}`}
              style={{ backgroundColor: ringColors[ring] }}
            />
          ))}
          
        </div>
        <button className="border px-2 rounded-md hover:cursor-pointer"
          onClick={() => onAddColor(selectedColor)}
        >
          Save
        </button>
      </div>
      <div>
        <div 
          className="w-full h-36 rounded-md cursor-crosshair"
          style={{ 
            background: `linear-gradient(to bottom, transparent, #000), 
                        linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))` 
          }}
        />
      </div>

      <div>
        <input 
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            height: "12px",
            borderRadius: "6px",
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
          className="flex-1 bg-[#2a2a3e] text-white p-2 rounded-md text-sm border border-gray-600 outline-none w-1"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  )
}