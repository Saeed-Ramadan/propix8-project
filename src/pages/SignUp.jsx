import { useState, useEffect } from "react";
import { EyeOff, Eye, ChevronDown, Loader2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/toastConfig.js";
import { useAuth } from "../hooks/useAuth.js";
import signupImg from "../assets/main/signup.png";
import logo from "../assets/logo/main-logo.png";

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "buyer",
    address: "",
    city_id: "",
    agreeTerms: false,
  });

  const [cities, setCities] = useState([]); // قائمة المدن
  const [idPhoto, setIdPhoto] = useState(null); // ملف صورة البطاقة
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    return hasLetter;
  };

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("siteSettings");
    return saved ? JSON.parse(saved) : null;
  });

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
        // console.error("Error fetching cities:", error);
      }
    };
    fetchCities();

    const fetchSettings = async () => {
      try {
        const response = await fetch("https://propix8.com/api/settings");
        const result = await response.json();
        if (result.status) {
          setSettings(result.data);
          localStorage.setItem("siteSettings", JSON.stringify(result.data));
        }
      } catch (error) {
        // console.error("Error fetching settings:", error);
      }
    };
    if (!settings) fetchSettings();
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setIdPhoto(files[0]); // حفظ الملف في state منفصل
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

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
        const phoneRegex = /^[0-9]{10,15}$/;
        setErrors((prev) => ({
          ...prev,
          phone: !phoneRegex.test(value) ? "يرجى إدخال رقم هاتف صحيح" : "",
        }));
      }

      if (name === "password") {
        if (value === "") {
          setErrors((prev) => ({ ...prev, password: "" }));
        } else if (!validatePassword(value)) {
          setErrors((prev) => ({
            ...prev,
            password: "يجب أن تحتوي كلمة المرور على حرف واحد على الأقل",
          }));
        } else {
          setErrors((prev) => ({ ...prev, password: "" }));
        }
      }

      if (name === "confirmPassword") {
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            value !== formData.password ? "كلمتا المرور غير متطابقتين" : "",
        }));
      }
    }
  };

  const isFormValid =
    formData.name.length >= 3 &&
    validateEmail(formData.email) &&
    /^[0-9]{10,15}$/.test(formData.phone) &&
    validatePassword(formData.password) &&
    formData.password === formData.confirmPassword &&
    formData.city_id &&
    formData.agreeTerms &&
    !Object.values(errors).some((err) => err !== "");

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين!", toastOptions);
      return false;
    }
    if (!formData.city_id) {
      toast.error("يرجى اختيار المدينة", toastOptions);
      return false;
    }
    if (!formData.agreeTerms) {
      toast.error("يجب الموافقة على الشروط والأحكام أولاً", toastOptions);
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
        toast.success("تم إنشاء الحساب بنجاح!", toastOptions);
        const from = result.data?.access_token ? "/" : "/signin";
        setTimeout(() => {
          if (result.data?.access_token) {
            login(result.data.access_token, result.data.user);
          }
          navigate(from);
        }, 2000);
      } else {
        setLoading(false);
        if (result.errors) {
          Object.values(result.errors).forEach((err) => {
            toast.error(err[0], toastOptions);
          });
        } else {
          toast.error(
            result.message || "فشلت العملية، تأكد من البيانات",
            toastOptions,
          );
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error("حدث خطأ في الاتصال بالسيرفر", toastOptions);
    }
  };

  return (
    <div
      className="h-screen w-full flex bg-[#ECEFF3] font-cairo overflow-hidden"
      dir="rtl"
    >
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
          <img
            src={settings?.site_logo || logo}
            alt="Logo"
            className="w-48 drop-shadow-md"
          />
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
            <div>
              <input
                name="name"
                type="text"
                required
                placeholder="الاسم الكامل"
                onChange={handleChange}
                className={`w-full bg-white border px-4 py-3 rounded-lg outline-none shadow-sm transition-all ${
                  errors.name
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="البريد الإلكتروني"
                  onChange={handleChange}
                  className={`w-full bg-white border px-4 py-3 rounded-lg outline-none shadow-sm transition-all ${
                    errors.email
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <input
                  name="phone"
                  type="text"
                  required
                  placeholder="رقم الهاتف"
                  onChange={handleChange}
                  className={`w-full bg-white border px-4 py-3 rounded-lg outline-none shadow-sm transition-all ${
                    errors.phone
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">
                    {errors.phone}
                  </p>
                )}
              </div>
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
                  className={`w-full bg-white border px-4 py-3 rounded-lg outline-none shadow-sm transition-all ${
                    errors.password
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-3 text-gray-400"
                >
                  {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  required
                  placeholder="تأكيد الكلمة"
                  onChange={handleChange}
                  className={`w-full bg-white border px-4 py-3 rounded-lg outline-none shadow-sm transition-all ${
                    errors.confirmPassword
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute left-3 top-3 text-gray-400"
                >
                  {showConfirmPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">
                    {errors.confirmPassword}
                  </p>
                )}
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
              disabled={loading || !isFormValid}
              className={`w-full py-3.5 rounded-lg font-bold text-xl transition-all flex justify-center items-center shadow-lg ${
                loading || !isFormValid
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[#3E5879] text-white hover:bg-[#2c3d55]"
              }`}
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
