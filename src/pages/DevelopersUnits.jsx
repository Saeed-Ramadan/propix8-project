import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin, Phone, Mail, Building2,
  BedDouble, Bath, Maximize,
  ArrowLeft, Loader2, Info
} from 'lucide-react';

function DevelopersUnits() {
  // سحب الـ ID من الـ URL (مثلاً: /developer/2)
  const { id } = useParams();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // التأكد من وجود ID قبل طلب البيانات
    if (id) {
      setLoading(true);
      axios.get(`https://propix8.com/api/developers/${id}`)
        .then(response => {
          if (response.data.status) {
            setDeveloper(response.data.data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching developer data:", err);
          setLoading(false);
        });
    }
  }, [id]); // إعادة الطلب عند تغيير الـ ID في الـ URL

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#3E5879]" size={50} />
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="text-center py-20 font-bold text-[#3E5879]">
        عذراً، لم يتم العثور على بيانات هذا المطور (ID: {id})
      </div>
    );
  }

  const filteredUnits = developer.units.filter(unit =>
    filter === 'all' ? true : unit.offer_type === filter
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-right" dir="rtl">

      {/* --- Hero Section --- */}
      <div className="relative h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Real Estate Background"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#3E5879]/95 via-[#3E5879]/85 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Developer Logo */}
            <div className="w-44 h-44 bg-white rounded-[0.5rem] p-6 shadow-2xl border-4 border-white/10 flex items-center justify-center backdrop-blur-sm transform transition hover:scale-105">
              <img
                src={developer.logo}
                alt={developer.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Developer Identity */}
            <div className="flex-1 text-center md:text-right">
              <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-[0.5rem] text-xs font-bold mb-4 border border-white/20">
                مطور عقاري معتمد
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight drop-shadow-md">
                {developer.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl text-sm font-medium">
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-[0.5rem] backdrop-blur-lg border border-white/10">
                  <MapPin size={22} className="text-blue-300 flex-shrink-0" />
                  <span className="line-clamp-1">{developer.address}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-[0.5rem] backdrop-blur-lg border border-white/10">
                  <Phone size={22} className="text-blue-300 flex-shrink-0" />
                  <span dir="ltr">{developer.phone}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-[0.5rem] backdrop-blur-lg border border-white/10">
                  <Mail size={22} className="text-blue-300 flex-shrink-0" />
                  <span className="truncate">{developer.email}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-[0.5rem] backdrop-blur-lg border border-white/10">
                  <Building2 size={22} className="text-blue-300 flex-shrink-0" />
                  <span>{developer.units.length} وحدة متاحة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Floating Header & Content --- */}
      <div className="container mx-auto px-6 pb-24">

        {/* Floating Bar - تم ضبط الـ Z-Index والـ Margin */}
        <div className="relative -mt-16 z-[110] bg-white rounded-[0.5rem] shadow-2xl p-6 mb-16 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-[#3E5879]/10 rounded-2xl">
              <Info className="text-[#3E5879]" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">قائمة العقارات</h2>
              <p className="text-sm text-gray-500">مشاريع المطور {developer.name}</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 p-1.5 bg-gray-50 rounded-[0.5rem] border border-gray-100">
             <button
              onClick={() => setFilter('all')}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-[#3E5879] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
             >
               الكل
             </button>
             <button
              onClick={() => setFilter('sale')}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'sale' ? 'bg-[#3E5879] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
             >
               بيع
             </button>
             <button
              onClick={() => setFilter('rent')}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'rent' ? 'bg-[#3E5879] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
             >
               إيجار
             </button>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              onClick={() => navigate(`/property-details/${unit.id}`)}
              className="group bg-white rounded-[0.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden bg-gray-50">
                <img
                  src={unit.unit_type.icon}
                  className="absolute inset-0 w-full h-full object-cover opacity-15 scale-125 group-hover:scale-150 transition-transform duration-700"
                  alt="Pattern"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-40" />
                <div className={`absolute top-6 right-6 px-5 py-2 rounded-full text-xs font-black shadow-xl backdrop-blur-md ${
                  unit.offer_type === 'rent' ? 'bg-orange-500 text-white' : 'bg-[#3E5879] text-white'
                }`}>
                  {unit.offer_type === 'rent' ? 'للإيجار' : 'للبيع'}
                </div>
                <div className="absolute bottom-6 right-6 left-6 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">{unit.unit_type.name}</p>
                  <h3 className="text-xl font-bold line-clamp-1">{unit.title}</h3>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                  <MapPin size={16} className="text-[#3E5879]" />
                  <span className="truncate font-medium">{unit.address}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="flex flex-col items-center p-4 bg-[#3E5879]/5 rounded-[0.5rem] border border-transparent group-hover:border-[#3E5879]/20 transition-all">
                    <BedDouble size={20} className="text-[#3E5879] mb-1.5" />
                    <span className="text-sm font-black text-gray-800">{unit.rooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-[#3E5879]/5 rounded-[0.5rem] border border-transparent group-hover:border-[#3E5879]/20 transition-all">
                    <Bath size={20} className="text-[#3E5879] mb-1.5" />
                    <span className="text-sm font-black text-gray-800">{unit.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-[#3E5879]/5 rounded-0.5rem border border-transparent group-hover:border-[#3E5879]/20 transition-all">
                    <Maximize size={20} className="text-[#3E5879] mb-1.5" />
                    <span className="text-sm font-black text-gray-800">{Math.round(unit.area)} م²</span>
                  </div>
                </div>
                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">السعر</p>
                    <p className="text-2xl font-black text-[#3E5879]">
                      {Number(unit.price).toLocaleString()}
                      <span className="text-xs font-bold mr-1">ج.م</span>
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#3E5879] text-white flex items-center justify-center group-hover:rotate-45 transition-all duration-500 shadow-xl">
                    <ArrowLeft size={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DevelopersUnits;