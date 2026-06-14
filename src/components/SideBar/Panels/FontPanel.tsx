
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
}

export default function FontPanel({ selectedFont, setSelectedFont }: FontPanelProps) {

  return (
    <div className="flex flex-col h-full p-3">
      <h2 className="text-white font-semibold mb-3 text-center text-4xl py-2">Fonts</h2>
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