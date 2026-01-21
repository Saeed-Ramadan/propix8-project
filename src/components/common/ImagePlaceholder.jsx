import { Building2, ImageOff } from "lucide-react";

export default function ImagePlaceholder({
  className = "w-full h-full",
  iconSize = 40,
  text = "لا توجد صورة",
}) {
  return (
    <div
      className={`bg-gray-100 flex flex-col items-center justify-center text-gray-400 ${className}`}
    >
      <Building2 size={iconSize} className="opacity-20 mb-2" />
      <span className="text-xs font-bold opacity-60">{text}</span>
    </div>
  );
}
