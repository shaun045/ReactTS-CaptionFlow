

interface StylesPanelProps {
  selectedStyle: string | null;
  setSelectedStyle: React.Dispatch<React.SetStateAction<string | null>>;
}

const styles: string[] = [
  "shadow",
  "glow",
  "background",
  "outline"
];

export default function StylesPanel({ selectedStyle, setSelectedStyle }:StylesPanelProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-center">
        <h1 className="p-3 text-2xl font-semibold">STYLES</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {styles.map((style) => (
          <div
            key={style}
            onClick={() => setSelectedStyle(prev => prev === style ? null : style)}
            className={`border p-2 flex justify-center hover:cursor-pointer transition-transform duration-300 hover:scale-103 rounded-lg
              ${selectedStyle === style ? "border-purple-500 bg-[#1e0f30]" : "border-[#2e1f40] hover:border-purple-800"}`}
          >
            <span>{style}</span>
          </div>
        )) }
      </div>
    </div>
  )
}