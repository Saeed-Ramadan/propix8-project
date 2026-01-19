import { useState, useEffect } from 'react';
import { EyeOff, Eye, Loader2, Lock } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import signupImg from '../assets/main/signup.png';
import logo from '../assets/logo/main-logo.png';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // سحب التوكن من رابط الصفحة
  const [searchParams] = useSearchParams(); // سحب الإيميل من بعد علامة ? في الرابط
  const emailFromUrl = searchParams.get('email') || "";

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    token: token || "",
    email: emailFromUrl,
    password: '',
    password_confirmation: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('token', formData.token);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('password_confirmation', formData.password_confirmation);

    try {
      const response = await fetch('https://propix8.com/api/reset-password', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ تم تغيير كلمة المرور بنجاح!");
        setTimeout(() => navigate('/signin'), 2000);
      } else {
        toast.error(result.message || "فشل التحديث، ربما انتهت صلاحية الرابط");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#ECEFF3] font-cairo overflow-hidden" dir="rtl">
      <ToastContainer />

      <div className="hidden lg:block lg:w-1/2 h-full p-4">
        <div className="relative h-full w-full">
          <img src={signupImg} className="w-full h-full object-cover rounded-[2.5rem]" alt="reset" />
          <div className="absolute inset-0 flex items-start justify-center pt-12">
            <img src={logo} alt="Logo" className="w-44" />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-right">
            <h2 className="text-[#3E5879] text-3xl font-black mb-2">تعيين كلمة مرور جديدة</h2>
            <p className="text-gray-500 font-bold">أنت الآن تقوم بتغيير كلمة المرور لـ: <br/>
            <span className="text-[#3E5879] font-inter">{formData.email}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                name="password" type={showPass ? "text" : "password"} required placeholder="كلمة المرور الجديدة"
                onChange={handleChange}
                className="w-full bg-white border-none px-4 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-left" dir="ltr"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                name="password_confirmation" type={showPass ? "text" : "password"} required placeholder="تأكيد كلمة المرور"
                onChange={handleChange}
                className="w-full bg-white border-none px-4 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-left" dir="ltr"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#3E5879] text-white py-4 rounded-xl font-bold text-xl hover:bg-[#2d415a] transition-all shadow-lg flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "تحديث كلمة المرور"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}