import { useState, useEffect } from "react";
import { EyeOff, Eye, Loader2, Lock } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/toastConfig.js";
import signupImg from "../assets/main/signup.png";
import logo from "../assets/logo/main-logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formData, setFormData] = useState({
    token: token || "",
    email: emailFromUrl,
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    password_confirmation: "",
  });

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

  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    return hasLetter;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
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

    if (name === "password_confirmation") {
      setErrors((prev) => ({
        ...prev,
        password_confirmation:
          value !== formData.password ? "كلمتا المرور غير متطابقتين" : "",
      }));
    }
  };

  const isFormValid =
    formData.password &&
    validatePassword(formData.password) &&
    formData.password === formData.password_confirmation &&
    !errors.password &&
    !errors.password_confirmation;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("token", formData.token);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("password_confirmation", formData.password_confirmation);

    try {
      const response = await fetch("https://propix8.com/api/reset-password", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("تم تغيير كلمة المرور بنجاح!", toastOptions);
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        toast.error(
          result.message || "فشل التحديث، ربما انتهت صلاحية الرابط",
          toastOptions,
        );
      }
    } catch {
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
      <div className="hidden lg:block lg:w-1/2 h-full p-4">
        <div className="relative h-full w-full">
          <img
            src={signupImg}
            className="w-full h-full object-cover rounded-[0.5rem]"
            alt="reset"
          />
          <div className="absolute inset-0 flex items-start justify-center pt-12">
            <img
              src={settings?.site_logo || logo}
              alt="Logo"
              className="w-44"
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-right">
            <h2 className="text-[#3E5879] text-3xl font-black mb-2">
              تعيين كلمة مرور جديدة
            </h2>
            <p className="text-gray-500 font-bold mb-6">
              أدخل كلمة المرور الجديدة وتأكيدها
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                name="email"
                type="email"
                required
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                readOnly={emailFromUrl}
                className={`w-full border-none px-10 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-left ${
                  emailFromUrl
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-white"
                }`}
                dir="ltr"
              />
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                required
                placeholder="كلمة المرور الجديدة"
                onChange={handleChange}
                className={`w-full bg-white border-2 px-10 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-left transition-all ${
                  errors.password
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-transparent"
                }`}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-[10px] font-bold mt-1 mr-1 animate-pulse">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                name="password_confirmation"
                type={showConfirmPass ? "text" : "password"}
                required
                placeholder="تأكيد كلمة المرور"
                onChange={handleChange}
                className={`w-full bg-white border-2 px-10 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-left transition-all ${
                  errors.password_confirmation
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-transparent"
                }`}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPass ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              {errors.password_confirmation && (
                <p className="text-red-500 text-[10px] font-bold mt-1 mr-1 animate-pulse">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all shadow-lg flex justify-center items-center gap-2 ${
                loading || !isFormValid
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[#3E5879] text-white hover:bg-[#2d415a]"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "تحديث كلمة المرور"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
