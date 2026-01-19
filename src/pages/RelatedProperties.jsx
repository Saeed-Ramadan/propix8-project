import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Maximize, Bed, Bath, Loader2, ChevronRight } from 'lucide-react';

export default function RelatedProperties() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [relatedUnits, setRelatedUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`https://propix8.com/api/units/${id}/related`)
      .then(res => res.json())
      .then(result => {
        if (result.status) {
          setRelatedUnits(result.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching related units:", err);
        setLoading(false);
      });
  }, [id]);

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
            <h1 className="text-3xl font-black text-[#3E5879]">كل العقارات المشابهة</h1>
            <p className="text-gray-500 mt-1 font-bold">بناءً على المنطقة ونوع العقار المختار</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-[#3E5879] mb-4" size={48} />
            <p className="text-gray-400 font-bold">جاري تحميل كافة الوحدات...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedUnits.map((item) => (
              <div
                key={item.id}
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
                      <span className="text-sm font-bold">لا توجد صورة لهذا العقار</span>
                    </div>
                  )}

                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                    <MapPin size={14} className="text-[#3E5879]" />
                    <span className="text-[12px] font-bold text-gray-700">{item.city?.name}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-black text-lg text-[#3E5879] mb-2 line-clamp-1">{item.title}</h3>
                  <div className="text-2xl font-black text-[#3E5879] mb-4">
                    {Number(item.price).toLocaleString()} <span className="text-sm">ج.م</span>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Maximize size={16} />
                      <span className="text-sm font-bold">{item.area} م²</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Bed size={16} />
                      <span className="text-sm font-bold">{item.rooms} غرف</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Bath size={16} />
                      <span className="text-sm font-bold">{item.bathrooms} حمام</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && relatedUnits.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-xl">لا توجد وحدات مشابهة إضافية حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}