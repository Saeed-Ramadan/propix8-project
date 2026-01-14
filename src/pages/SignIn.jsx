import { useState } from 'react';
import { EyeOff, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import signupImg from '../assets/main/signup.png';
import logo from '../assets/logo/main-logo.png';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);

    try {
      const response = await fetch('https://propix8.com/api/login', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.data) {
  localStorage.setItem('userToken', result.data.access_token);
  // تأكد إنك بتعمل stringify قبل الحفظ
  localStorage.setItem('userData', JSON.stringify(result.data.user)); 
  
  window.location.href = '/'; 
} else {
        alert(result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (error) {
      console.error("📡 Network Error:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#ECEFF3] font-cairo overflow-hidden" dir="rtl">
      
      {/* القسم الأيمن: الصورة واللوجو */}
      <div className="hidden lg:block lg:w-1/2 h-full p-4">
        <div className="relative h-full w-full">
          <img 
            src={signupImg} 
            alt="Real Estate" 
            className="w-full h-full object-cover rounded-[2.5rem] shadow-sm" 
          />
          <div className="absolute inset-0 flex items-start justify-center pt-12">
            <img src={logo} alt="Logo" className="w-44 drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* القسم الأيسر: فورم تسجيل الدخول */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-24" >
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-right">
            <h2 className="text-[#3E5879] text-3xl font-black mb-2">تسجيل الدخول</h2>
            <p className="text-gray-500 font-bold">مرحباً بك مجدداً في برو بيكس</p>
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
                className="w-full bg-white border-none px-4 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-right" 
                dir="rtl"
              />
            </div>

            {/* كلمة المرور */}
            <div className="relative">
              <input 
                name="password" 
                type={showPass ? "text" : "password"} 
                required 
                placeholder="كلمة المرور" 
                onChange={handleChange}
                className="w-full bg-white border-none px-4 py-4 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3E5879] outline-none font-inter text-right" 
                dir="rtl"
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3E5879]"
              >
                {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
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
              disabled={loading}
              className="w-full bg-[#3E5879] text-white py-4 rounded-xl font-bold text-xl hover:bg-[#2d415a] transition-all shadow-lg flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "تسجيل الدخول"}
            </button>
          </form>

          {/* إنشاء حساب جديد */}
          <div className="text-center mt-10">
            <p className="text-gray-600 font-bold">
              ليس لديك حساب؟ 
              <Link to="/signup" className="text-[#3E5879] mr-2 hover:underline">سجل الآن</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}