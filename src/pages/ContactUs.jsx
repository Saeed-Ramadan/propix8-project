import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  MapPin,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUs() {
  // 1. حالات النموذج (Form States)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  // 2. حالات بيانات التواصل من السيرفر (Settings States)
  const [settings, setSettings] = useState({
    site_email: "",
    site_phone: "",
    site_address: "",
    site_logo: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState({ text: "", isError: false });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  // 3. سحب بيانات الإعدادات عند فتح الصفحة
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("https://propix8.com/api/settings");
        const result = await response.json();
        if (result.status) {
          setSettings(result.data);
        }
      } catch (error) {
        // console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    if (name === "name") {
      setErrors((prev) => ({
        ...prev,
        name: value.length < 3 ? "الاسم يجب أن يكون 3 أحرف على الأقل" : "",
      }));
    }

    if (name === "email") {
      if (value === "") {
        setErrors((prev) => ({ ...prev, email: "" }));
      } else if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "يرجى إدخال بريد إلكتروني صحيح",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    if (name === "phone") {
      setErrors((prev) => ({
        ...prev,
        phone: !validatePhone(value) ? "يرجى إدخال رقم هاتف صحيح" : "",
      }));
    }

    if (name === "message") {
      setErrors((prev) => ({
        ...prev,
        message:
          value.length < 10 ? "الرسالة يجب أن تكون 10 أحرف على الأقل" : "",
      }));
    }
  };

  const isFormValid =
    formData.name.length >= 3 &&
    validateEmail(formData.email) &&
    validatePhone(formData.phone) &&
    formData.message.length >= 10 &&
    formData.address &&
    !Object.values(errors).some((err) => err !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg({ text: "", isError: false });

    try {
      const response = await fetch("https://propix8.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          unit_id: "119",
          seller_id: "18",
        }),
      });

      const result = await response.json();

      if (response.ok && result.status) {
        setResponseMsg({
          text: result.message || "تم إرسال طلبك بنجاح",
          isError: false,
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
        });
      } else {
        let errorDescription = result.message;
        if (result.errors) {
          const details = Object.values(result.errors).flat().join(" | ");
          errorDescription = `${result.message}: ${details}`;
        }
        setResponseMsg({
          text: errorDescription || "يرجى مراجعة البيانات",
          isError: true,
        });
      }
    } catch (error) {
      setResponseMsg({
        text: "تعذر الاتصال بالسيرفر، يرجى التأكد من الإنترنت.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-cairo text-right" dir="rtl">
      {/* 1. Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-start gap-2 text-gray-400 text-sm">
        <Link
          to="/"
          className="hover:text-[#3E5879] transition-colors flex items-center gap-1 font-bold"
        >
          <Home size={14} /> الرئيسية
        </Link>
        <span className="text-gray-300 font-bold">›</span>
        <span className="text-[#3E5879] font-bold">تواصل معنا</span>
      </nav>

      {/* 2. Hero & Form Section */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-6  ">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[350px] md:h-[450px] w-full rounded-[0.5rem] overflow-hidden shadow-sm border border-gray-100"
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
            alt="Property"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* كارت الفورم - نازل تحت */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative md:absolute md:top-48 md:right-20 z-10 mt-[-60px] md:mt-0 px-4 md:px-0"
        >
          <div className="bg-[#f0f4f8]/95 backdrop-blur-sm p-8 rounded-[0.5rem] shadow-xl w-full md:w-[450px] text-center border border-white/50">
            <h2 className="text-2xl font-black text-[#3E5879] mb-2">
              نحن هنا لخدمتك
            </h2>
            <p className="text-[#3E5879] text-sm mb-8 font-bold opacity-80">
              يسعدنا تواصلك معنا والإجابة عن جميع استفساراتك.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="ادخل اسمك هنا"
                  className={`w-full bg-white border rounded-lg py-3 px-4 text-xs shadow-sm text-right placeholder-gray-400 outline-none transition-all ${
                    errors.name
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-none focus:ring-1 focus:ring-[#465E7E]"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className={`w-full bg-white border rounded-lg py-3 px-4 text-xs shadow-sm text-right placeholder-gray-400 outline-none transition-all ${
                    errors.email
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-none focus:ring-1 focus:ring-[#465E7E]"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">
                    {errors.email}
                  </p>
                )}
              </div>

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                type="text"
                placeholder="الموقع (مثلاً: القاهرة)"
                className="w-full bg-white border-none rounded-lg py-3 px-4 text-xs shadow-sm text-right placeholder-gray-400 outline-none focus:ring-1 focus:ring-[#465E7E]"
              />

              <div className="relative">
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  type="tel"
                  placeholder="رقم التليفون"
                  className={`w-full bg-white border rounded-lg py-3 px-4 text-xs shadow-sm text-right placeholder-gray-400 outline-none transition-all ${
                    errors.phone
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-none focus:ring-1 focus:ring-[#465E7E]"
                  }`}
                />

                {errors.phone && (
                  <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="رسالة"
                  rows="3"
                  className={`w-full bg-white border rounded-lg py-3 px-4 text-xs shadow-sm text-right placeholder-gray-400 resize-none outline-none transition-all ${
                    errors.message
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-none focus:ring-1 focus:ring-[#465E7E]"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                disabled={loading || !isFormValid}
                type="submit"
                className={`w-full py-3.5 rounded-lg font-bold transition-all shadow-md text-md flex items-center justify-center gap-2 ${
                  loading || !isFormValid
                    ? "bg-gray-400 cursor-not-allowed opacity-70"
                    : "bg-[#465E7E] text-white hover:bg-[#354862]"
                }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "أرسل رسالة"
                )}
              </button>

              {responseMsg.text && (
                <div
                  className={`mt-4 p-3 rounded-lg text-xs font-bold flex items-center gap-2 text-right ${
                    responseMsg.isError
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-green-50 text-green-600 border border-green-100"
                  }`}
                >
                  {responseMsg.isError ? (
                    <AlertCircle size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  <span>{responseMsg.text}</span>
                </div>
              )}
            </form>

            <div className="mt-8">
              <p className="text-[#3E5879] font-black text-sm mb-4">
                تنزيل التطبيق
              </p>
              <div className="flex justify-center gap-3">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-9 cursor-pointer"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-9 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Contact Info Section - مربوط بالـ API */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-20 flex justify-end">
        <div className="w-full md:w-1/2 flex flex-col items-end">
          <div className="flex flex-col items-start text-right space-y-8">
            <h2 className=" text-3xl font-black text-[#3E5879] mb-2 w-full">
              اتصل بنا
            </h2>

            {/* العنوان المستمد من API */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-start w-full group"
            >
              <div className="flex items-center gap-2 text-[#465E7E]">
                <MapPin size={22} strokeWidth={2.5} />
                <span className="text-xl font-black">عنوان</span>
              </div>
              <p className=" text-gray-600 text-[11px] font-bold mt-1 leading-tight uppercase">
                {settings.site_address || "جاري التحميل..."}
              </p>
            </motion.div>

            {/* الهاتف المستمد من API */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-start w-full group"
            >
              <div className="flex items-center gap-2 text-[#465E7E]">
                <Phone size={22} strokeWidth={2.5} />
                <span className="text-xl font-black font-cairo">
                  جهات الاتصال
                </span>
              </div>
              <p className="text-gray-600 text-[11px] font-bold mt-1" dir="ltr">
                {settings.site_phone || "جاري التحميل..."}
              </p>
            </motion.div>

            {/* البريد المستمد من API */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-start w-full group"
            >
              <div className="flex items-center gap-2 text-[#465E7E]">
                <Mail size={22} strokeWidth={2.5} />
                <span className="text-xl font-black">البريد الإلكتروني</span>
              </div>
              <p className="text-gray-600 text-[11px] font-bold mt-1 ">
                {settings.site_email || "جاري التحميل..."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
