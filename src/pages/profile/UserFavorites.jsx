import React, { useState, useEffect, useRef } from "react";
import { Star, MapPin, BedDouble, Bath, Square, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // استيراد الهوك الخاص بالتنقل
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // تعريف دالة التنقل
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const deletedIds = useRef(new Set());

  const fetchFavorites = async (page = 1) => {
    setLoading(true);
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `https://propix8.com/api/favorites?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const result = await response.json();

      if (result.status) {
        const filteredData = result.data.filter(
          (fav) => !deletedIds.current.has(fav.unit.id)
        );
        setFavorites(filteredData);
        setPagination(result.pagination);
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (e, unitId) => {
    e.stopPropagation(); // منع انتقال الحدث للكارت (عشان ميفتحش الصفحة وأنا بمسح)
    const token = localStorage.getItem("userToken");

    deletedIds.current.add(unitId);
    setFavorites((prev) => prev.filter((fav) => fav.unit.id !== unitId));

    try {
      const response = await fetch(`https://propix8.com/api/favorites/toggle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unit_id: unitId }),
      });

      const result = await response.json();
      if (result.status) {
        toast.success("تمت إزالة العقار من قائمة مفضلاتك");
      } else {
        deletedIds.current.delete(unitId);
        fetchFavorites(pagination.current_page);
        toast.error(result.message || "فشل في تعديل المفضلة");
      }
    } catch (error) {
      deletedIds.current.delete(unitId);
      toast.error("خطأ في الشبكة");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-EG").format(price) + " ج.م";
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 font-cairo" dir="rtl">
      <ToastContainer position="top-right" autoClose={2000} rtl={true} />

      <h2 className="text-xl font-black text-[#3E5879] mb-8 text-right border-r-4 border-[#3E5879] pr-3">
        العقارات المفضلة
      </h2>

      {loading && favorites.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#3E5879]" size={40} />
        </div>
      ) : (
        <>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {favorites.map((fav) => {
                const item = fav.unit;
                return (
                  <div
                    key={fav.id}
                    onClick={() => navigate(`/property-details/${item.id}`)} // توجيه المستخدم عند الضغط
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {/* تعديل منطق عرض الصورة */}
                      {item.main_image && item.main_image !== "" ? (
                        <img src={item.main_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Square size={30} className="opacity-20" />
                          <span className="text-[10px] font-bold">لا توجد صورة لهذا العقار</span>
                        </div>
                      )}

                      <button
                        onClick={(e) => handleToggleFavorite(e, item.id)} // تمرير الـ Event لمنع الـ Bubbling
                        className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-yellow-500 hover:bg-yellow-50 z-10"
                      >
                        <Star size={20} fill="currentColor" />
                      </button>
                      <div className="absolute top-4 right-4 bg-[#3E5879] text-white text-[10px] px-3 py-1 rounded-full font-bold">
                        {item.offer_type === "sale" ? "للبيع" : "للإيجار"}
                      </div>
                    </div>

                    <div className="p-5 space-y-3 text-right">
                      <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                        <MapPin size={12} />
                        <span>{item.city?.name} - {item.address}</span>
                      </div>
                      <h3 className="font-black text-[#3E5879] text-sm leading-tight h-10 line-clamp-2">{item.title}</h3>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-[#3E5879] font-black text-base">{formatPrice(item.price)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-gray-500">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                          <Square size={14} className="text-gray-400" />
                          <span>{parseFloat(item.area)} م²</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                          <BedDouble size={14} className="text-gray-400" />
                          <span>{item.rooms} غرف</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                          <Bath size={14} className="text-gray-400" />
                          <span>{item.bathrooms} حمام</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            !loading && (
              <div className="py-20 text-center text-gray-400 font-bold">
                لا توجد عقارات في قائمة المفضلة لديك حالياً
              </div>
            )
          )}

          {/* Pagination كود الترقيم يظل كما هو */}
        </>
      )}
    </div>
  );
}

export default UserFavorites;