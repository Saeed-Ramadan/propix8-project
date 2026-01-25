import React, { useState, useEffect } from "react";
import {
  Star,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserReviews() {
  const { token, userData } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const [reviews, setReviews] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    rating: 5,
    comment: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // تعريف الدالة خارج useEffect وتغليفها بـ useCallback
  const fetchData = React.useCallback(
    async (page = 1) => {
      setLoading(true);
      const endpoint =
        activeTab === "properties"
          ? `https://propix8.com/api/reviews?page=${page}`
          : `https://propix8.com/api/my-testimonials?page=${page}`;

      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const result = await response.json();
        if (result.status) {
          if (activeTab === "properties") {
            setReviews(result.data);
          } else {
            setTestimonials(result.data);
          }
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [activeTab],
  ); // fetchData يعتمد على activeTab

  useEffect(() => {
    fetchData(pagination.current_page);
  }, [fetchData, pagination.current_page]); // إضافة fetchData كـ dependency

  const executeDelete = async (id, type) => {
    const endpoint =
      type === "properties"
        ? `https://propix8.com/api/reviews/${id}`
        : `https://propix8.com/api/testimonials/${id}`;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const result = await response.json();

      if (response.ok || result.status) {
        toast.success("تم الحذف بنجاح");
        if (type === "properties") {
          setReviews((prev) => prev.filter((item) => item.id !== id));
        } else {
          setTestimonials((prev) => prev.filter((item) => item.id !== id));
        }
      } else {
        toast.error(result.message || "فشل عملية الحذف");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    }
  };

  const confirmDelete = (id, type) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="text-right font-cairo">
          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <AlertTriangle size={18} />
            <span className="font-bold text-sm">تأكيد الحذف</span>
          </div>
          <p className="text-[11px] text-gray-600 mb-4">
            هل أنت متأكد من حذف هذا العنصر نهائياً؟
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                executeDelete(id, type);
                closeToast();
              }}
              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-600 transition-colors"
            >
              نعم، احذف
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors"
            >
              تراجع
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        icon: false,
      },
    );
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    if (activeTab === "properties") {
      setEditFormData({ rating: Number(item.rating), comment: item.comment });
    } else {
      setEditFormData({ content: item.content });
    }
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const endpoint =
      activeTab === "properties"
        ? `https://propix8.com/api/reviews/${editingItem.id}`
        : `https://propix8.com/api/testimonials/${editingItem.id}`;

    const bodyData =
      activeTab === "properties"
        ? {
            _method: "PUT",
            rating: Number(editFormData.rating),
            comment: editFormData.comment,
          }
        : { _method: "PUT", content: editFormData.content };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      const result = await response.json();

      if (response.ok || result.status) {
        toast.success("تم التحديث بنجاح");
        if (activeTab === "properties") {
          setReviews((prev) =>
            prev.map((rev) =>
              rev.id === editingItem.id ? { ...rev, ...editFormData } : rev,
            ),
          );
        } else {
          setTestimonials((prev) =>
            prev.map((tes) =>
              tes.id === editingItem.id ? { ...tes, ...editFormData } : tes,
            ),
          );
        }
        setIsEditModalOpen(false);
      } else {
        toast.error(result.message || "فشل التحديث");
      }
    } catch (error) {
      toast.error("خطأ في الشبكة");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  return (
    <div
      className="bg-white rounded-[0.5rem] p-6 md:p-10 shadow-sm border border-gray-100 font-cairo"
      dir="rtl"
    >
      <ToastContainer position="top-right" autoClose={3000} rtl={true} />

      <h2 className="text-xl font-black text-[#3E5879] mb-8 text-right border-r-4 border-[#3E5879] pr-3">
        الآراء والتقييمات
      </h2>

      <div className="flex items-center gap-8 border-b border-gray-100 mb-8 pb-1">
        <button
          onClick={() => {
            setActiveTab("properties");
            setPagination({ current_page: 1, last_page: 1 });
          }}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === "properties" ? "text-[#3E5879]" : "text-gray-400"}`}
        >
          آراء خاصة بالعقارات
          {activeTab === "properties" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 right-0 w-full h-0.5 bg-[#3E5879] rounded-[0.5rem]"
            />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("site");
            setPagination({ current_page: 1, last_page: 1 });
          }}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === "site" ? "text-[#3E5879]" : "text-gray-400"}`}
        >
          آراء خاصة بالموقع
          {activeTab === "site" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 right-0 w-full h-0.5 bg-[#3E5879] rounded-[0.5rem]"
            />
          )}
        </button>
      </div>

      <div className="space-y-4 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#3E5879]" size={40} />
          </div>
        ) : (
          <>
            {activeTab === "properties" &&
              reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-50 hover:shadow-md transition-all relative group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-black text-[#3E5879] text-base">
                        {userData?.name || review.user?.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold mb-2">
                        وحدة: {review.unit?.title}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-gray-400 text-[10px] font-bold">
                        {formatDate(review.created_at)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(review)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => confirmDelete(review.id, "properties")}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">
                    {review.comment}
                  </p>
                </motion.div>
              ))}

            {activeTab === "site" &&
              testimonials.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#F8F9FA] rounded-[0.5rem] p-6 border border-gray-50 hover:shadow-md transition-all relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 overflow-hidden">
                        {userData?.avatar ? (
                          <img
                            src={userData.avatar}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <img
                            src={`https://ui-avatars.com/api/?name=${userData?.name}&background=3E5879&color=fff&bold=true`}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-[#3E5879] text-sm">
                          {userData?.name || item.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-gray-400 text-[10px] font-bold">
                        {formatDate(item.created_at)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => confirmDelete(item.id, "site")}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium italic border-r-2 border-gray-200 pr-3">
                    {item.content}
                  </p>
                </motion.div>
              ))}

            {((activeTab === "properties" && reviews.length === 0) ||
              (activeTab === "site" && testimonials.length === 0)) && (
              <div className="py-20 text-center text-gray-400 font-bold">
                لا توجد بيانات حالياً في هذا القسم
              </div>
            )}

            {pagination.last_page > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      current_page: prev.current_page - 1,
                    }))
                  }
                  className="p-2 rounded-[0.5rem] hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronRight size={20} className="text-[#3E5879]" />
                </button>
                <span className="text-sm font-bold text-[#3E5879]">
                  صفحة {pagination.current_page} من {pagination.last_page}
                </span>
                <button
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      current_page: prev.current_page + 1,
                    }))
                  }
                  className="p-2 rounded-[0.5rem] hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronLeft size={20} className="text-[#3E5879]" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-md rounded-[0.5rem] shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6 font-bold">
                <h3 className="text-[#3E5879]">
                  تعديل {activeTab === "properties" ? "التقييم" : "الرأي"}
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                {/* ... same form content ... */}
                {activeTab === "properties" ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500">
                        التقييم
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() =>
                              setEditFormData({ ...editFormData, rating: num })
                            }
                          >
                            <Star
                              size={24}
                              className={
                                num <= editFormData.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-200"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500">
                        التعليق
                      </label>
                      <textarea
                        value={editFormData.comment}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            comment: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-[0.5rem] outline-none text-xs min-h-[100px] focus:border-[#3E5879]"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500">
                        المحتوى
                      </label>
                      <textarea
                        value={editFormData.content}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            content: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-[0.5rem] outline-none text-xs min-h-[100px] focus:border-[#3E5879]"
                        required
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#3E5879] text-white py-3 rounded-[0.5rem] font-bold text-sm flex justify-center items-center gap-2 disabled:bg-gray-300"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "حفظ التغييرات"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserReviews;
