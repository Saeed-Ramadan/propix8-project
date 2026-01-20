import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Eye, EyeOff, Lock, Camera } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileInfo() {
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // حالات الـ Popup
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city_id: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchCities();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("https://propix8.com/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const result = await response.json();
      if (result.status) {
        setUser(result.data);
        // تحديث الـ localStorage بالبيانات الحقيقية القادمة من السيرفر لضمان المزامنة
        localStorage.setItem("userData", JSON.stringify(result.data));

        setFormData({
          name: result.data.name || "",
          phone: result.data.phone || "",
          address: result.data.address || "",
          city_id: result.data.city?.id || "",
          current_password: "",
          password: "",
          password_confirmation: "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch("https://propix8.com/api/cities");
      const result = await response.json();
      if (result.status) setCities(result.data);
    } catch (error) {
      console.error("Cities Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.current_password) {
      return toast.warning("يرجى إدخال كلمة المرور الحالية لحفظ التعديلات");
    }

    setSubmitting(true);
    const data = new FormData();
    data.append("_method", "PUT");
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("city_id", formData.city_id);
    data.append("current_password", formData.current_password);

    if (formData.password) {
      data.append("password", formData.password);
      data.append("password_confirmation", formData.password_confirmation);
    }

    if (selectedFile) {
      data.append("avatar", selectedFile);
    }

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("https://propix8.com/api/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: data,
      });

      const result = await response.json();
      if (result.status) {
        toast.success("تم تحديث البيانات بنجاح");

        // --- الجزء المسؤول عن التحديث في الموقع كله ---
        // نقوم بتحديث الـ localStorage بالبيانات الجديدة الراجعة من السيرفر
        localStorage.setItem("user", JSON.stringify(result.data));

        // إطلاق حدث (Custom Event) لتنبيه المكونات الأخرى (مثل الـ Header) بوجود تحديث
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("userUpdate"));

        setIsEditModalOpen(false);
        fetchProfile(); // إعادة جلب البيانات لتحديث واجهة البروفايل الحالية
      } else {
        toast.error(result.message || "حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      toast.error("فشل الاتصال بالسيرفر");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#3E5879]" size={40} />
      </div>
    );

  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.name}&background=3E5879&color=fff&bold=true`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#F8F9FA] min-h-[600px] p-4 md:p-8 font-cairo"
      dir="rtl"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-[#3E5879] mb-8 text-right border-r-4 border-[#3E5879] pr-3">
          الحساب الشخصي
        </h2>

        <div className="flex justify-center mb-10">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                className="w-full h-full object-cover"
                alt="User"
              />
            ) : (
              <img
                src={defaultAvatar}
                className="w-full h-full object-cover"
                alt="User"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ReadOnlyField label="الاسم بالكامل" value={user?.name} />
          <ReadOnlyField label="البريد الإلكتروني" value={user?.email} />
          <ReadOnlyField label="رقم الهاتف" value={user?.phone} />
          <ReadOnlyField label="العنوان" value={user?.address} />
          <ReadOnlyField
            label="نوع المستخدم"
            value={user?.role === "seller" ? "بائع" : "مشتري"}
          />
          <ReadOnlyField label="المدينة" value={user?.city?.name} />
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="w-full md:w-64 mt-10 mx-auto block bg-[#3E5879] text-white font-bold py-3.5 rounded-xl hover:bg-[#2c3e56] transition-all shadow-md active:scale-95"
        >
          تعديل البيانات
        </button>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-lg rounded-[1rem] shadow-2xl relative overflow-hidden"
            >
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#F8F9FA]">
                <h3 className="text-lg font-black text-[#3E5879]">
                  تعديل البيانات الشخصية
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-3 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-center mb-6 relative">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      {selectedFile ? (
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          className="w-full h-full object-cover"
                          alt="User"
                        />
                      ) : user?.avatar ? (
                        <img
                          src={user.avatar}
                          className="w-full h-full object-cover"
                          alt="User"
                        />
                      ) : (
                        <img
                          src={defaultAvatar}
                          className="w-full h-full object-cover"
                          alt="User"
                        />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#3E5879] p-1.5 rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-sm">
                      <Camera size={14} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="الاسم بالكامل"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <InputField
                    label="رقم الهاتف"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                  />
                  <InputField
                    label="العنوان"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />

                  <div className="grid grid-cols-1 gap-4 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
                    <PasswordField
                      label="كلمة المرور الحالية (مطلوب للحفظ)"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleInputChange}
                      show={showCurrentPassword}
                      toggle={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      required
                    />
                    <div className="h-[1px] bg-gray-200 w-full my-1"></div>
                    <PasswordField
                      label="كلمة المرور الجديدة"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      show={showNewPassword}
                      toggle={() => setShowNewPassword(!showNewPassword)}
                    />
                    <PasswordField
                      label="تأكيد كلمة المرور الجديدة"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      show={showConfirmPassword}
                      toggle={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      isConfirm
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-right">
                      <label className="text-[11px] font-bold text-gray-500 pr-1">
                        المدينة
                      </label>
                      <select
                        name="city_id"
                        value={formData.city_id}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg outline-none text-right text-xs appearance-none cursor-pointer"
                      >
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <SelectField
                      label="نوع المستخدم"
                      value={user?.role === "seller" ? "بائع" : "مشتري"}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#3E5879] text-white font-black py-3 rounded-xl mt-4 shadow-lg hover:brightness-110 transition-all flex justify-center items-center"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      "حفظ"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// مكونات مساعدة
function ReadOnlyField({ label, value }) {
  return (
    <div className="space-y-1.5 text-right">
      <label className="block text-gray-400 text-xs font-bold pr-1">
        {label}
      </label>
      <div className="w-full p-3.5 bg-[#F4F6F8] rounded-xl border border-gray-50 text-[#3E5879] font-bold text-sm shadow-sm">
        {value || "---"}
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="space-y-1 text-right w-full">
      <label className="text-[11px] font-bold text-gray-500 pr-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg outline-none text-right placeholder-gray-300 text-xs focus:border-[#3E5879] transition-all"
      />
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  toggle,
  isConfirm = false,
  required = false,
}) {
  return (
    <div className="space-y-1 text-right">
      <label className="text-[11px] font-bold text-gray-500 pr-1">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? "text" : "password"}
          placeholder={isConfirm ? "تأكيد كلمة المرور" : ""}
          className={`w-full p-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg outline-none text-right text-xs pr-${isConfirm ? "9" : "3"}`}
        />
        {isConfirm && (
          <Lock
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
            size={14}
          />
        )}
        <button
          type="button"
          onClick={toggle}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function SelectField({ label, value }) {
  return (
    <div className="space-y-1 text-right">
      <label className="text-[11px] font-bold text-gray-500 pr-1">
        {label}
      </label>
      <select
        disabled
        className="w-full p-2.5 bg-[#F4F6F8] border border-gray-200 rounded-lg outline-none text-right text-xs appearance-none opacity-70"
      >
        <option>{value}</option>
      </select>
    </div>
  );
}
