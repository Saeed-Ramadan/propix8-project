import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Tag,
  ArrowLeft,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Building2,
  Info,
  Star,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/toastConfig.js";

function CompoundsUnits() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, ensureAuth } = useAuth();
  const [compoundData, setCompoundData] = useState(null);
  const [loading, setLoading] = useState(true);

  // حالات الـ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const unitsPerPage = 9;

  useEffect(() => {
    const fetchCompound = async () => {
      try {
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await axios.get(
          `https://propix8.com/api/compounds/${id}`,
          { headers },
        );
        if (response.data.status) {
          setCompoundData(response.data.data);
        } else if (response.data.status === false) {
          navigate("/notfound", { replace: true });
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
        navigate("/notfound", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchCompound();
  }, [id]);

  const toggleFavorite = async (unitId, e) => {
    e.stopPropagation();
    if (!ensureAuth()) return;

    const currentStatus = !!(
      compoundData?.units.find((u) => u.id === unitId)?.is_favourite === true ||
      compoundData?.units.find((u) => u.id === unitId)?.is_favourite === 1 ||
      compoundData?.units.find((u) => u.id === unitId)?.is_favourite === "1" ||
      compoundData?.units.find((u) => u.id === unitId)?.is_favourite === "true"
    );
    const newFavoriteStatus = !currentStatus;

    // Optimistic Update
    setCompoundData((prevComp) => {
      if (!prevComp) return prevComp;
      return {
        ...prevComp,
        units: prevComp.units.map((unit) => {
          if (unit.id === unitId) {
            return { ...unit, is_favourite: newFavoriteStatus };
          }
          return unit;
        }),
      };
    });

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
        setCompoundData((prevComp) => {
          if (!prevComp) return prevComp;
          return {
            ...prevComp,
            units: prevComp.units.map((unit) =>
              unit.id === unitId
                ? { ...unit, is_favourite: finalStatus }
                : unit,
            ),
          };
        });
        toast.success(result.message, toastOptions);
      } else {
        // Rollback
        setCompoundData((prevComp) => {
          if (!prevComp) return prevComp;
          return {
            ...prevComp,
            units: prevComp.units.map((unit) =>
              unit.id === unitId
                ? { ...unit, is_favourite: !newFavoriteStatus }
                : unit,
            ),
          };
        });
        toast.error(result.message || "حدث خطأ، حاول مرة أخرى", toastOptions);
      }
    } catch (error) {
      // Rollback
      setCompoundData((prevComp) => {
        if (!prevComp) return prevComp;
        return {
          ...prevComp,
          units: prevComp.units.map((unit) =>
            unit.id === unitId
              ? { ...unit, is_favourite: !newFavoriteStatus }
              : unit,
          ),
        };
      });
      toast.error("خطأ في الاتصال بالسيرفر", toastOptions);
    }
  };

  if (loading)
    return (
      <div
        className="flex flex-col justify-center items-center h-screen bg-gray-50"
        dir="rtl"
      >
        <Loader2 className="w-12 h-12 text-[#3E5879] animate-spin mb-4" />
        <p className="text-gray-500 font-bold font-cairo">
          جاري تحميل بيانات الكومباوند...
        </p>
      </div>
    );

  if (!compoundData) return null;

  // حسابات الـ Pagination
  const indexOfLastUnit = currentPage * unitsPerPage;
  const indexOfFirstUnit = indexOfLastUnit - unitsPerPage;
  const currentUnits = compoundData.units.slice(
    indexOfFirstUnit,
    indexOfLastUnit,
  );
  const totalPages = Math.ceil(compoundData.units.length / unitsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const element = document.getElementById("units-section");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-12 font-cairo" dir="rtl">
      {/* Compound Profile Hero Section with Real Estate Background */}
      <div className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop')`, // صورة عقارية فخمة
          }}
        >
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3E5879]/90 via-[#3E5879]/70 to-[#F8F9FA]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-xl mb-6 border border-white/20 shadow-2xl">
              <Building2 size={50} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
              {compoundData.name}
            </h1>
            <div className="max-w-2xl bg-white/10 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 mb-2 justify-center text-blue-200">
                <Info size={18} />
                <span className="font-bold text-sm uppercase tracking-widest">
                  نبذة عن المشروع
                </span>
              </div>
              <p className="text-white text-lg md:text-xl leading-relaxed font-medium">
                {compoundData.description ||
                  "تجربة سكنية متكاملة تجمع بين الفخامة والخصوصية في قلب أرقى المناطق الحيوية."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        id="units-section"
        className="container mx-auto px-4 -mt-16 relative z-20"
      >
        {/* Stats bar */}
        <div className="bg-white rounded-[1rem] shadow-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#3E5879] flex items-center gap-3">
              <Tag className="text-[#3E5879]" size={32} />
              الوحدات المتاحة
            </h2>
            <p className="text-gray-400 font-bold mt-1 mr-11">
              استكشف خيارات السكن المتنوعة في {compoundData.name}
            </p>
          </div>
          <div className="bg-[#3E5879] text-white px-8 py-3 rounded-[1rem] text-lg font-black shadow-lg shadow-[#3E5879]/30">
            {compoundData.units.length} وحدة معروضة
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentUnits.map((unit, index) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/property-details/${unit.id}`)}
              className="group bg-white rounded-[0.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col cursor-pointer hover:-translate-y-2"
            >
              {/* Image Section */}
              <div className="relative h-72 bg-gray-200 overflow-hidden">
                <img
                  src={
                    unit.main_image ||
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt={unit.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-5 py-2 rounded-2xl text-xs font-black shadow-xl text-[#3E5879]">
                  لـ {unit.offer_type === "rent" ? "الإيجار" : "البيع"}
                </div>

                {token && (
                  <button
                    onClick={(e) => toggleFavorite(unit.id, e)}
                    className={`absolute top-6 left-6 w-10 h-10 backdrop-blur rounded-full flex items-center justify-center transition-colors z-10 ${
                      unit.is_favourite === true ||
                      unit.is_favourite === 1 ||
                      unit.is_favourite === "1" ||
                      unit.is_favourite === "true"
                        ? "bg-yellow-50 text-yellow-500 shadow-sm"
                        : "bg-white/80 text-gray-400 hover:text-yellow-500"
                    }`}
                  >
                    <Star
                      size={20}
                      fill={
                        unit.is_favourite === true ||
                        unit.is_favourite === 1 ||
                        unit.is_favourite === "1" ||
                        unit.is_favourite === "true"
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                )}
                <div className="absolute bottom-6 right-6">
                  <div className="bg-[#3E5879] text-white px-5 py-2.5 rounded-2xl shadow-2xl font-black text-xl border border-white/20">
                    {parseFloat(unit.price).toLocaleString()}{" "}
                    <span className="text-xs font-normal opacity-80 mr-1">
                      ج.م
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-black text-[#3E5879] mb-3 truncate group-hover:text-blue-700 transition-colors">
                  {unit.title}
                </h3>

                <div className="flex items-start gap-2 text-gray-400 text-sm mb-6 h-12 font-bold leading-relaxed">
                  <MapPin size={20} className="text-[#3E5879] shrink-0 mt-1" />
                  <span className="line-clamp-2">{unit.address}</span>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-3 gap-3 py-6 border-y border-gray-50 mb-6">
                  <div className="flex flex-col items-center p-3 rounded-[1.5rem] bg-gray-50 group-hover:bg-blue-50 transition-colors">
                    <BedDouble size={24} className="text-[#3E5879] mb-1" />
                    <span className="text-xs font-black text-gray-700">
                      {unit.rooms} غرف
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-[1.5rem] bg-gray-50 group-hover:bg-blue-50 transition-colors">
                    <Bath size={24} className="text-[#3E5879] mb-1" />
                    <span className="text-xs font-black text-gray-700">
                      {unit.bathrooms} حمام
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-[1.5rem] bg-gray-50 group-hover:bg-blue-50 transition-colors">
                    <Maximize size={24} className="text-[#3E5879] mb-1" />
                    <span className="text-xs font-black text-gray-700">
                      {parseInt(unit.area)} م²
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-xs font-black text-[#3E5879] bg-[#3E5879]/5 px-4 py-2 rounded-xl border border-[#3E5879]/10">
                    {unit.unit_type.name}
                  </span>
                  <div className="flex items-center gap-2 text-[#3E5879] font-black text-sm group-hover:translate-x-[-8px] transition-transform">
                    تفاصيل الوحدة
                    <ArrowLeft size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-20 gap-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-14 h-14 rounded-[1.5rem] border-2 bg-white text-[#3E5879] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3E5879] hover:text-white transition-all shadow-lg flex items-center justify-center"
            >
              <ChevronRight size={28} />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`w-14 h-14 rounded-[1.5rem] font-black transition-all shadow-lg text-lg ${
                  currentPage === index + 1
                    ? "bg-[#3E5879] text-white scale-110"
                    : "bg-white text-gray-600 border-2 hover:border-[#3E5879]"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-14 h-14 rounded-[1.5rem] border-2 bg-white text-[#3E5879] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3E5879] hover:text-white transition-all shadow-lg flex items-center justify-center"
            >
              <ChevronLeft size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompoundsUnits;
