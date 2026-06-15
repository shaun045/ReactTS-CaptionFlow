import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa";
import ColorPickerModal from "./ColorPickerModal";

interface ColorsPanelProps {
  selectedColor: string | null;
  setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
}

const solidColors: string[] = [
  "#000000", "#4a4a4a", "#717171", "#a0a0a0", "#c8c8c8", "#ffffff",
  "#ff0000", "#ff4d4d", "#ff66b2", "#cc66ff", "#9966ff", "#6600ff",
  "#00ccff", "#00ffff", "#00ffcc", "#00ff66", "#0066ff", "#0000ff",
  "#00cc00", "#66ff00", "#ffff00", "#ffcc00", "#ff6600", "#ff3300",
]

const gradientColors: string[] = [
  "linear-gradient(to right, #000000, #ffffff)",
  "linear-gradient(to right, #434343, #000000)",
  "linear-gradient(to right, #56ab2f, #a8e063)",
  "linear-gradient(to right, #f7971e, #ffd200)",
  "linear-gradient(to right, #f953c6, #b91d73)",
  "linear-gradient(to right, #4facfe, #00f2fe)",
  "linear-gradient(to right, #43e97b, #38f9d7)",
  "linear-gradient(to right, #fa709a, #fee140)",
  "linear-gradient(to right, #a18cd1, #fbc2eb)",
  "linear-gradient(to right, #ff9a9e, #fad0c4)",
  "linear-gradient(to right, #667eea, #764ba2)",
  "linear-gradient(to right, #f093fb, #f5576c)",
  "linear-gradient(to right, #4481eb, #04befe)",
  "linear-gradient(to right, #0ba360, #3cba92)",
  "linear-gradient(to right, #ff0844, #ffb199)",
  "linear-gradient(to right, #feada6, #f5efef)",
  "linear-gradient(to right, #e0c3fc, #8ec5fc)",
  "linear-gradient(to right, #f6d365, #fda085)",
]

export default function ColorsPanel({ selectedColor, setSelectedColor }: ColorsPanelProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>(() => {
    const saved = localStorage.getItem('customColors')
      if (saved) {
        return JSON.parse(saved)
      }
      return []
    });

  const handleAddColor = (color: string) => {
    setCustomColors([...customColors, color])
    setShowColorPicker(false);
  }

  const deleteCustomColor = (colorToDelete: string) => {
    setCustomColors(customColors.filter((color) => color !== colorToDelete))
  }

  useEffect(() => {
    localStorage.setItem('customColors', JSON.stringify(customColors));
  }, [customColors]);


  return (
    <div className="flex flex-col p-3 gap-10">
      
      <div>
        <h1 className="text-white text-xl font-semibold mb-2">Custom colors</h1>
        <div className="flex flex-wrap gap-2">
          
          {customColors.map((color) => (
            <div key={color} className="relative group"
            >
    
            {/* Color circle */}
            <div
              style={{ background: color }}
              className="w-11 h-11 rounded-full cursor-pointer hover:scale-110 transition-all duration-200 border"
              onClick={() => setSelectedColor(color)}
            />

            {/* Delete button - shows on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteCustomColor(color)
              }}
              className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 
                        text-white text-xs items-center justify-center
                        hidden group-hover:flex hover:cursor-pointer"
            >
              ×
            </button>

          </div>
          ))}
          {showColorPicker && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowColorPicker(false)}
              />
              <ColorPickerModal 
                onAddColor={handleAddColor}
                onClose={() => setShowColorPicker(false)}
              />
            </>
          )}

          <div 
            className="w-11 h-11 rounded-full p-0.5 cursor-pointer"
            style={{ background: "linear-gradient(to right, #ff00ff, #00ffff)" }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <div className="w-full h-full rounded-full bg-[#131212] flex items-center justify-center">
              <FaPlus className="text-white" />
            </div>
          </div>

        </div>
      </div>

      <div>
        <h1 className="text-white text-xl font-semibold mb-2">Default solid colors</h1>
        <div className="grid grid-cols-6 gap-2">
          {solidColors.map((color) => (
            <div 
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{backgroundColor: color}}
              className={`w-11 h-11 rounded-full cursor-pointer transition-all duration-200
                ${selectedColor === color ? "scale-110 ring-2 ring-white" : "hover:scale-110"}`}
            />
          ))}
        </div>

      </div>
      <div>
        <h1 className="text-white text-xl font-semibold mb-2">Default gradient colors</h1>
        <div className="grid grid-cols-6 gap-2">
          {gradientColors.map((gradient) => (
            <div 
              key={gradient}
              onClick={() => setSelectedColor(gradient)}
              style={{background: gradient}}
              className={`w-11 h-11 rounded-full cursor-pointer transition-all duration-200
                ${selectedColor === gradient ? "scale-110 ring-2 ring-white" : "hover:scale-110"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}