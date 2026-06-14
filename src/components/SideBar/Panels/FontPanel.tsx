
const fonts: string[] = [
  "Inter",
  "Roboto",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Oswald",
  "Raleway",
  "Nunito",
  "Lato",
  "Open Sans",
  "Merriweather",
  "Ubuntu",
  "Josefin Sans",
  "Pacifico",
  "Dancing Script"
]

interface FontPanelProps {
  selectedFont: string | null;
  setSelectedFont: React.Dispatch<React.SetStateAction<string | null>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export default function FontPanel({ selectedFont, setSelectedFont, setFontSize }: FontPanelProps) {

  return (
    <div className="flex flex-col h-full p-3">
      <div className="flex justify-between">
        <h2 className="text-white font-semibold mb-3 ml-5 text-4xl py-2">Fonts</h2>
        <div className="flex w-25 text-center items-center flex-col">
          <h3>font size</h3>
          <div>
            <button className="px-2 cursor-pointer text-2xl hover:text-red-400"
              onClick={() => setFontSize(prev => Math.max(prev - 2, 8))}
              >
                -
            </button>
            <button className="px-2 cursor-pointer text-2xl hover:text-green-400"
              onClick={() => setFontSize(prev => Math.min(prev + 2, 72))}
              >
                +
            </button>
          </div>
        </div>
      </div>
      <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden min-h-0 flex-1">
        {fonts.map((font: string) => {
          return (
            <li 
              key={font}
              style={{fontFamily:font}}
              onClick={() => setSelectedFont(font)}
              className={`flex justify-center border border-[#e6d1f8] py-2 rounded-md hover:cursor-pointer hover:bg-[#15071f] hover:brightness-130 transition-all duration-300
              ${selectedFont === font
                ? "border-[#bb83ec] bg-[#9D2CFA]"
                : "border-[#e6d1f8] hover:bg-[#1d0d27]"
              }`}
              >
              {font}
            </li>
          )
        })}
      </ul>
    </div>
  )
}