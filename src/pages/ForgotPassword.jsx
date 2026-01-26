import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/toastConfig.js";
import signupImg from "../assets/main/signup.png";
import logo from "../assets/logo/main-logo.png";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value === "") {
      setError("");
    } else if (!validateEmail(value)) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
    } else {
      setError("");
    }
  };

  const isFormValid = email && validateEmail(email) && !error;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("email", email);

    try {
      const response = await fetch("https://propix8.com/api/forgot-password", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        // رسالة نجاح
        toast.success(
          result.message || "تم إرسال رمز استعادة كلمة المرور بنجاح!",
          toastOptions,
        );

        // التحقق من وجود التوكن في الرد
        const receivedToken = result.token || result.data?.token;

        if (receivedToken) {
          // التوجيه لصفحة الـ Reset Password بعد ثانية واحدة لإعطاء فرصة لرؤية الرسالة
          setTimeout(() => {
            navigate(`/password-reset/${receivedToken}?email=${email}`);
          }, 1500);
        } else {
          // إذا لم يرسل السيرفر التوكن، نطلب من المستخدم فحص بريده
          toast.info(
            "يرجى فحص بريدك الإلكتروني واتباع الرابط المرسل لاستعادة كلمة المرور.",
            toastOptions,
          );
        }
      } else {
        // رسالة خطأ توضح السبب القادم من السيرفر
        toast.error(
          result.message || "البريد الإلكتروني غير صحيح أو غير مسجل",
          toastOptions,
        );
      }
    } catch (error) {
      // console.error("Error:", error);
      toast.error(
        "حدث خطأ في الاتصال بالسيرفر، يرجى المحاولة لاحقاً",
        toastOptions,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex bg-[#ECEFF3] font-cairo overflow-hidden"
      dir="rtl"
    >
      <div className="hidden lg:block lg:w-1/2 h-full p-4">
        <div className="relative h-full w-full">
          <img
            src={signupImg}
            alt="Real Estate"
            className="w-full h-full object-cover rounded-[0.5rem] shadow-sm"
          />
          <div className="absolute inset-0 flex items-start justify-center pt-12">
            <img src={logo} alt="Logo" className="w-44 drop-shadow-md" />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-24">
        <div className="max-w-md w-full mx-auto text-center">
          <h2 className="text-[#3E5879] text-4xl font-bold mb-3">
            نسيت كلمة المرور؟
          </h2>
          <p className="text-gray-500 font-bold mb-10 text-lg">
            أدخل بريدك الإلكتروني للحصول على رابط الاستعادة
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                required
                placeholder="بريدك الإلكتروني"
                value={email}
                onChange={handleEmailChange}
                className={`w-full bg-white border-2 px-4 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-left transition-all ${
                  error
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-transparent"
                }`}
                dir="ltr"
              />
              {error && (
                <p className="text-red-500 text-[10px] font-bold mt-1 mr-1 animate-pulse text-right">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all shadow-lg flex justify-center items-center ${
                loading || !isFormValid
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[#3E5879] text-white hover:bg-[#2d415a]"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "إرسال طلب الاستعادة"
              )}
            </button>
          </form>

          <Link
            to="/signin"
            className="mt-8 inline-flex items-center gap-2 text-[#3E5879] font-bold hover:underline"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
