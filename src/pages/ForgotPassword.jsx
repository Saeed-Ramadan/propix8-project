import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // استيراد Toastify
import "react-toastify/dist/ReactToastify.css"; // استيراد التنسيقات
import signupImg from "../assets/main/signup.png";
import logo from "../assets/logo/main-logo.png";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

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
          {
            position: "top-right",
            autoClose: 3000,
          },
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
            {
              autoClose: 5000,
            },
          );
        }
      } else {
        // رسالة خطأ توضح السبب القادم من السيرفر
        toast.error(
          result.message || "البريد الإلكتروني غير صحيح أو غير مسجل",
          {
            position: "top-right",
          },
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ في الاتصال بالسيرفر، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex bg-[#ECEFF3] font-cairo overflow-hidden"
      dir="rtl"
    >
      {/* حاوية التنبيهات */}
      <ToastContainer />

      <div className="hidden lg:block lg:w-1/2 h-full p-4">
        <div className="relative h-full w-full">
          <img
            src={signupImg}
            alt="Real Estate"
            className="w-full h-full object-cover rounded-[2rem] shadow-sm"
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
            <input
              type="email"
              required
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-none px-4 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-left"
              dir="ltr"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3E5879] text-white py-4 rounded-xl font-bold text-xl hover:bg-[#2d415a] transition-all shadow-lg flex justify-center items-center"
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
