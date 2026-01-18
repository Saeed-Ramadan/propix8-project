import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin, BedDouble, Bath, Square, Search,
  ChevronLeft, ChevronRight, Loader2, ArrowLeftRight, Home, Heart, Filter, Calendar, Car
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function UnitsListing() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  // حالات لتخزين بيانات الـ APIs الخارجية للفلتر
  const [cities, setCities] = useState([]);
  const [compounds, setCompounds] = useState([]);
  const [developers, setDevelopers] = useState([]);

  const [filters, setFilters] = useState({
    city_id: "",
    compound_id: "",
    developer_id: "",
    unit_type_id: "",
    offer_type: "",
    min_price: "",
    max_price: "",
    rooms: "",
    bathrooms: "",
    min_area: "",
    max_area: "",
    build_year: "",
    garages: "",
    development_status: "", // primary - resale
    sort: "id_desc", // الترتيب الافتراضي (الأحدث)
  });

  const navigate = useNavigate();

  // 1. جلب بيانات الفلاتر (مدن، كمبوندات، مطورين) عند تحميل الصفحة
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [resCities, resCompounds, resDevelopers] = await Promise.all([
          fetch("https://propix8.com/api/cities").then(r => r.json()),
          fetch("https://propix8.com/api/compounds").then(r => r.json()),
          fetch("https://propix8.com/api/developers").then(r => r.json())
        ]);
        if (resCities.status) setCities(resCities.data);
        if (resCompounds.status) setCompounds(resCompounds.data);
        if (resDevelopers.status) setDevelopers(resDevelopers.data);
      } catch (e) {
        console.error("Error fetching filter data", e);
      }
    };
    fetchFilterData();
  }, []);

  // 2. دالة جلب الوحدات بناءً على الفلاتر والبحث
  const fetchUnits = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      if (search) params.append("q", search);

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const url = `https://propix8.com/api/units?${params.toString()}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.status) {
        setUnits(result.data || []);
        setPagination({
          current_page: result.pagination.current_page,
          last_page: result.pagination.last_page,
          total: result.pagination.total
        });
      }
    } catch (error) {
      toast.error("خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUnits(pagination.current_page, searchQuery);
  }, [pagination.current_page, fetchUnits]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setPagination(prev => ({ ...prev, current_page: 1 }));
      fetchUnits(1, searchQuery);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      city_id: "", compound_id: "", developer_id: "", unit_type_id: "",
      offer_type: "", min_price: "", max_price: "", rooms: "",
      bathrooms: "", min_area: "", max_area: "", build_year: "",
      garages: "", development_status: "", sort: "id_desc"
    });
    setSearchQuery("");
  };

  const formatPrice = (price) => new Intl.NumberFormat("ar-EG").format(price);

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-cairo text-right pb-10" dir="rtl">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* 1. Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-start gap-2 text-gray-400 text-sm">
        <Link to="/" className="hover:text-[#3E5879] transition-colors flex items-center gap-1 font-bold">
          الرئيسية <Home size={14} />
        </Link>
        <span className="text-gray-300 font-bold">›</span>
        <span className="text-[#3E5879] font-bold">وحدات فى مصر </span>
      </nav>

      {/* 2. Search & Tools Section */}
      <div className="max-w-[1300px] mx-auto px-6 py-4 flex flex-col md:flex-row gap-3 items-center border-b border-gray-50">
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => updateFilter('offer_type', filters.offer_type === 'sale' ? 'rent' : 'sale')}
            className={`flex items-center gap-2 border rounded-md px-3 py-1.5 text-[10px] font-bold transition-all shadow-sm whitespace-nowrap ${filters.offer_type ? 'bg-[#3E5879] text-white border-[#3E5879]' : 'border-gray-200 text-gray-400'}`}
          >
            <ArrowLeftRight size={12} /> {filters.offer_type === 'rent' ? 'عرض للبيع' : 'عرض للإيجار'}
          </button>

          <div className="relative border border-gray-200 rounded-md px-3 py-1.5 shadow-sm min-w-[140px]">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-transparent w-full text-[10px] font-bold text-gray-500 outline-none appearance-none cursor-pointer"
            >
              <option value="id_desc">الأحدث أولاً</option>
              <option value="id_asc">الأقدم أولاً</option>
              <option value="price_asc">السعر: من الأقل</option>
              <option value="price_desc">السعر: من الأعلى</option>
              <option value="title_asc">الترتيب الهجائي (أ-ي)</option>
            </select>
            <ChevronLeft size={10} className="absolute left-2 top-2.5 -rotate-90 text-gray-300" />
          </div>
        </div>

        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="اضغط Enter للبحث بالكمبوند، الموقع، المطور العقاري..."
            className="w-full bg-[#FCFCFC] border border-gray-100 rounded-md py-2 pr-4 pl-10 text-[11px] font-bold outline-none placeholder:text-gray-300 focus:border-gray-300 transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-gray-300" size={16} />
          {loading && <Loader2 className="absolute left-10 top-2.5 animate-spin text-[#3E5879]" size={14} />}
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 py-4 flex flex-col lg:flex-row gap-10">

        {/* 3. Sidebar Filters */}
        <aside className="w-full lg:w-[260px] flex-shrink-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[17px] font-black text-[#1F2937]">تصفية النتائج</h2>
            <button onClick={resetFilters} className="text-[11px] text-red-500 font-bold hover:underline">مسح الكل</button>
          </div>

          <div className="space-y-6">

            {/* حالة العقار - Development Status */}
            <div>
              <p className="font-black text-[#1F2937] text-[13px] mb-3">حالة العقار</p>
              <div className="flex gap-2">
                {[
                  {id: 'primary', label: 'أولي (Primary)'},
                  {id: 'resale', label: 'إعادة بيع'}
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => updateFilter('development_status', filters.development_status === st.id ? "" : st.id)}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold border transition-all ${filters.development_status === st.id ? 'bg-[#3E5879] text-white border-[#3E5879]' : 'bg-white text-gray-400 border-gray-200'}`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* فلتر المدن الديناميكي */}
            <div>
              <p className="font-black text-[#1F2937] text-[13px] mb-3">المدينة</p>
              <select
                value={filters.city_id}
                onChange={(e) => updateFilter('city_id', e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 text-[11px] font-bold text-gray-500 outline-none"
              >
                <option value="">كل المدن</option>
                {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
              </select>
            </div>

            {/* فلتر الكمبوندات الديناميكي */}
            <div>
              <p className="font-black text-[#1F2937] text-[13px] mb-3">الكمبوند</p>
              <select
                value={filters.compound_id}
                onChange={(e) => updateFilter('compound_id', e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 text-[11px] font-bold text-gray-500 outline-none"
              >
                <option value="">كل الكمبوندات</option>
                {compounds.map(comp => <option key={comp.id} value={comp.id}>{comp.name}</option>)}
              </select>
            </div>

            {/* فلتر المطورين الديناميكي */}
            <div>
              <p className="font-black text-[#1F2937] text-[13px] mb-3">المطور العقاري</p>
              <select
                value={filters.developer_id}
                onChange={(e) => updateFilter('developer_id', e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 text-[11px] font-bold text-gray-500 outline-none"
              >
                <option value="">كل المطورين</option>
                {developers.map(dev => <option key={dev.id} value={dev.id}>{dev.name}</option>)}
              </select>
            </div>

            <hr className="border-gray-100" />

            {/* سنة البناء والجراج */}
            <div className="grid grid-cols-2 gap-2">
               <div>
                  <p className="font-black text-[#1F2937] text-[12px] mb-2 flex items-center gap-1"><Calendar size={12}/> سنة البناء</p>
                  <select
                    value={filters.build_year}
                    onChange={(e) => updateFilter('build_year', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-1.5 text-[10px] outline-none"
                  >
                    <option value="">الكل</option>
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
               </div>
               <div>
                  <p className="font-black text-[#1F2937] text-[12px] mb-2 flex items-center gap-1"><Car size={12}/> جراج</p>
                  <select
                    value={filters.garages}
                    onChange={(e) => updateFilter('garages', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-1.5 text-[10px] outline-none"
                  >
                    <option value="">الكل</option>
                    {[1, 2, 3].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
               </div>
            </div>

            <hr className="border-gray-100" />

            {/* الغرف والحمامات */}
            {[{label: 'غرف', key: 'rooms'}, {label: 'حمامات', key: 'bathrooms'}].map((item) => (
              <div key={item.key}>
                <p className="font-black text-[#1F2937] text-[13px] mb-3">{item.label}</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => updateFilter(item.key, filters[item.key] == n ? "" : n)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full border text-[11px] font-black transition-all ${filters[item.key] == n ? 'bg-[#3E5879] text-white border-[#3E5879]' : 'bg-white text-[#9CA3AF] border-gray-200 hover:border-gray-400'}`}
                    >
                      {n === 5 ? '+5' : n}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <hr className="border-gray-100" />

            {/* نطاق السعر */}
            <div>
              <p className="font-black text-[#1F2937] text-[13px] mb-3">نطاق السعر (ج.م)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="من"
                  value={filters.min_price}
                  onChange={(e) => updateFilter('min_price', e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-[#3E5879]"
                />
                <input
                  type="number"
                  placeholder="إلى"
                  value={filters.max_price}
                  onChange={(e) => updateFilter('max_price', e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-[#3E5879]"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

             {/* مساحة الوحدة */}
             <div>
              <p className="font-black text-[#1F2937] text-[13px] mb-3">المساحة (م²)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="أقل مساحة"
                  value={filters.min_area}
                  onChange={(e) => updateFilter('min_area', e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-[#3E5879]"
                />
                <input
                  type="number"
                  placeholder="أكبر مساحة"
                  value={filters.max_area}
                  onChange={(e) => updateFilter('max_area', e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-[#3E5879]"
                />
              </div>
            </div>

          </div>
        </aside>

        {/* 4. Results Section */}
        <main className="flex-1">
          {loading && units.length === 0 ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3E5879]" size={40} /></div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-[12px] font-bold text-gray-400">تم العثور على <span className="text-[#3E5879]">{pagination.total || 0}</span> وحدة</p>
              </div>

              <div className="space-y-6">
                {units.length > 0 ? (
                  units.map((unit) => (
                    <div
                      key={unit.id}
                      onClick={() => navigate(`/property-details/${unit.id}`)}
                      className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 flex flex-col md:flex-row group hover:shadow-md transition-all cursor-pointer relative"
                    >
                      <div className="w-full md:w-2/5 relative h-52 md:h-56 overflow-hidden">
                        <img src={unit.main_image} alt={unit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 bg-[#3E5879] text-white text-[10px] px-4 py-1.5 rounded-full font-bold shadow-lg">
                          {unit.offer_type === "sale" ? "للبيع" : "للإيجار"}
                        </div>
                        <button className="absolute top-4 left-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                          <Heart size={16} />
                        </button>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold mb-2">
                            <MapPin size={14} className="text-[#3E5879]" />
                            <span>{unit.city?.name} {unit.compound?.name ? `- ${unit.compound.name}` : ""}</span>
                          </div>
                          <h3 className="text-lg font-black text-[#3E5879] mb-3 line-clamp-1 group-hover:text-[#2C405A] transition-colors">{unit.title}</h3>

                          <div className="flex items-center gap-5 text-gray-500 text-[11px] font-bold border-b border-gray-50 pb-4">
                            <div className="flex items-center gap-1.5"><Square size={16} className="text-gray-300"/> {parseFloat(unit.area)} م²</div>
                            <div className="flex items-center gap-1.5"><BedDouble size={16} className="text-gray-300"/> {unit.rooms} غرف</div>
                            <div className="flex items-center gap-1.5"><Bath size={16} className="text-gray-300"/> {unit.bathrooms} حمام</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex flex-col">
                            <span className="text-[#3E5879] text-xl font-black">{formatPrice(unit.price)} ج.م</span>
                            {unit.developer && <span className="text-[10px] text-gray-400 font-bold">المطور: {unit.developer.name}</span>}
                          </div>
                          <button className="bg-[#3E5879] text-white px-8 py-2.5 rounded-2xl text-xs font-black hover:bg-[#2C405A] hover:shadow-lg transition-all active:scale-95">
                            التفاصيل
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-[2rem] py-20 text-center shadow-sm border border-dashed border-gray-200">
                    <Filter className="mx-auto text-gray-200 mb-4" size={48} />
                    <p className="text-gray-400 font-bold">لا توجد وحدات متاحة تطابق خيارات التصفية الحالية</p>
                    <button onClick={resetFilters} className="mt-4 text-[#3E5879] underline font-bold">إعادة ضبط الفلاتر</button>
                  </div>
                )}
              </div>

              {/* 5. Pagination */}
              {units.length > 0 && (
                <div className="flex justify-center items-center gap-2 pt-10">
                  <button
                    disabled={pagination.current_page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                    className={`w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 transition-all ${pagination.current_page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#3E5879] hover:text-white shadow-sm'}`}
                  >
                    <ChevronRight size={18}/>
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(pagination.last_page)].map((_, i) => {
                      const pageNum = i + 1;
                      if (pageNum === 1 || pageNum === pagination.last_page || Math.abs(pageNum - pagination.current_page) <= 1) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPagination(prev => ({ ...prev, current_page: pageNum }))}
                            className={`w-9 h-9 rounded-full text-[11px] font-black transition-all ${pagination.current_page === pageNum ? 'bg-[#3E5879] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-50 hover:bg-gray-50'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (pageNum === 2 || pageNum === pagination.last_page - 1) return <span key={pageNum} className="text-gray-300">...</span>;
                      return null;
                    })}
                  </div>

                  <button
                    disabled={pagination.current_page === pagination.last_page}
                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                    className={`w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 transition-all ${pagination.current_page === pagination.last_page ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#3E5879] hover:text-white shadow-sm'}`}
                  >
                    <ChevronLeft size={18}/>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default UnitsListing;