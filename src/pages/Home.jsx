import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Loader2,
  Building2,
  Home as HomeIcon,
  Users,
  Globe,
  X,
  BedDouble,
  Bath,
  Square,
  ShieldCheck,
  Award,
  Lightbulb,
  Star,
  MessageSquare,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  MapPinned,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const devScrollRef = useRef(null);

  // --- States ---
  const [units, setUnits] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [compounds, setCompounds] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [stats, setStats] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);
  const [heroImage, setHeroImage] = useState("");

  const [testimonials, setTestimonials] = useState([]);
  const [testimonialPagination, setTestionalPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);

  // --- New Review States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewStatus, setReviewStatus] = useState({
    text: "",
    isError: false,
  });

  const [filters, setFilters] = useState({
    offer_type: "all",
    min_price: "",
    max_price: "",
    min_internal_area: "",
    max_internal_area: "",
    unit_type_id: "",
    city_id: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- Functions ---
  const scroll = (ref, direction) => {
    const { current } = ref;
    if (current) {
      const scrollAmount = 350;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { current } = scrollRef;
      if (current) {
        const isEnd =
          Math.abs(current.scrollLeft) >=
          current.scrollWidth - current.clientWidth - 10;
        if (isEnd) current.scrollTo({ left: 0, behavior: "smooth" });
        else scroll(scrollRef, "left");
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [compounds]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { current } = devScrollRef;
      if (current) {
        const isEnd =
          Math.abs(current.scrollLeft) >=
          current.scrollWidth - current.clientWidth - 10;
        if (isEnd) current.scrollTo({ left: 0, behavior: "smooth" });
        else scroll(devScrollRef, "left");
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [developers]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [
        unitTypesRes,
        citiesRes,
        unitsRes,
        statsRes,
        pagesRes,
        faqsRes,
        settingsRes,
        compoundsRes,
        developersRes,
      ] = await Promise.all([
        fetch("https://propix8.com/api/unit-types"),
        fetch("https://propix8.com/api/cities"),
        fetch("https://propix8.com/api/units"),
        fetch("https://propix8.com/api/stats"),
        fetch("https://propix8.com/api/pages"),
        fetch("https://propix8.com/api/faqs"),
        fetch("https://propix8.com/api/settings"),
        fetch("https://propix8.com/api/compounds"),
        fetch("https://propix8.com/api/developers"),
      ]);

      const unitTypesData = await unitTypesRes.json();
      const citiesData = await citiesRes.json();
      const unitsData = await unitsRes.json();
      const statsData = await statsRes.json();
      const pagesData = await pagesRes.json();
      const faqsData = await faqsRes.json();
      const settingsData = await settingsRes.json();
      const compoundsData = await compoundsRes.json();
      const developersData = await developersRes.json();

      setUnitTypes(unitTypesData.data || []);
      setCities(citiesData.data || []);
      setUnits(unitsData.data || []);
      setStats(statsData.data || []);
      setFaqs(faqsData.data || []);
      setCompounds(compoundsData.data || []);
      setDevelopers(developersData.data || []);

      if (settingsData.data?.home_hero_image) {
        setHeroImage(settingsData.data.home_hero_image);
      }

      const about = pagesData.data?.find((page) => page.slug === "about-us");
      setAboutData(about);
      fetchTestimonials(1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async (page) => {
    setTestimonialsLoading(true);
    try {
      const res = await fetch(
        `https://propix8.com/api/testimonials?page=${page}`,
      );
      const result = await res.json();
      if (result.status) {
        setTestimonials(result.data || []);
        setTestionalPagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  // --- Adjusted Submit Review with Token ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");

    if (!token) {
      setReviewStatus({
        text: "يجب تسجيل الدخول أولاً لإضافة تقييم",
        isError: true,
      });
      return;
    }

    setReviewLoading(true);
    setReviewStatus({ text: "", isError: false });

    try {
      const response = await fetch("https://propix8.com/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: reviewContent }),
      });

      const result = await response.json();

      if (response.ok && result.status) {
        setReviewStatus({
          text: "تم إرسال تقييمك بنجاح، شكراً لك!",
          isError: false,
        });
        setReviewContent("");
        setTimeout(() => setIsModalOpen(false), 2000);
        fetchTestimonials(1);
      } else {
        setReviewStatus({
          text: result.message || "حدث خطأ أثناء إرسال التقييم",
          isError: true,
        });
      }
    } catch (error) {
      setReviewStatus({ text: "تعذر الاتصال بالسيرفر", isError: true });
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.offer_type !== "all")
        params.append("offer_type", filters.offer_type);
      if (filters.min_price) params.append("min_price", filters.min_price);
      if (filters.max_price) params.append("max_price", filters.max_price);
      if (filters.min_internal_area)
        params.append("min_internal_area", filters.min_internal_area);
      if (filters.max_internal_area)
        params.append("max_internal_area", filters.max_internal_area);
      if (filters.unit_type_id)
        params.append("unit_type_id", filters.unit_type_id);
      if (filters.city_id) params.append("city_id", filters.city_id);

      const response = await fetch(
        `https://propix8.com/api/units?${params.toString()}`,
      );
      const result = await response.json();
      setSearchResults(result.data || []);
      if (result.data?.length === 0) {
        toast.info("لا توجد نتائج تطابق بحثك", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const renderStatIcon = (iconName) => {
    const iconProps = { size: 30, className: "text-[#3E5879] opacity-80" };
    switch (iconName) {
      case "projects-icon":
        return <Building2 {...iconProps} />;
      case "rented-icon":
        return <HomeIcon {...iconProps} />;
      case "clients-icon":
        return <Users {...iconProps} />;
      case "experience-icon":
        return <Globe {...iconProps} />;
      default:
        return <Building2 {...iconProps} />;
    }
  };

  const filteredUnits =
    activeTab === "all"
      ? units.slice(0, 6)
      : units.filter((u) => u.unit_type?.id === activeTab).slice(0, 6);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="animate-spin text-[#3E5879]" size={48} />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8f9fa] font-cairo" dir="rtl">
      <ToastContainer rtl={true} />

      {/* HERO SECTION */}
      <section className="relative min-h-[800px] flex items-center justify-center py-20 z-50">
        <img
          src={
            heroImage ||
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"
          }
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070";
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full max-w-6xl px-6">
          <div className="text-center text-white mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg italic">
              "استثمار آمن وخطط سداد مرنة تناسب احتياجاتك"
            </h1>
          </div>
          <div className="bg-white/80 p-8 rounded-[2.5rem] shadow-2xl border border-white/30 text-[#3E5879]">
            <div className="flex justify-center gap-4 mb-10">
              <div className="bg-[#3E5879] text-white px-12 py-3 rounded-xl font-black shadow-lg">
                وحدات
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-start gap-6 mb-8">
              <span className="font-black text-lg">حالة العقار</span>
              <div className="flex bg-gray-200/50 p-1.5 rounded-xl border border-gray-300">
                {["all", "sale", "rent"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilters({ ...filters, offer_type: type })}
                    className={`px-5 py-2.5 rounded-xl font-black transition-all ${filters.offer_type === type ? "bg-[#3E5879] text-white shadow-md" : "text-gray-500 hover:text-[#3E5879]"}`}
                  >
                    {type === "all"
                      ? "الكل"
                      : type === "sale"
                        ? "بيع"
                        : "إيجار"}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-right">
              <div className="space-y-2">
                <label className="font-black pr-2">نوع العقار</label>
                <div className="relative mt-1.5">
                  <select
                    className="w-full p-3.5 rounded-xl border border-gray-500 text-right appearance-none focus:ring-2 ring-[#3E5879]/20 outline-none cursor-pointer"
                    onChange={(e) =>
                      setFilters({ ...filters, unit_type_id: e.target.value })
                    }
                  >
                    <option value="">جميع الأنواع</option>
                    {unitTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute left-3 top-4 opacity-40"
                    size={18}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-black pr-2">المساحة (م2)</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <input
                    type="number"
                    placeholder="الأعلى"
                    className="w-full p-3.5 rounded-xl border border-gray-500 text-center text-sm focus:ring-2 ring-[#3E5879]/20 outline-none placeholder-gray-500"
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        max_internal_area: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="الأدنى"
                    className="w-full p-3.5 rounded-xl border border-gray-500 text-center text-sm focus:ring-2 ring-[#3E5879]/20 outline-none placeholder-gray-500"
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        min_internal_area: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-black pr-2">الموقع</label>
                <div className="relative mt-1.5">
                  <select
                    className="w-full p-3.5 rounded-xl border border-gray-500 text-right appearance-none focus:ring-2 ring-[#3E5879]/20 outline-none cursor-pointer"
                    onChange={(e) =>
                      setFilters({ ...filters, city_id: e.target.value })
                    }
                  >
                    <option value="">المدينة أو المنطقة</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute left-3 top-4 opacity-40"
                    size={18}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-black pr-2">نطاق السعر</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <input
                    type="number"
                    placeholder="الأعلى"
                    className="w-full p-3.5 rounded-xl border border-gray-500 text-center text-sm focus:ring-2 ring-[#3E5879]/20 outline-none placeholder-gray-500"
                    onChange={(e) =>
                      setFilters({ ...filters, max_price: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="الأدنى"
                    className="w-full p-3.5 rounded-xl border border-gray-500 text-center text-sm focus:ring-2 ring-[#3E5879]/20 outline-none placeholder-gray-500"
                    onChange={(e) =>
                      setFilters({ ...filters, min_price: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="w-full md:w-fit float-right bg-[#3E5879] text-white px-12 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-lg hover:shadow-xl transition-all disabled:opacity-70"
              >
                {searchLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search size={22} />
                )}{" "}
                البحث عن العقارات
              </button>
              <div className="clear-both"></div>
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[999] animate-in fade-in slide-in-from-top-2">
                  <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
                    <span className="font-bold text-[#3E5879]">
                      نتائج البحث ({searchResults.length})
                    </span>
                    <button
                      onClick={() => setSearchResults([])}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 font-bold transition-colors"
                    >
                      {" "}
                      إغلاق <X size={18} />{" "}
                    </button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/property-details/${item.id}`)}
                        className="p-4 border-b last:border-0 hover:bg-gray-50 flex items-center gap-4 cursor-pointer transition-colors"
                      >
                        <img
                          src={item.main_image}
                          className="w-16 h-16 rounded-xl object-cover shadow-sm"
                          alt=""
                        />
                        <div className="text-right flex-1">
                          <h4 className="font-bold text-[#3E5879]">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500 font-bold">
                            {parseFloat(item.price).toLocaleString()} ج.م
                          </p>
                        </div>
                        <ChevronDown
                          className="rotate-[270deg] text-gray-300"
                          size={16}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* COMPOUNDS SECTION */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div className="text-right border-r-4 border-[#3E5879] pr-5">
              <h2 className="text-[#3E5879] text-3xl md:text-4xl font-black mb-2">
                أبرز المجمعات السكنية
              </h2>
              <p className="text-gray-500 font-bold">
                تصفح الوحدات حسب الكمبوند
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scroll(scrollRef, "right")}
                className="p-4 rounded-2xl bg-[#f0f2f5] text-[#3E5879] hover:bg-[#3E5879] hover:text-white transition-all shadow-sm"
              >
                <ChevronRight size={24} />
              </button>
              <button
                onClick={() => scroll(scrollRef, "left")}
                className="p-4 rounded-2xl bg-[#f0f2f5] text-[#3E5879] hover:bg-[#3E5879] hover:text-white transition-all shadow-sm"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {compounds.map((compound) => (
              <div
                key={compound.id}
                onClick={() => navigate(`/compoundUnits/${compound.id}`)}
                className="min-w-[280px] md:min-w-[320px] bg-[#3E5879] p-8 rounded-[1rem] border border-[#3E5879] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group snap-center text-center"
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-[#EEF2F6] transition-colors duration-300">
                  <Building2 size={35} className="text-[#3E5879]" />
                </div>
                <h3 className="text-xl font-black text-white mb-6">
                  {compound.name}
                </h3>
                <div className="inline-flex items-center gap-2 text-[#3E5879] font-black text-sm bg-white px-6 py-2.5 rounded-xl shadow-md group-hover:bg-[#EEF2F6] transition-all duration-300">
                  عرض الوحدات <ChevronLeft size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVELOPERS SECTION */}
      <section className="py-20 bg-[#f0f2f5] overflow-hidden">
        <div className="max-w-6xl mx-auto px-3">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 border-r-4 border-[#3E5879] pr-6">
            <div className="text-right">
              <h2 className="text-[#3E5879] text-3xl md:text-4xl font-black mb-2">
                شركاء النجاح
              </h2>
              <p className="text-gray-500 font-bold">
                أكبر المطورين العقاريين في مصر
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scroll(devScrollRef, "right")}
                className="p-3 rounded-xl bg-white text-[#3E5879] hover:bg-[#3E5879] hover:text-white transition-all shadow-md"
              >
                <ChevronRight size={24} />
              </button>
              <button
                onClick={() => scroll(devScrollRef, "left")}
                className="p-3 rounded-xl bg-white text-[#3E5879] hover:bg-[#3E5879] hover:text-white transition-all shadow-md"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
          </div>

          <div
            ref={devScrollRef}
            className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {developers.map((dev) => (
              <div
                key={dev.id}
                onClick={() => navigate(`/developerUnits/${dev.id}`)}
                className="min-w-[340px] md:min-w-[400px] bg-white rounded-[1rem] overflow-hidden shadow-lg border border-white hover:shadow-2xl transition-all group snap-center relative cursor-pointer"
              >
                <div className="h-24 bg-[#3E5879] relative">
                  <div className="absolute -bottom-10 right-8 w-24 h-24 bg-white rounded-xl p-2 shadow-xl border-4 border-white group-hover:scale-110 transition-transform duration-500">
                    <img
                      src={dev.logo}
                      className="w-full h-full object-contain"
                      alt={dev.name}
                    />
                  </div>
                </div>
                <div className="pt-14 p-8 text-right">
                  <h3 className="text-2xl font-black text-[#3E5879] mb-4">
                    {dev.name}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-end gap-3 text-gray-500 group-hover:text-[#3E5879] transition-colors">
                      <span className="font-bold text-sm truncate max-w-[250px]">
                        {dev.email}
                      </span>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Mail size={16} />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-gray-500 group-hover:text-[#3E5879] transition-colors">
                      <span className="font-bold text-sm">{dev.phone}</span>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Phone size={16} />
                      </div>
                    </div>
                    <div className="flex items-start justify-end gap-3 text-gray-400">
                      <span className="font-bold text-xs text-left leading-relaxed">
                        {dev.address}
                      </span>
                      <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                        <MapPinned size={16} />
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-3 rounded-xl bg-gray-100 text-[#3E5879] font-black group-hover:bg-[#3E5879] group-hover:text-white transition-all shadow-inner">
                    عرض جميع المشاريع
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 px-6 bg-[#f8f9fa] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#3E5879] text-3xl md:text-5xl font-black mb-6">
              احصل علي أسلوب حياة راق يليق بك
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              استثمار آمن وخطط سداد مرنة تناسب احتياجاتك
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500 border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-[450px] object-cover"
                alt="Luxury"
              />
            </div>
            <div className="rounded-[3rem] overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500 border-[6px] border-[#3E5879]/10">
              <img
                src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-[450px] object-cover"
                alt="Modern"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-gray-100 pt-16">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="mb-4 p-4 rounded-full bg-gray-50 group-hover:bg-[#3E5879]/10 transition-colors">
                  {" "}
                  {renderStatIcon(stat.icon)}{" "}
                </div>
                <div className="text-center">
                  <h3 className="text-3xl md:text-4xl font-black text-[#3E5879] mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-500 font-bold text-sm md:text-base uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UNITS LIST SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[#3E5879] text-4xl font-black mb-4">
              "استكشف ما نقدمه"
            </h2>
            <p className="text-gray-500 text-lg">
              نقدم حلولاً عقارية متكاملة تناسب جميع احتياجاتك، من السكني إلى
              التجاري والاستثماري
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-8 py-2.5 rounded-md font-bold transition-all border ${activeTab === "all" ? "bg-[#3E5879] text-white border-[#3E5879]" : "bg-white text-gray-600 border-gray-200 hover:border-[#3E5879]"}`}
            >
              {" "}
              جميع الأنواع{" "}
            </button>
            {unitTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`px-8 py-2.5 rounded-md font-bold transition-all border ${activeTab === type.id ? "bg-[#3E5879] text-white border-[#3E5879]" : "bg-white text-gray-600 border-gray-200 hover:border-[#3E5879]"}`}
              >
                {" "}
                {type.name}{" "}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  onClick={() => navigate(`/property-details/${unit.id}`)}
                  className="bg-white rounded-[0.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <div className="h-64 relative overflow-hidden bg-gray-50 flex items-center justify-center">
                    {/* تعديل منطق الصورة هنا */}
                    {unit.main_image && unit.main_image !== "" ? (
                      <img
                        src={unit.main_image}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={unit.title}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Square size={40} className="opacity-20" />
                        <span className="text-sm font-bold">لا توجد صورة لهذا العقار</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-right">
                    <div className="flex items-center justify-start gap-2 text-gray-400 text-sm mb-2">
                    <MapPin size={16} className="text-[#3E5879]" />
                      <span className="font-bold text-[#3E5879] text-base">
                        {unit.city?.name} - {unit.address?.split("،")[0]}
                      </span>

                    </div>
                    <h3 className="text-xl font-black text-[#000] mb-3">
                      {unit.unit_type?.name} فاخرة بتشطيب سوبر لوكس
                    </h3>
                    <div className="text-[#3E5879] text-xl font-black mb-4 flex justify-end">
                      {parseFloat(unit.price).toLocaleString()} ج.م
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-gray-500 font-bold text-sm">
                      <div className="flex items-center gap-1">
                        {" "}
                        <span>{unit.bathrooms} حمامات</span>{" "}
                        <Bath size={16} />{" "}
                      </div>
                      <div className="flex items-center gap-1">
                        {" "}
                        <span>{unit.rooms} غرف</span>{" "}
                        <BedDouble size={16} />{" "}
                      </div>
                      <div className="flex items-center gap-1">
                        {" "}
                        <span>{parseInt(unit.area)} م²</span>{" "}
                        <Square size={16} />{" "}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-sm border border-dashed border-gray-300">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  {" "}
                  <HomeIcon size={48} className="text-gray-300" />{" "}
                </div>
                <h3 className="text-xl font-bold text-[#3E5879] mb-2">
                  لا توجد وحدات متوفرة
                </h3>
                <p className="text-gray-500 font-medium">
                  عذراً، لا توجد وحدات متوفرة في هذا القسم حالياً.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block bg-[#3E5879] text-white px-8 py-2 rounded-xl font-bold mb-6">
            {aboutData?.title || "من نحن"}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#3E5879] mb-6">
            علامة بارزة في عالم العقارات الفاخرة
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-5xl mx-auto font-medium mb-16">
            {aboutData?.content ||
              "نحن شركة تطوير عقاري رائدة نضع بصمتنا في عالم الفخامة والتميز."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl group hover:shadow-xl transition-all duration-300">
              <div className="bg-[#3E5879] w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                {" "}
                <ShieldCheck className="text-white" size={30} />{" "}
              </div>
              <h4 className="text-2xl font-black text-[#3E5879] mb-4">الثقة</h4>
              <p className="text-gray-500 font-bold leading-relaxed">
                أساس كل نجاح.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl group hover:shadow-xl transition-all duration-300">
              <div className="bg-[#3E5879] w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                {" "}
                <Award className="text-white" size={30} />{" "}
              </div>
              <h4 className="text-2xl font-black text-[#3E5879] mb-4">
                الجودة
              </h4>
              <p className="text-gray-500 font-bold leading-relaxed">
                معايير تفوق التوقعات.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl group hover:shadow-xl transition-all duration-300">
              <div className="bg-[#3E5879] w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                {" "}
                <Lightbulb className="text-white" size={30} />{" "}
              </div>
              <h4 className="text-2xl font-black text-[#3E5879] mb-4">
                الابتكار
              </h4>
              <p className="text-gray-500 font-bold leading-relaxed">
                مفاهيم سكنية عصرية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-[#3E5879] text-4xl md:text-5xl font-black leading-tight text-right">
              ماذا يقول عملاؤنا
            </h2>
            <p className="text-gray-500 font-bold text-right">
              رأيك يهمنا ويساعدنا على تقديم خدمة أفضل دائماً.
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#3E5879] text-white px-6 py-3 rounded-full font-black hover:bg-[#2c3e56] transition-all shadow-lg text-sm"
              >
                <MessageSquare size={18} />
                أضف تقييمك الآن
              </button>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                onClick={() =>
                  fetchTestimonials(testimonialPagination.current_page - 1)
                }
                disabled={
                  testimonialPagination.current_page === 1 ||
                  testimonialsLoading
                }
                className="p-3 rounded-full bg-[#f0f2f5] text-[#3E5879] hover:bg-[#3E5879] hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronRight size={24} />
              </button>
              <div className="flex items-center gap-2 font-black text-[#3E5879]">
                {" "}
                <span>
                  صفحة {testimonialPagination.current_page} من{" "}
                  {testimonialPagination.last_page}
                </span>{" "}
              </div>
              <button
                onClick={() =>
                  fetchTestimonials(testimonialPagination.current_page + 1)
                }
                disabled={
                  testimonialPagination.current_page ===
                    testimonialPagination.last_page || testimonialsLoading
                }
                className="p-3 rounded-full bg-[#f0f2f5] text-[#3E5879] hover:bg-[#3E5879] hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            {testimonialsLoading ? (
              <Loader2 className="animate-spin text-[#3E5879] mx-auto" />
            ) : (
              testimonials.map((testi) => (
                <div
                  key={testi.id}
                  className="bg-[#f8f9fa] p-8 rounded-[2rem] border-r-8 border-[#3E5879] flex gap-6 shadow-sm"
                >
                  <img
                    src={
                      testi.image ||
                      `https://ui-avatars.com/api/?name=${testi.name}`
                    }
                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                    alt=""
                  />
                  <div className="text-right">
                    <h4 className="font-black text-[#3E5879]">{testi.name}</h4>
                    <p className="text-gray-500 font-bold italic mt-1 leading-relaxed text-sm">
                      "{testi.content}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[#3E5879] text-4xl font-black mb-12">
            الأسئلة الشائعة
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className={`w-full p-6 flex items-center justify-between text-right ${openFaq === faq.id ? "bg-[#3E5879] text-white" : "text-[#3E5879]"}`}
                >
                  <span className="font-black">{faq.question}</span>
                  {openFaq === faq.id ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
                {openFaq === faq.id && (
                  <div className="p-6 text-gray-600 font-bold border-t text-right">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL / POPUP FOR REVIEWS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 left-6 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="text-center space-y-4">
              <div className="bg-[#f0f4f8] w-16 h-16 rounded-full flex items-center justify-center mx-auto text-[#3E5879]">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#3E5879]">
                أخبرنا برأيك
              </h3>
              <p className="text-gray-500 text-sm font-bold">
                كلماتك تسعدنا وتساعدنا على التطور
              </p>
              <form
                onSubmit={handleSubmitReview}
                className="mt-6 space-y-4 text-right"
              >
                <textarea
                  required
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="اكتب تقييمك هنا..."
                  rows="4"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-right outline-none focus:ring-2 focus:ring-[#3E5879]/20 resize-none transition-all font-bold"
                ></textarea>

                {reviewStatus.text && (
                  <div
                    className={`p-3 rounded-xl text-[11px] font-bold flex items-center gap-2 justify-end ${
                      reviewStatus.isError
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    <span>{reviewStatus.text}</span>
                    {reviewStatus.isError ? (
                      <AlertCircle size={14} />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                  </div>
                )}

                <button
                  disabled={reviewLoading}
                  type="submit"
                  className="w-full bg-[#3E5879] text-white font-black py-4 rounded-2xl hover:bg-[#2c3e56] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                >
                  {reviewLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "إرسال التقييم"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
