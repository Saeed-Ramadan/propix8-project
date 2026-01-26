import { useState, useEffect } from "react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import signupImg from "../assets/main/signup.png";
import logo from "../assets/logo/main-logo.png";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/toastConfig.js";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    return hasLetter;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
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
  };

  const isFormValid =
    validateEmail(formData.email) &&
    validatePassword(formData.password) &&
    !errors.email &&
    !errors.password;

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("siteSettings");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    try {
      const response = await fetch("https://propix8.com/api/login", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.data) {
        toast.success("تم تسجيل الدخول بنجاح!", toastOptions);
        login(result.data.access_token, result.data.user);

        const from = location.state?.from || "/";
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        toast.error(
          result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          toastOptions,
        );
      }
    } catch (error) {
      // console.error("📡 Network Error:", error);
      toast.error("حدث خطأ في الاتصال بالسيرفر", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex bg-[#ECEFF3] font-cairo overflow-hidden"
      dir="rtl"
    >
      {/* القسم الأيمن: الصورة واللوجو */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block lg:w-1/2 h-full p-4"
      >
        <div className="relative h-full w-full">
          <img
            src={signupImg}
            alt="Real Estate"
            className="w-full h-full object-cover rounded-[0.5rem] shadow-sm"
          />
          <div className="absolute inset-0 flex items-start justify-center pt-12">
            <img
              src={settings?.site_logo || logo}
              alt="Logo"
              className="w-44 h-auto drop-shadow-md block"
              style={{ minHeight: "50px" }} // احتياطاً لو الـ svg مضغوط
            />
          </div>
        </div>
      </motion.div>

      {/* القسم الأيسر: فورم تسجيل الدخول */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-24"
      >
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-right">
            <h2 className="text-[#3E5879] text-3xl font-black mb-2">
              تسجيل الدخول
            </h2>
            <p className="text-gray-500 font-bold">
              مرحباً بك مجدداً في {settings?.site_name || "برو بيكس"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* البريد الإلكتروني */}
            <div>
              <input
                name="email"
                type="email"
                required
                placeholder="بريدك الإلكتروني"
                onChange={handleChange}
                className={`w-full bg-white border-2 px-4 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-right transition-all ${
                  errors.email
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-transparent"
                }`}
                dir="rtl"
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-bold mt-1 mr-1 animate-pulse">
                  {errors.email}
                </p>
              )}
            </div>

            {/* كلمة المرور */}
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                required
                placeholder="كلمة المرور"
                onChange={handleChange}
                className={`w-full bg-white border-2 px-4 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-right transition-all ${
                  errors.password
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-transparent"
                }`}
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-4 top-5 text-gray-400 hover:text-[#3E5879]"
              >
                {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs font-bold mt-1 mr-1 animate-pulse">
                  {errors.password}
                </p>
              )}
            </div>

            {/* نسيت كلمة السر */}
            <div className="text-right px-1">
              <Link
                to="/forgot-password"
                className="text-[#3E5879] text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
              >
                نسيت كلمة السر؟
              </Link>
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all shadow-lg flex justify-center items-center gap-2 ${
                loading || !isFormValid
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[#3E5879] text-white hover:bg-[#2d415a] active:scale-95"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : "تسجيل الدخول"}
            </button>
          </form>

          {/* إنشاء حساب جديد */}
          <div className="text-center mt-10">
            <p className="text-gray-600 font-bold">
              ليس لديك حساب؟
              <Link
                to="/signup"
                className="text-[#3E5879] mr-2 hover:underline"
              >
                سجل الآن
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
