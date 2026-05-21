
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
        <p>shade</p>
      </div>
      <div>
        <p>color scale</p>
      </div>
      <div>
        <p>hex</p>
      </div>
    </div>
  )
}