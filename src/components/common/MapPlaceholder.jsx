import React from "react";
import { MapPinOff, ExternalLink } from "lucide-react";

export default function MapPlaceholder({ className = "w-full h-64" }) {
  return (
    <div
      className={`bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl p-6 ${className}`}
    >
      <MapPinOff size={48} className="mb-4 text-gray-300" />
      <p className="font-bold text-lg text-gray-500 mb-2">الخريطة غير متاحة</p>
      <p className="text-sm text-gray-400 text-center max-w-sm">
        تعذر تحميل الخريطة في الوقت الحالي، أو أن الموقع غير محدد بدقة.
      </p>
    </div>
  );
}
