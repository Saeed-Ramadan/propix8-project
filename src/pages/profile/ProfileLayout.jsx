import {
  User,
  Heart,
  Star,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  BookUser,
  Wrench,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileLayout() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const menuItems = [
    { name: "الحساب الشخصي", path: "user-profile", icon: <User size={20} /> },
    { name: "المفضلة", path: "favorites", icon: <Heart size={20} /> },
    { name: "الآراء", path: "reviews", icon: <Star size={20} /> },
    {
      name: "طلبات المعاينة",
      path: "user-booking",
      icon: <BookUser size={20} />,
    },
    {
      name: "طلبات الخدمات",
      path: "service-bookings",
      icon: <Wrench size={20} />,
    },
  ];

  // دالة المسح الشامل للبيانات
  const clearAllUserData = () => {
    localStorage.clear();
    sessionStorage.clear();
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  };

  // الدالة الفعلية التي تتصل بالـ API
  const proceedWithDelete = async (toastId) => {
    toast.dismiss(toastId); // إغلاق تنبيه التأكيد
    setIsDeleting(true);

    try {
      const response = await fetch("https://propix8.com/api/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.status) {
        toast.success("تم حذف الحساب بنجاح، جاري الخروج...");
        logout();
      } else {
        toast.error(result.message || "عذراً، فشلت عملية الحذف");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setIsDeleting(false);
    }
  };

  // دالة إظهار نافذة التأكيد باستخدام Toastify
  const confirmDeleteToast = () => {
    toast.warn(
      ({ closeToast }) => (
        <div className="text-right font-cairo">
          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <AlertTriangle size={20} />
            <span className="font-bold">تأكيد حذف الحساب</span>
          </div>
          <p className="text-xs text-gray-600 mb-4">
            هل أنت متأكد؟ سيتم مسح بياناتك نهائياً ولا يمكن استرجاعها.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => proceedWithDelete(null)} // نمرر null لأن التنبيه سيغلق تلقائياً أو عبر الـ ID
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
            >
              نعم، احذف
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
            >
              تراجع
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false, // لا يغلق تلقائياً ليختار المستخدم
        closeOnClick: false,
        draggable: false,
        icon: false,
      },
    );
  };

  return (
    <div
      className="min-h-screen bg-[#F8F9FA] py-8 md:py-12 px-4 font-cairo"
      dir="rtl"
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-80 shrink-0"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="flex flex-col">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-6 py-5 transition-all border-r-4 ${
                      isActive
                        ? "bg-[#3E5879] text-white border-[#3E5879]"
                        : "text-gray-500 border-transparent hover:bg-gray-50"
                    }`
                  }
                >
                  <div className="flex items-center gap-3 font-bold">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  <ChevronLeft size={16} className="opacity-50" />
                </NavLink>
              ))}

              <button
                onClick={confirmDeleteToast}
                disabled={isDeleting}
                className="flex items-center justify-center gap-3 px-6 py-6 text-red-500 hover:bg-red-50 font-bold border-t border-gray-50 transition-colors mt-4 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  "حذف الحساب"
                )}
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Dynamic Content Area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
