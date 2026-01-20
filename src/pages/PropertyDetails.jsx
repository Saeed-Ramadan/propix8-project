import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Ruler,
  Bed,
  Bath,
  Calendar,
  Maximize,
  Phone,
  Play,
  ChevronRight,
  Loader2,
  X,
  Send,
  User,
  AtSign,
  Smartphone,
  MessageSquareMore,
  CalendarCheck,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImagePlaceholder from "../components/common/ImagePlaceholder";
import MapPlaceholder from "../components/common/MapPlaceholder";

// ... [Skipping unchanged lines for brevity if possible, but replace tool needs context]
// I will split this into chunks to be safe.

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
  const [isFavorite, setIsFavorite] = useState(false);

  // حالة الـ Popup والنموذج
  const [isModalOpen, setIsModalOpen] = useState(false); // Changed from showContactModal
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  // --- حالات التقييم (إضافة وعرض) ---
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [unitReviews, setUnitReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  // دالة جلب التقييمات
  const fetchReviews = (page = 1) => {
    setReviewsLoading(true);
    fetch(`https://propix8.com/api/units/${id}/reviews?page=${page}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          setUnitReviews(result.data);
          setReviewsPagination({
            current_page: result.pagination.current_page,
            last_page: result.pagination.last_page,
          });
        }
        setReviewsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setReviewsLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    const token = localStorage.getItem("userToken");

    fetch("https://propix8.com/api/settings")
      .then((res) => res.json())
      .then((result) => {
        if (result.status) setSettings(result.data);
      });

    fetch(`https://propix8.com/api/units/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const data = result.data || result;
        if (data) {
          setUnit(data);
          setIsFavorite(!!data.is_favorite);
          const images = data.media?.filter((m) => m.type === "image") || [];
          if (images.length > 0) setActiveImage(images[0].file_path);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching unit:", err);
        setLoading(false);
      });

    setLoadingRelated(true);
    fetch(`https://propix8.com/api/units/${id}/related`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status) setRelatedUnits(result.data);
        setLoadingRelated(false);
      })
      .catch((err) => {
        console.error("Error fetching related units:", err);
        setLoadingRelated(false);
      });

    fetchReviews();
  }, [id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.warning("يرجى تسجيل الدخول أولاً لاستخدام المفضلة", {
        position: "top-center",
      });
      return;
    }
    setIsFavorite((prev) => !prev);
    try {
      const response = await fetch("https://propix8.com/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ unit_id: id }),
      });
      const result = await response.json();
      if (response.ok && result.status) {
        toast.success(result.message, {
          position: "top-center",
          autoClose: 1500,
          theme: "colored",
          style: { fontFamily: "Cairo", borderRadius: "15px" },
        });
      } else {
        setIsFavorite((prev) => !prev);
        toast.error(result.message || "حدث خطأ، حاول مرة أخرى");
      }
    } catch (error) {
      setIsFavorite((prev) => !prev);
      console.error("Favorite Toggle Error:", error);
      toast.error("خطأ في الاتصال بالسيرفر");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      unit_id: unit.id,
      seller_id: unit.owner?.id,
    };
    try {
      const response = await fetch("https://propix8.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.status) {
        toast.success(result.message || "تم إرسال رسالتك بنجاح", {
          position: "top-center",
          autoClose: 4000,
          theme: "colored",
          style: { fontFamily: "Cairo", borderRadius: "15px" },
        });
        setIsModalOpen(false); // Changed from setShowContactModal
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
        });
      } else {
        toast.error("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً");
      }
    } catch (error) {
      toast.error("خطأ في الاتصال بالسيرفر");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.warning("يرجى تسجيل الدخول أولاً لإضافة تقييم", {
        position: "top-center",
      });
      return;
    }
    if (rating === 0) {
      toast.error("يرجى تحديد التقييم بالنجوم");
      return;
    }
    setSubmittingReview(true);
    try {
      const response = await fetch("https://propix8.com/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ unit_id: id, rating: rating, comment: comment }),
      });
      const result = await response.json();
      if (response.ok || result.status) {
        toast.success("تم إضافة تقييمك بنجاح، شكراً لك!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          style: { fontFamily: "Cairo", borderRadius: "15px" },
        });
        setRating(0);
        setComment("");
        fetchReviews();
      } else {
        toast.error(result.message || "حدث خطأ أثناء إرسال التقييم");
      }
    } catch (error) {
      toast.error("خطأ في الاتصال بالسيرفر");
    } finally {
      setSubmittingReview(false);
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
    return (
      <div className="text-center py-20 font-bold text-xl font-cairo">
        العقار غير موجود
      </div>
    );
  }

  const images =
    unit.media?.filter((m) => m.type === "image").map((m) => m.file_path) || [];
  // هذا المتغير سيساعدنا في معرفة هل نعرض المعرض أم رسالة "لا توجد صور"
  const hasImages = images.length > 0;
  const displayImages =
    images.length > 0
      ? images
      : ["https://via.placeholder.com/800x600?text=No+Image+Available"];
  const unitVideo = unit.media?.find((m) => m.type === "video");

  return (
    <div className="bg-gray-50 min-h-screen font-cairo pb-20" dir="rtl">
      <ToastContainer />

      {/* Contact Modal  */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm mt-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition-colors z-[120]"
              >
                <X size={24} />
              </button>
              {/* Image Header */}
              <div className="h-32 bg-[#3E5879] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 pattern-dots"></div>
                <h3 className="text-2xl font-black text-white relative z-10">
                  تواصل مع المالك
                </h3>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8">
                {/* Owner Info */}
                <div className="flex flex-row justify-between items-center mb-4 gap-3 bg-gray-50 p-3 rounded-lg">
                  {/* ... same owner info ... */}
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        unit.owner?.avatar || "https://via.placeholder.com/100"
                      }
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      alt="owner"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        {unit.owner?.name}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-500 mt-0.5">
                        <span className="text-xs font-medium">
                          {unit.owner?.phone || "010000000"}
                        </span>
                        <Phone
                          size={12}
                          className="text-[#3E5879] rotate-[270deg]"
                        />
                      </div>
                    </div>
                  </div>
                  <button className="text-[#3E5879] font-bold text-xs hover:underline">
                    التفاصيل
                  </button>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSendMessage} className="space-y-4">
                  {/* ... same form inputs ... */}
                  <p className="font-bold text-gray-700 text-sm mb-1">
                    معلوماتك
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      required
                      type="text"
                      placeholder="الاسم بالكامل"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#3E5879] transition-all text-xs text-right"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <input
                      required
                      type="email"
                      placeholder="البريد الإلكتروني"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#3E5879] transition-all text-xs text-right"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <input
                      required
                      type="tel"
                      placeholder="رقم الهاتف"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#3E5879] transition-all text-xs text-right"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      required
                      placeholder="اكتب رسالتك هنا..."
                      rows="3"
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#3E5879] transition-all resize-none text-xs text-right"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-[#465E7D] text-white py-3 rounded-lg font-bold text-base hover:bg-[#3E5879] transition-all disabled:opacity-50 shadow-md"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin mx-auto" size={20} />
                    ) : (
                      "إرسال الرسالة"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة عرض كل الصور */}
      <AnimatePresence>
        {showAllPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto p-4 md:p-10"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-10 sticky top-0 bg-white py-4 z-20 border-b">
                <h2 className="text-3xl font-black text-[#3E5879]">
                  معرض الصور ({images.length})
                </h2>
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 + (index + 1) * 0.05 }}
                    className="aspect-video rounded-3xl overflow-hidden shadow-sm"
                  >
                    <img
                      src={img}
                      alt={`${unit.title} - ${index}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* قسم العنوان ومعرض الصور الرئيسي */}
      <section className="bg-white pt-8 pb-12 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-between items-start mb-8 gap-6"
          >
            <div className="flex-1 min-w-[300px]">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#3E5879] text-white px-4 py-1 rounded-lg text-sm font-bold shadow-sm">
                  {unit.offer_type === "rent" ? "للإيجار" : "للبيع"}
                </span>
                <div className="flex text-yellow-400 items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                  <Star size={16} fill="currentColor" />
                  <span className="text-gray-700 text-sm font-bold">
                    {unit.unit_type?.name || "عقار"}
                  </span>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-xl transition-all ${isFavorite ? "bg-yellow-50 text-yellow-500 scale-110" : "bg-gray-50 text-gray-300 hover:text-yellow-500"}`}
                >
                  <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#3E5879] mb-3 leading-tight">
                {unit.title}
              </h1>
              <div className="flex items-center text-gray-500 gap-2">
                <div className="p-1.5 bg-gray-100 rounded-full text-[#3E5879]">
                  <MapPin size={18} />
                </div>
                <span className="text-lg">
                  {unit.address || unit.city?.name}
                </span>
              </div>
            </div>

            <div className="text-right md:text-left bg-[#3E5879]/5 p-6 rounded-[0.5rem] border border-[#3E5879]/10">
              <div className="text-4xl font-black text-[#3E5879]">
                {Number(unit.price).toLocaleString()}{" "}
                <span className="text-lg">ج.م</span>
              </div>
              <div className="text-gray-500 font-bold mt-1">
                {Number(unit.price_per_m2).toLocaleString()} ج.م / م²
              </div>
            </div>
          </motion.div>

          {hasImages ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`grid grid-cols-1 ${images.length > 1 ? "lg:grid-cols-4" : ""} gap-4 lg:h-[550px]`}
            >
              <div
                className={`${displayImages.length > 1 ? "lg:col-span-2" : "lg:col-span-4"} h-[250px] md:h-[350px] lg:h-[550px]`}
              >
                <img
                  src={activeImage || displayImages[0]}
                  className="w-full h-full object-cover rounded-[0.5rem] shadow-xl border-4 border-white transition-all duration-500"
                  alt="Active View"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070";
                  }}
                />
              </div>
              {displayImages.length > 1 && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
                    <button
                      onClick={() =>
                        setActiveImage(displayImages[1] || displayImages[0])
                      }
                      className="relative h-[150px] md:h-[200px] lg:h-[280px] overflow-hidden rounded-[0.5rem] group border-2 border-transparent hover:border-[#3E5879] transition-all"
                    >
                      <img
                        src={displayImages[1] || displayImages[0]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="Sub 1"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImage(displayImages[2] || displayImages[0])
                      }
                      className="relative h-[150px] md:h-[200px] lg:h-[280px] overflow-hidden rounded-[0.5rem] group border-2 border-transparent hover:border-[#3E5879] transition-all"
                    >
                      <img
                        src={displayImages[2] || displayImages[0]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="Sub 2"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
                    <button
                      onClick={() =>
                        setActiveImage(displayImages[3] || displayImages[0])
                      }
                      className="relative h-[150px] md:h-[200px] lg:h-[280px] overflow-hidden rounded-[0.5rem] group border-2 border-transparent hover:border-[#3E5879] transition-all"
                    >
                      <img
                        src={displayImages[3] || displayImages[0]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="Sub 3"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </button>
                    <button
                      onClick={() =>
                        images.length > 4
                          ? setShowAllPhotos(true)
                          : setActiveImage(displayImages[4] || displayImages[0])
                      }
                      className="relative h-[150px] md:h-[200px] lg:h-[280px] overflow-hidden rounded-[0.5rem] group border-2 border-transparent hover:border-[#3E5879] transition-all"
                    >
                      <img
                        src={displayImages[4] || displayImages[0]}
                        className={`w-full h-full object-cover ${images.length > 4 ? "brightness-50" : ""} group-hover:scale-110 transition-all duration-500`}
                        alt="More"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      {images.length > 4 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold">
                          <span className="text-2xl">+{images.length - 4}</span>
                          <span className="text-xs uppercase tracking-widest">
                            صور إضافية
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            // الرسالة التي تظهر في حال عدم وجود صور
            <div className="w-full h-[400px]">
              <ImagePlaceholder
                className="w-full h-full rounded-[0.5rem]"
                iconSize={64}
                text="لا توجد صور متاحة لهذا العقار"
              />
            </div>
          )}
        </div>
      </section>

      {/* قسم التفاصيل والجانب الجانبي */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        <div className="lg:col-span-2 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#3E5879] mb-8 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">
              نظرة عامة على العقار
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Maximize className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">
                  المساحة
                </span>
                <span className="font-bold text-[#3E5879]">{unit.area} م²</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Calendar className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">
                  سنة البناء
                </span>
                <span className="font-bold text-[#3E5879]">
                  {unit.build_year || "2024"}
                </span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Bed className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">
                  غرف النوم
                </span>
                <span className="font-bold text-[#3E5879]">
                  {unit.rooms} غرف
                </span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Bath className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">
                  الحمامات
                </span>
                <span className="font-bold text-[#3E5879]">
                  {unit.bathrooms} حمام
                </span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <Ruler className="text-[#3E5879] mb-3" size={28} />
                <span className="text-[10px] text-gray-400 font-black mb-1 uppercase">
                  الجراج
                </span>
                <span className="font-bold text-[#3E5879]">
                  {unit.garages || 0} جراج
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#3E5879] mb-8 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">
              تفاصيل الوحدة والوصف
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-sm">
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">السعر:</span>
                <span className="font-black text-[#3E5879]">
                  {Number(unit.price).toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">مساحة العقار:</span>
                <span className="font-black text-[#3E5879]">
                  {unit.area} م²
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">الكمبوند:</span>
                <button
                  onClick={() =>
                    unit.compound?.id &&
                    navigate(`/compoundUnits/${unit.compound.id}`)
                  }
                  className={`px-3 py-1 rounded-full font-black text-sm transition-all shadow-sm ${
                    unit.compound?.id
                      ? "bg-[#3E5879]/10 text-[#3E5879] hover:bg-[#3E5879] hover:text-white cursor-pointer"
                      : "text-gray-400"
                  }`}
                >
                  {unit.compound?.name || "N/A"}
                </button>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">المطور:</span>
                <span className="font-black text-[#3E5879]">
                  {unit.developer?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">الحالة:</span>
                <span className="font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  جاهز للاستلام
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b border-gray-50">
                <span className="text-gray-400 font-bold">كود الوحدة:</span>
                <span className="font-black text-[#3E5879]">#{unit.id}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl">
              <p className="text-gray-600 leading-[2.2] text-justify">
                {unit.description}
              </p>
            </div>
          </motion.div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#3E5879] mb-6 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">
              أضف تقييمك
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      size={32}
                      fill={star <= rating ? "#FFD700" : "none"}
                      color={star <= rating ? "#FFD700" : "#D1D5DB"}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-[#3E5879] focus:bg-white transition-all resize-none font-bold text-gray-700 h-32"
                required
              ></textarea>
              <button
                disabled={submittingReview}
                type="submit"
                className="bg-[#3E5879] text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-[#2c3d54] disabled:opacity-50 transition-all shadow-md active:scale-95"
              >
                {submittingReview ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "نشر التقييم"
                )}
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#3E5879] mb-8 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">
              تقييمات الزوار
            </h3>
            {reviewsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-[#3E5879]" />
              </div>
            ) : unitReviews.length > 0 ? (
              <div className="space-y-6">
                {unitReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-2 bg-gray-50 rounded-[1rem] border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#3E5879] text-white rounded-full flex items-center justify-center font-black">
                          {rev.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#3E5879]">
                            {rev.user?.name}
                          </h4>
                          <span className="text-[10px] text-gray-400">
                            {new Date(rev.created_at).toLocaleDateString(
                              "ar-EG",
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < rev.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 font-bold leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}

                {reviewsPagination.last_page > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      disabled={reviewsPagination.current_page === 1}
                      onClick={() =>
                        fetchReviews(reviewsPagination.current_page - 1)
                      }
                      className="p-3 rounded-xl bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <span className="font-black text-[#3E5879]">
                      صفحة {reviewsPagination.current_page} من{" "}
                      {reviewsPagination.last_page}
                    </span>
                    <button
                      disabled={
                        reviewsPagination.current_page ===
                        reviewsPagination.last_page
                      }
                      onClick={() =>
                        fetchReviews(reviewsPagination.current_page + 1)
                      }
                      className="p-3 rounded-xl bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-400 font-bold py-10">
                لا توجد تقييمات لهذا العقار بعد.
              </p>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#3E5879] mb-8 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">
              جولة داخل العقار
            </h3>
            {unitVideo ? (
              <div className="rounded-[2.5rem] overflow-hidden aspect-video bg-black shadow-2xl border-8 border-white">
                <video
                  controls
                  className="w-full h-full object-contain"
                  poster={displayImages[0]}
                >
                  <source src={unitVideo.file_path} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-video bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-200">
                <div className="text-center">
                  <Play size={48} className="text-gray-200 mx-auto mb-3" />
                  <div className="text-gray-400 font-bold tracking-widest uppercase text-xs">
                    الفيديو سيتم توفيره قريباً
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#3E5879] mb-8 border-r-4 border-[#3E5879] pr-3 uppercase tracking-wide">
              موقع العقار
            </h3>
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
                  className="w-full h-full"
                ></iframe>
              ) : (
                <MapPlaceholder className="w-full h-full bg-gray-50 content-center" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50 sticky top-24">
            <div className="flex items-center gap-5 mb-8">
              <div className="relative group">
                {unit.owner?.avatar ? (
                  <img
                    src={unit.owner.avatar}
                    className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-gray-50 shadow-sm transition-all"
                    alt={unit.owner?.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      // Sibling placeholder logic needed or just replace with placeholder component
                      // Since we can't easily swap to component in onError, we swap src to a local placeholder or just hide.
                      // Better: render component conditional on error state, but inline is easier:
                      e.target.parentNode.innerHTML =
                        '<div class="w-20 h-20 rounded-[1.5rem] bg-gray-100 flex items-center justify-center border-4 border-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>';
                    }}
                  />
                ) : (
                  <ImagePlaceholder
                    className="w-20 h-20 rounded-[1.5rem]"
                    iconSize={24}
                    text=""
                  />
                )}
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
              </div>
              <div>
                <div>
                  <h4 className="font-black text-xl text-[#3E5879]">
                    {unit.owner?.name}
                  </h4>
                </div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">
                  {unit.owner?.role || "مستشار عقاري"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate(`/booking/${id}`)}
                className="w-full bg-[#3E5879] text-white py-5 rounded-2xl font-black hover:bg-[#2c3d54] transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
              >
                <CalendarCheck size={20} /> احجز الآن
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full border-2 border-[#3E5879] text-[#3E5879] py-5 rounded-2xl font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <MessageSquareMore /> أرسل رسالة للمعلن
              </button>
            </div>

            {unit.developer && (
              <div className="mt-10 pt-8 border-t border-gray-50">
                <p className="text-[10px] text-gray-300 mb-5 font-black uppercase tracking-[0.2em] text-center">
                  المطور العقاري المعتمد
                </p>
                <div
                  onClick={() =>
                    unit.developer?.id &&
                    navigate(`/developerUnits/${unit.developer.id}`)
                  }
                  className={`flex flex-col items-center gap-3 group transition-all p-4 rounded-3xl ${unit.developer?.id ? "cursor-pointer hover:bg-gray-50 hover:scale-105 active:scale-95" : ""}`}
                >
                  <img
                    src={unit.developer.logo}
                    className="h-14 w-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                    alt={unit.developer.name}
                  />
                  <span className="text-sm font-black text-gray-500 group-hover:text-[#3E5879] transition-colors underline decoration-dotted decoration-2 underline-offset-4">
                    {unit.developer.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[#3E5879] font-black text-xs uppercase tracking-[0.3em] mb-2 block">
              اكتشف المزيد
            </span>
            <h2 className="text-3xl font-black text-[#3E5879]">
              عقارات قد تهمك في نفس المنطقة
            </h2>
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
            <p className="text-gray-400 font-bold italic">
              يتم الآن تحديث قائمة العقارات المقترحة...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedUnits.slice(0, 3).map((item) => (
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
                  <div className="absolute bottom-5 right-5 bg-[#3E5879] text-white px-4 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {item.offer_type === "rent" ? "للإيجار" : "للبيع"}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-black text-lg text-[#3E5879] line-clamp-1 flex-1">
                      {item.title}
                    </h3>
                  </div>
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
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
