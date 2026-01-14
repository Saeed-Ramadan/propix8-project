import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Star, Ruler, Bed, Bath, Calendar,
  Maximize, Phone, Play, ChevronRight, Loader2, X, Send, User, AtSign, Smartphone, MessageSquareMore, CalendarCheck
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [relatedUnits, setRelatedUnits] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // حالة الـ Popup والنموذج
  const [showContactModal, setShowContactModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    fetch('https://propix8.com/api/settings')
      .then(res => res.json())
      .then(result => { if (result.status) setSettings(result.data); });

    fetch(`https://propix8.com/api/units/${id}`)
      .then(res => res.json())
      .then(result => {
        const data = result.data || result;
        if (data) {
          setUnit(data);
          const images = data.media?.filter(m => m.type === 'image') || [];
          if (images.length > 0) setActiveImage(images[0].file_path);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching unit:", err);
        setLoading(false);
      });

    setLoadingRelated(true);
    fetch(`https://propix8.com/api/units/${id}/related`)
      .then(res => res.json())
      .then(result => {
        if (result.status) setRelatedUnits(result.data);
        setLoadingRelated(false);
      })
      .catch(err => {
        console.error("Error fetching related units:", err);
        setLoadingRelated(false);
      });

  }, [id]);

  // دالة إرسال الرسالة
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      unit_id: unit.id,
      seller_id: unit.owner?.id
    };

    try {
      const response = await fetch('https://propix8.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.status) {
        toast.success(result.message || "تم إرسال رسالتك بنجاح", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          style: { fontFamily: 'Cairo', borderRadius: '15px' }
        });
        setShowContactModal(false);
        setFormData({ name: '', email: '', phone: '', address: '', message: '' });
      } else {
        toast.error("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً");
      }
    } catch (error) {
      toast.error("خطأ في الاتصال بالسيرفر");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#3E5879]" size={48} />
      </div>
    );
  }

  if (!unit) {
    return <div className="text-center py-20 font-bold text-xl font-cairo">العقار غير موجود</div>;
  }

  const images = unit.media?.filter(m => m.type === 'image').map(m => m.file_path) || [];
  const displayImages = images.length > 0 ? images : ["https://via.placeholder.com/800x600?text=No+Image+Available"];
  const unitVideo = unit.media?.find(m => m.type === 'video');

  return (
    <div className="bg-gray-50 min-h-screen font-cairo pb-20" dir="rtl">
      <ToastContainer />

      {/* Contact Modal (Popup) */}
      {showContactModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#3E5879]/20 backdrop-blur-md transition-all">
          <div className="bg-white rounded-[3rem] w-full max-w-xl mt-16 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-300 border border-white/20">
            <div className="bg-[#3E5879] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2">تواصل مع المعلن</h3>
                <p className="text-blue-100 text-sm opacity-80">أرسل استفسارك بخصوص: {unit.title}</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all z-20"
              >
                <X size={20} />
              </button>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
            </div>

            <form onSubmit={handleSendMessage} className="p-8 md:p-10 space-y-5">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="text" placeholder="الاسم الكامل"
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#3E5879] focus:bg-white transition-all font-bold text-gray-700"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="email" placeholder="البريد الإلكتروني"
                    className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#3E5879] focus:bg-white transition-all font-bold text-gray-700"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="tel" placeholder="رقم الهاتف"
                    className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#3E5879] focus:bg-white transition-all font-bold text-gray-700"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text" placeholder="العنوان (اختياري)"
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#3E5879] focus:bg-white transition-all font-bold text-gray-700"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <textarea
                required
                placeholder="بماذا يمكننا مساعدتك؟" rows="4"
                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-[#3E5879] focus:bg-white transition-all resize-none font-bold text-gray-700"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>

              <button
                disabled={submitting}
                type="submit"
                className="w-full bg-[#3E5879] text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-[#2c3d54] hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 transition-all duration-300"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> إرسال الرسالة الآن</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 1. نافذة عرض كل الصور */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-4 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10 sticky top-0 bg-white py-4 z-20 border-b">
              <h2 className="text-2xl font-black text-[#3E5879]">صور العقار ({images.length})</h2>
              <button onClick={() => setShowAllPhotos(false)} className="p-3 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className="w-full h-72 object-cover rounded-3xl cursor-pointer hover:opacity-90 transition-all"
                  onClick={() => { setActiveImage(img); setShowAllPhotos(false); }}
                  alt={`Gallery ${idx}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. قسم العنوان ومعرض الصور الرئيسي */}
      <section className="bg-white pt-8 pb-12 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-start mb-8 gap-6">
            <div className="flex-1 min-w-[300px]">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#3E5879] text-white px-4 py-1 rounded-lg text-sm font-bold shadow-sm">
                  {unit.offer_type === 'rent' ? 'للإيجار' : 'للبيع'}
                </span>
                <div className="flex text-yellow-400 items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                  <Star size={16} fill="currentColor" />
                  <span className="text-gray-700 text-sm font-bold">{unit.unit_type?.name || "عقار"}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#3E5879] mb-3 leading-tight">{unit.title}</h1>
              <div className="flex items-center text-gray-500 gap-2">
                <div className="p-1.5 bg-gray-100 rounded-full text-[#3E5879]"><MapPin size={18} /></div>
                <span className="text-lg">{unit.address || unit.city?.name}</span>
              </div>
            </div>

            <div className="text-right md:text-left bg-[#3E5879]/5 p-6 rounded-[2rem] border border-[#3E5879]/10">
              <div className="text-4xl font-black text-[#3E5879]">
                {Number(unit.price).toLocaleString()} <span className="text-lg">ج.م</span>
              </div>
              <div className="text-gray-500 font-bold mt-1">
                {Number(unit.price_per_m2).toLocaleString()} ج.م / م²
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${displayImages.length > 1 ? 'lg:grid-cols-4' : ''} gap-4 lg:h-[550px]`}>
            <div className={`${displayImages.length > 1 ? 'lg:col-span-2' : 'lg:col-span-4'} h-[250px] md:h-[350px] lg:h-[550px]`}>
              <img
                src={activeImage || displayImages[0]}
                className="w-full h-[250px] md:h-[350px] lg:h-[580px] object-cover rounded-[2.5rem] shadow-xl border-4 border-white transition-all duration-500"
                alt="Active View"
              />
            </div>

            {displayImages.length > 1 && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
                  <button onClick={() => setActiveImage(displayImages[1] || displayImages[0])} className="relative h-[150px] md:h-[200px] lg:h-[280px] overflow-hidden rounded-[2rem] group border-2 border-transparent hover:border-[#3E5879] transition-all">
                    <img src={displayImages[1] || displayImages[0]} className="w-full h-[150px] md:h-[200px] lg:h-[280px] object-cover group-hover:scale-110 transition-transform duration-500" alt="Sub 1" />
                  </button>
                  <button onClick={() => setActiveImage(displayImages[2] || displayImages[0])} className="relative h-[150px] md:h-[200px] lg:h-[280px] overflow-hidden rounded-[2rem] group border-2 border-transparent hover:border-[#3E5879] transition-all">
                    <img src={displayImages[2] || displayImages[0]} className="w-full h-[150px] md:h-[200px] lg:h-[280px] object-cover group-hover:scale-110 transition-transform duration-500" alt="Sub 2" />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
                  <button onClick={() => setActiveImage(displayImages[3] || displayImages[0])} className="relative h-[150px] md:h-[200px] lg:h-[280px] overflow-hidden rounded-[2rem] group border-2 border-transparent hover:border-[#3E5879] transition-all">
                    <img src={displayImages[3] || displayImages[0]} className="w-full h-[150px] md:h-[200px] lg:h-[280px] object-cover group-hover:scale-110 transition-transform duration-500" alt="Sub 3" />
                  </button>
                  <button
                    onClick={() => images.length > 4 ? setShowAllPhotos(true) : setActiveImage(displayImages[4] || displayImages[0])}
                    className="relative h-[150px] md:h-[200px] lg:h-[280px] overflow-hidden rounded-[2rem] group border-2 border-transparent hover:border-[#3E5879] transition-all"
                  >
                    <img src={displayImages[4] || displayImages[0]} className={`w-full h-[150px] md:h-[200px] lg:h-[280px] object-cover ${images.length > 4 ? 'brightness-50' : ''} group-hover:scale-110 transition-all duration-500`} alt="More" />
                    {images.length > 4 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold">
                        <span className="text-2xl">+{images.length - 4}</span>
                        <span className="text-xs uppercase tracking-widest">صور إضافية</span>
                      </div>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. قسم التفاصيل والجانب الجانبي */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#3E5879] mb-8 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">نظرة عامة على العقار</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Maximize className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">المساحة</span>
                <span className="font-bold text-[#3E5879]">{unit.area} م²</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Calendar className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">سنة البناء</span>
                <span className="font-bold text-[#3E5879]">{unit.build_year || "2024"}</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Bed className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">غرف النوم</span>
                <span className="font-bold text-[#3E5879]">{unit.rooms} غرف</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Bath className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">الحمامات</span>
                <span className="font-bold text-[#3E5879]">{unit.bathrooms} حمام</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Ruler className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">الجراج</span>
                <span className="font-bold text-[#3E5879]">{unit.garages || 0} جراج</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#3E5879] mb-8 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">تفاصيل الوحدة والوصف</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-sm">
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">السعر:</span>
                <span className="font-black text-[#3E5879]">{Number(unit.price).toLocaleString()} ج.م</span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">مساحة العقار:</span>
                <span className="font-black text-[#3E5879]">{unit.area} م²</span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">الكمبوند:</span>
                <span className="font-black text-[#3E5879]">{unit.compound?.name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">المطور:</span>
                <span className="font-black text-[#3E5879]">{unit.developer?.name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">الحالة:</span>
                <span className="font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">جاهز للاستلام</span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">كود الوحدة:</span>
                <span className="font-black text-[#3E5879]">#{unit.id}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl">
              <p className="text-gray-600 leading-[2.2] text-justify">{unit.description}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#3E5879] mb-8 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">جولة داخل العقار</h3>
            {unitVideo ? (
              <div className="rounded-[2.5rem] overflow-hidden aspect-video bg-black shadow-2xl border-8 border-white">
                <video controls className="w-full h-full object-contain" poster={displayImages[0]}>
                  <source src={unitVideo.file_path} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-video bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-200">
                <div className="text-center">
                  <Play size={48} className="text-gray-200 mx-auto mb-3" />
                  <div className="text-gray-400 font-bold tracking-widest uppercase text-xs">الفيديو سيتم توفيره قريباً</div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#3E5879] mb-8 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">موقع العقار</h3>
            <div className="rounded-[2.5rem] overflow-hidden h-[400px] bg-gray-100 border-4 border-white shadow-lg relative">
              {unit.latitude && unit.longitude ? (
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  title="Property Location"
                  src={`https://maps.google.com/maps?q=${unit.latitude},${unit.longitude}&z=15&output=embed`}
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <MapPin size={48} className="mb-2 opacity-20" />
                  <p className="font-bold">الموقع الجغرافي غير متوفر حالياً</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50 sticky top-24">
            <div className="flex items-center gap-5 mb-8">
              <Link to={`/profileFromOther/${unit.owner?.id}`} className="relative group cursor-pointer">
                <img
                  src={unit.owner?.avatar || "https://via.placeholder.com/100"}
                  className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-gray-50 shadow-sm group-hover:border-[#3E5879] transition-all"
                  alt={unit.owner?.name}
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
              </Link>
              <div>
                <Link to={`/profileFromOther/${unit.owner?.id}`} className="hover:text-[#3E5879] transition-colors">
                  <h4 className="font-black text-xl text-[#3E5879]">{unit.owner?.name}</h4>
                </Link>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">{unit.owner?.role || "مستشار عقاري"}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* زر احجز الآن المحدث */}
              <button 
                onClick={() => navigate(`/booking/${id}`)}
                className="w-full bg-[#3E5879] text-white py-5 rounded-2xl font-black hover:bg-[#2c3d54] transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
              >
                <CalendarCheck size={20} /> احجز الآن
              </button>

              <button
                onClick={() => setShowContactModal(true)}
                className="w-full border-2 border-[#3E5879] text-[#3E5879] py-5 rounded-2xl font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <MessageSquareMore /> أرسل رسالة للمعلن
              </button>
            </div>

            {unit.developer && (
              <div className="mt-10 pt-8 border-t border-gray-50">
                <p className="text-[10px] text-gray-300 mb-5 font-black uppercase tracking-[0.2em] text-center">المطور العقاري المعتمد</p>
                <div className="flex flex-col items-center gap-3 group">
                  <img src={unit.developer.logo} className="h-14 w-auto grayscale group-hover:grayscale-0 transition-all duration-500" alt={unit.developer.name} />
                  <span className="text-sm font-black text-gray-500 group-hover:text-[#3E5879] transition-colors">{unit.developer.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. قسم عقارات مشابهة */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[#3E5879] font-black text-xs uppercase tracking-[0.3em] mb-2 block">اكتشف المزيد</span>
            <h2 className="text-3xl font-black text-[#3E5879]">عقارات قد تهمك في نفس المنطقة</h2>
          </div>
          <button
            onClick={() => navigate(`/related-properties/${id}`)}
            className="bg-white border border-gray-200 px-6 py-3 rounded-2xl font-black text-[#3E5879] flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            شاهد الكل <ChevronRight size={18} />
          </button>
        </div>

        {loadingRelated ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[4rem] border border-gray-100 shadow-inner">
            <Loader2 className="animate-spin text-[#3E5879] mb-4" size={40} />
            <p className="text-gray-400 font-bold italic">يتم الآن تحديث قائمة العقارات المقترحة...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedUnits.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/property-details/${item.id}`)}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.main_image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.title}
                  />
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                    <MapPin size={14} className="text-[#3E5879]" />
                    <span className="text-[12px] font-bold text-gray-700">{item.city?.name}</span>
                  </div>
                  <div className="absolute bottom-5 right-5 bg-[#3E5879] text-white px-4 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {item.offer_type === 'rent' ? 'للإيجار' : 'للبيع'}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-black text-lg text-[#3E5879] line-clamp-1 flex-1">{item.title}</h3>
                  </div>

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
      </section>
    </div>
  );
}