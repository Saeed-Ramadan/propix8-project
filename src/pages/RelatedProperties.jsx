import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Maximize,
  Bed,
  Bath,
  Loader2,
  ChevronRight,
  Star,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/toastConfig.js";
import { motion } from "framer-motion";

export default function RelatedProperties() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, ensureAuth } = useAuth();
  const [relatedUnits, setRelatedUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    fetch(`https://propix8.com/api/units/${id}/related`, { headers })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          setRelatedUnits(result.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        // console.error("Error fetching related units:", err);
        setLoading(false);
      });
  }, [id]);

  const toggleFavorite = async (unitId, e) => {
    e.stopPropagation();
    if (!ensureAuth()) return;

    // Robust boolean check
    setRelatedUnits((prevUnits) =>
      prevUnits.map((unit) => {
        if (unit.id === unitId) {
          const currentStatus = !!(
            unit.is_favourite === true ||
            unit.is_favourite === 1 ||
            unit.is_favourite === "1" ||
            unit.is_favourite === "true"
          );
          return { ...unit, is_favourite: !currentStatus };
        }
        return unit;
      }),
    );

    try {
      const response = await fetch("https://propix8.com/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ unit_id: unitId }),
      });

      const result = await response.json();

      if (response.ok) {
        // Use result.status directly as returned by API (true = added, false = removed)
        const finalStatus = result.status;
        setRelatedUnits((prevUnits) =>
          prevUnits.map((unit) =>
            unit.id === unitId ? { ...unit, is_favourite: finalStatus } : unit,
          ),
        );
        toast.success(result.message, toastOptions);
      } else {
        // Rollback
        setRelatedUnits((prevUnits) =>
          prevUnits.map((unit) =>
            unit.id === unitId
              ? { ...unit, is_favourite: !newFavoriteStatus }
              : unit,
          ),
        );
        toast.error(result.message || "حدث خطأ، حاول مرة أخرى", toastOptions);
      }
    } catch (error) {
      // Rollback
      setRelatedUnits((prevUnits) =>
        prevUnits.map((unit) =>
          unit.id === unitId
            ? { ...unit, is_favourite: !newFavoriteStatus }
            : unit,
        ),
      );
      toast.error("خطأ في الاتصال بالسيرفر", toastOptions);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-cairo py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-100 transition-all text-[#3E5879]"
          >
            <ChevronRight size={24} className="rotate-0" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#3E5879]">
              كل العقارات المشابهة
            </h1>
            <p className="text-gray-500 mt-1 font-bold">
              بناءً على المنطقة ونوع العقار المختار
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-[#3E5879] mb-4" size={48} />
            <p className="text-gray-400 font-bold">
              جاري تحميل كافة الوحدات...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedUnits.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(`/property-details/${item.id}`)}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer group"
              >
                <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {/* التحقق من وجود الصورة */}
                  {item.main_image && item.main_image !== "" ? (
                    <img
                      src={item.main_image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={item.title}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Maximize size={40} className="opacity-20" />
                      <span className="text-sm font-bold">
                        لا توجد صورة لهذا العقار
                      </span>
                    </div>
                  )}

                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                    <MapPin size={14} className="text-[#3E5879]" />
                    <span className="text-[12px] font-bold text-gray-700">
                      {item.city?.name}
                    </span>
                  </div>

                  {token && (
                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className={`absolute top-5 right-5 w-8 h-8 backdrop-blur rounded-full flex items-center justify-center transition-colors z-10 ${
                        item.is_favourite === true ||
                        item.is_favourite === 1 ||
                        item.is_favourite === "1" ||
                        item.is_favourite === "true"
                          ? "bg-yellow-50 text-yellow-500 shadow-sm"
                          : "bg-white/80 text-gray-400 hover:text-yellow-500"
                      }`}
                    >
                      <Star
                        size={16}
                        fill={
                          item.is_favourite === true ||
                          item.is_favourite === 1 ||
                          item.is_favourite === "1" ||
                          item.is_favourite === "true"
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-black text-lg text-[#3E5879] mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="text-2xl font-black text-[#3E5879] mb-4">
                    {Number(item.price).toLocaleString()}{" "}
                    <span className="text-sm">ج.م</span>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Maximize size={16} />
                      <span className="text-sm font-bold">{item.area} م²</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Bed size={16} />
                      <span className="text-sm font-bold">
                        {item.rooms} غرف
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Bath size={16} />
                      <span className="text-sm font-bold">
                        {item.bathrooms} حمام
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && relatedUnits.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-xl">
              لا توجد وحدات مشابهة إضافية حالياً
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
