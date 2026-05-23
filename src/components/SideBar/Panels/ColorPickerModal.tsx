import { useState, useRef } from "react"


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
    ring1: `hsl(0, 100%, 50%)`, 
    ring2: `hsl(0, 100%, 50%)`
  })

  const [hue, setHue] = useState(0);

  const handleColorChange = (newColor: string) => {
    setRingColors({...ringColors, [selectedRing]: newColor})
  }

  const shadeBoxRef = useRef<HTMLDivElement>(null);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    calculateColor(e)
  }

  // Extract calculation to reusable function
  const calculateColor = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shadeBoxRef.current) return
    const rect = shadeBoxRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    const newSaturation = Math.round(x)
    const newLightness = Math.round(100 - y)
    setSaturation(newSaturation)
    setLightness(newLightness)
    handleColorChange(`hsl(${hue}, ${newSaturation}%, ${newLightness}%)`)
  }


  const handleShadeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    calculateColor(e)
  }


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
          onClick={() => onAddColor(`linear-gradient(to right, ${ringColors.ring1}, ${ringColors.ring2})`)}
        >
          Save
        </button>
      </div>
      <div>
        <div 
          ref={shadeBoxRef}
          onClick={handleShadeClick}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          className="w-full h-36 rounded-md cursor-crosshair relative"
          style={{ 
            background: `linear-gradient(to bottom, transparent, #000), 
                        linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))` 
          }}
        >
          {/* Crosshair indicator */}
          <div 
            className="absolute w-3 h-3 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              left: `${saturation}%`, 
              top: `${100 - lightness}%` 
            }}
          />
        </div>
      </div>

      <div>
        <input 
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => {
            const newHue = Number(e.target.value)
            setHue(newHue)
            handleColorChange(`hsl(${newHue}, ${saturation}%, ${lightness}%)`)
          }}
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
          style={{ backgroundColor: ringColors[selectedRing] }}
        />
        <input 
          type="text"
          value={ringColors[selectedRing]} readOnly
          className="flex-1 bg-[#2a2a3e] text-white p-2 rounded-md text-sm border border-gray-600 outline-none w-1"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  )
}