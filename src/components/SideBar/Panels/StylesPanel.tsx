

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
    <div className="flex justify-center">
      <div className="flex">
        <h1 className="p-3 text-2xl font-semibold">STYLES</h1>
      </div>
      <div>
        {styles.map((style) => (
          <div
            key={style}
            onClick={() => setSelectedStyle(prev => prev === style ? null : style)}
          >
            <span>{style}</span>
          </div>
        )) }
      </div>
    </div>
  )
}