import { useState, useEffect } from "react";
import { EyeOff, Eye, ChevronDown, Loader2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signupImg from "../assets/main/signup.png";
import logo from "../assets/logo/main-logo.png";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "seller", // تم التثبيت على seller دائماً
    address: "",
    city_id: "",
    agreeTerms: false,
  });

  const [cities, setCities] = useState([]); // قائمة المدن
  const [idPhoto, setIdPhoto] = useState(null); // ملف صورة البطاقة
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. جلب المدن من الـ API عند فتح الصفحة
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://propix8.com/api/cities");
        const result = await response.json();
        if (result.status) {
          setCities(result.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setIdPhoto(files[0]); // حفظ الملف في state منفصل
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين!");
      return false;
    }
    if (!formData.city_id) {
      toast.error("يرجى اختيار المدينة");
      return false;
    }
    if (!formData.agreeTerms) {
      toast.error("يجب الموافقة على الشروط والأحكام أولاً");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    data.append("password_confirmation", formData.confirmPassword);
    data.append("role", formData.userType); // الحقل المطلوب في الـ API
    data.append("address", formData.address);
    data.append("city_id", formData.city_id);

    try {
      const response = await fetch("https://propix8.com/api/register", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("تم إنشاء الحساب بنجاح!");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        toast.error(result.message || "فشلت العملية، تأكد من البيانات");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex bg-[#ECEFF3] font-cairo overflow-hidden"
      dir="rtl"
    >
      <ToastContainer position="top-center" autoClose={3000} />
      {/* القسم الأيمن (الصورة) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block lg:w-1/2 h-full relative"
      >
        <img
          src={signupImg}
          alt="Real Estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1e2d4a]/20 flex items-start justify-center pt-16">
          <img src={logo} alt="Logo" className="w-48 drop-shadow-md" />
        </div>
      </motion.div>

      {/* القسم الأيسر (الفورم) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 h-screen flex flex-col justify-center px-8 md:px-24 bg-[#f8f9fa] overflow-y-auto"
      >
        <div className="max-w-md w-full mx-auto py-10">
          <h2 className="text-[#3E5879] text-3xl font-bold text-center mb-8">
            إنشاء حساب جديد
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              required
              placeholder="الاسم الكامل"
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                name="email"
                type="email"
                required
                placeholder="البريد الإلكتروني"
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-sm"
              />
              <input
                name="phone"
                type="text"
                required
                placeholder="رقم الهاتف"
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-sm"
              />
            </div>

            {/* قائمة المدن من الـ API */}
            <div className="relative">
              <select
                name="city_id"
                required
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg appearance-none outline-none text-gray-500 shadow-sm"
              >
                <option value="">اختر المدينة</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>

            <input
              name="address"
              type="text"
              required
              placeholder="العنوان بالتفصيل"
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="كلمة المرور"
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-3 text-gray-400"
                >
                  {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  required
                  placeholder="تأكيد الكلمة"
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute left-3 top-3 text-gray-400"
                >
                  {showConfirmPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                required
                onChange={handleChange}
                className="w-4 h-4 accent-[#3E5879] cursor-pointer"
              />
              <label
                htmlFor="agreeTerms"
                className="cursor-pointer select-none"
              >
                أوافق على
                <Link
                  to="/terms"
                  className="text-[#3E5879] font-bold mx-1 underline hover:text-[#2c3d55]"
                >
                  الشروط والأحكام
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3E5879] text-white py-3.5 rounded-lg font-bold text-xl hover:bg-[#2c3d55] transition-all flex justify-center items-center shadow-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "إنشاء حساب"}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟
                <Link
                  to="/signin"
                  className="text-[#3E5879] font-bold mx-1 hover:underline transition-all"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
