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
    ring1: '#ff0000', 
    ring2: '#ff0000'
  })

  const [hue, setHue] = useState(0);

  const handleColorChange = (newColor: string) => {
    setRingColors({...ringColors, [selectedRing]: newColor})
  }

  const hsvToHex = (h: number, s: number, v: number): string => {
    s /= 100;
    v /= 100;
    const f = (n: number) => {
      const k = (n + h / 60) % 6;
      const value = v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
      return Math.round(255 * value).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const shadeBoxRef = useRef<HTMLDivElement>(null);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);

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
    const newBrightness = Math.round(100 - y)
    setSaturation(newSaturation)
    setBrightness(newBrightness)
    const hexColor = hsvToHex(hue, newSaturation, newBrightness)
    handleColorChange(hexColor)
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
                        linear-gradient(to right, #fff, ${hsvToHex(hue, 100, 100)})` 
          }}
        >
          {/* Crosshair indicator */}
          <div 
            className="absolute w-3 h-3 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              left: `${saturation}%`, 
              top: `${100 - brightness}%` 
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
            handleColorChange(hsvToHex(newHue, saturation, brightness))
          }}
          className="w-full cursor-pointer"
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            background: `linear-gradient(
                  to right, 
                  ${hsvToHex(0, 100, 100)},
                  ${hsvToHex(60, 100, 100)},
                  ${hsvToHex(120, 100, 100)},
                  ${hsvToHex(180, 100, 100)},
                  ${hsvToHex(240, 100, 100)},
                  ${hsvToHex(300, 100, 100)},
                  ${hsvToHex(360, 100, 100)}
            )`,
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