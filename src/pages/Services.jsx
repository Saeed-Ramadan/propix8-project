import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, Search, Scale, ShieldCheck, Settings, 
  Megaphone, Wallet, Loader2, MapPin, Maximize, 
  Bed, Bath, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function Services() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [services, setServices] = useState([]);
  const [recommendedUnits, setRecommendedUnits] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(true);

  // دالة تحريك السلايدر
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const getServiceIcon = (id) => {
    const icons = {
      1: <Search size={35} className="text-[#3E5879]" />,
      2: <Scale size={35} className="text-[#3E5879]" />,
      3: <ShieldCheck size={35} className="text-[#3E5879]" />,
      4: <Settings size={35} className="text-[#3E5879]" />,
      5: <Megaphone size={35} className="text-[#3E5879]" />,
      6: <Wallet size={35} className="text-[#3E5879]" />,
    };
    return icons[id] || <Home size={35} className="text-[#3E5879]" />;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // 1. جلب الخدمات
    fetch('https://propix8.com/api/services')
      .then(res => res.json())
      .then(result => {
        if (result.status) setServices(result.data);
        setLoadingServices(false);
      })
      .catch(() => setLoadingServices(false));

    // 2. جلب أحدث الوحدات من الـ API الجديد
    fetch('https://propix8.com/api/units/latest')
      .then(res => res.json())
      .then(result => {
        if (result.status) {
          setRecommendedUnits(result.data);
        }
        setLoadingUnits(false);
      })
      .catch(() => setLoadingUnits(false));
  }, []);

  return (
    <div className="bg-white min-h-screen font-cairo text-right pb-24" dir="rtl">
      
      {/* 1. Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-8 flex items-center gap-2 text-gray-400 text-sm font-bold">
        <Home size={16} />
        <Link to="/" className="hover:text-[#3E5879] transition-colors">الرئيسية</Link>
        <span className="text-gray-200">/</span>
        <span className="text-[#3E5879]">خدماتنا</span>
      </nav>

      {/* 2. Intro Section */}
      <section className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-[#3E5879]/10 text-[#3E5879] px-6 py-2 rounded-full text-sm font-black mb-6">
            لماذا تختارنا؟
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#3E5879] mb-8 leading-tight">
            نحن نوفر لك حلولاً عقارية متكاملة <br/> تلبي كافة تطلعاتك
          </h2>
          <p className="text-gray-500 leading-[2.2] text-lg text-justify font-medium mb-8">
            في شركتنا، لا نكتفي ببيع العقارات فحسب، بل نبني علاقات طويلة الأمد قائمة على الثقة والشفافية. فريقنا من الخبراء القانونيين والمسوقين يعملون جاهدين لضمان حصولك على أفضل قيمة استثمارية.
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000" 
              className="w-full rounded-[3rem] shadow-2xl border-[12px] border-white relative z-10" 
              alt="Services Intro" 
            />
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#3E5879]/5 rounded-full -z-0"></div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-10 w-2 bg-[#3E5879] rounded-full"></div>
          <h2 className="text-3xl font-black text-[#3E5879]">خدماتنا الاحترافية</h2>
        </div>
        
        {loadingServices ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3E5879]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-[#f8fafc] rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between group hover:bg-white hover:shadow-2xl hover:shadow-[#3E5879]/10 transition-all duration-500 border border-transparent hover:border-gray-100"
              >
                <div className="flex-1 ml-6 text-center md:text-right">
                  <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-[#3E5879] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 font-bold leading-relaxed max-w-4xl">
                    {service.description}
                  </p>
                </div>
                <div className="mt-6 md:mt-0 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 group-hover:scale-110 transition-transform duration-500">
                  {getServiceIcon(service.id)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Latest Properties (Horizontal Slider) */}
      <section className="max-w-7xl mx-auto px-6 mt-32 relative">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#3E5879] font-black text-xs uppercase tracking-[0.3em] mb-2 block">أحدث العقارات</span>
            <h2 className="text-3xl font-black text-[#3E5879]">عقارات مميزة أضيفت حديثاً</h2>
          </div>
          
          {/* أزرار التحكم في السلايدر */}
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('right')}
              className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-[#3E5879] hover:text-white transition-all active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
            <button 
              onClick={() => scroll('left')}
              className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-[#3E5879] hover:text-white transition-all active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
        </div>

        {loadingUnits ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3E5879]" size={40} /></div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 pb-10 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recommendedUnits.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/property-details/${item.id}`)}
                className="min-w-[calc(100%-1rem)] md:min-w-[calc(50%-1.5rem)] lg:min-w-[calc(33.333%-1.5rem)] snap-start bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer group"
              >
                {/* Image Header */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.main_image || "https://via.placeholder.com/800x600"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.title}
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <MapPin size={14} className="text-[#3E5879]" />
                    <span className="text-[12px] font-black text-gray-700">{item.city?.name || "مصر"}</span>
                  </div>
                  <div className="absolute bottom-6 right-6 bg-[#3E5879] text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg">
                    {item.offer_type === 'rent' ? 'للإيجار' : 'للبيع'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="font-black text-xl text-[#3E5879] mb-3 line-clamp-1 group-hover:text-blue-900 transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="text-2xl font-black text-[#3E5879] mb-6 flex items-baseline gap-1">
                    {Number(item.price).toLocaleString()} 
                    <span className="text-sm font-bold opacity-60">ج.م</span>
                  </div>

                  {/* Features Grid */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-col items-center gap-1">
                      <Maximize size={18} className="text-gray-300" />
                      <span className="text-xs font-black text-gray-500">{item.area} م²</span>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-100"></div>
                    <div className="flex flex-col items-center gap-1">
                      <Bed size={18} className="text-gray-300" />
                      <span className="text-xs font-black text-gray-500">{item.rooms} غرف</span>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-100"></div>
                    <div className="flex flex-col items-center gap-1">
                      <Bath size={18} className="text-gray-300" />
                      <span className="text-xs font-black text-gray-500">{item.bathrooms} حمام</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}