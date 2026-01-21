import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Eye, EyeOff, Lock, Camera } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileInfo() {
  const { token, userData, updateUser, refreshUser } = useAuth();
  const [cities, setCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // حالات الـ Popup
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
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
    fetchCities();
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city_id: userData.city?.id || "",
      }));
    } else if (token) {
      refreshUser();
    }
  }, [userData, token, refreshUser]);

  // Removed local fetchProfile in favor of AuthContext refreshUser

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

        updateUser(result.data);

        setIsEditModalOpen(false);
        refreshUser(); // تحديث البيانات من السيرفر لضمان المزامنة الكاملة
      } else {
        toast.error(result.message || "حدث خطأ أثناء التحديث");
      }
    } catch {
      toast.error("فشل الاتصال بالسيرفر");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userData && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="w-12 h-12 text-[#3E5879] animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#F8F9FA] min-h-[600px] p-4 md:p-8 font-cairo"
      dir="rtl"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto bg-white rounded-[1rem] p-6 md:p-10 shadow-sm border border-gray-100 ">
        <h2 className="text-xl font-black text-[#3E5879] mb-8 text-right border-r-4 border-[#3E5879] pr-3">
          الحساب الشخصي
        </h2>

        <div className="flex justify-center mb-10">
          <div
            onClick={() => setIsImagePreviewOpen(true)}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          >
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                className="w-full h-full object-cover"
                alt="User"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${userData?.name}&background=3E5879&color=fff&bold=true`}
                className="w-full h-full object-cover"
                alt="User"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ReadOnlyField label="الاسم بالكامل" value={userData?.name} />
          <ReadOnlyField label="البريد الإلكتروني" value={userData?.email} />
          <ReadOnlyField label="رقم الهاتف" value={userData?.phone} />
          <ReadOnlyField label="العنوان" value={userData?.address} />
          <ReadOnlyField
            label="نوع المستخدم"
            value={userData?.role === "seller" ? "بائع" : "مشتري"}
          />
          <ReadOnlyField label="المدينة" value={userData?.city?.name} />
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
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 mt-20">
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
                      ) : userData?.avatar ? (
                        <img
                          src={userData.avatar}
                          className="w-full h-full object-cover"
                          alt="User"
                        />
                      ) : (
                        <img
                          src={`https://ui-avatars.com/api/?name=${userData?.name}&background=3E5879&color=fff&bold=true`}
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
                      value={userData?.role === "seller" ? "بائع" : "مشتري"}
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

        {isImagePreviewOpen && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-zoom-out mt-20"
            onClick={() => setIsImagePreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsImagePreviewOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white hover:bg-white/20 rounded-full text-black transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X size={24} />
              </button>
              <img
                src={
                  userData?.avatar ||
                  `https://ui-avatars.com/api/?name=${userData?.name}&background=3E5879&color=fff&bold=true`
                }
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain border-4 border-white/20"
                alt="User Preview"
              />
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
