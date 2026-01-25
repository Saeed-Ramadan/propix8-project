import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  X,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  Wrench,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserServiceBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Modal states
  const [detailsModal, setDetailsModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    phone: "",
    address: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://propix8.com/api/maintenance/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const result = await response.json();
      if (result.status) {
        setBookings(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("فشل تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(
        `https://propix8.com/api/maintenance/bookings/${editModal.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        },
      );
      const result = await response.json();
      if (result.status || response.ok) {
        toast.success("تم تحديث الطلب بنجاح");
        setEditModal(null);
        fetchBookings();
      } else {
        toast.error(result.message || "فشل تحديث الطلب");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("فشل تحديث الطلب");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://propix8.com/api/maintenance/bookings/${deleteModal.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (response.ok && result.status) {
        toast.success("تم حذف الطلب بنجاح");
        setDeleteModal(null);
        fetchBookings();
      } else {
        // Show specific error message from API
        toast.error(result.message || "فشل حذف الطلب");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("فشل حذف الطلب");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "قيد المعالجة",
        color: "bg-yellow-100 text-yellow-700",
      },
      contacted: {
        label: "تم التواصل",
        color: "bg-[#53B17582] text-[#53B175]",
      },
      done: { label: "تمت", color: "bg-[#53B175] text-[#064f1f]" },
    };
    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  if (loading) {
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
      className="bg-[#F8F9FA] min-h-screen p-4 md:p-8 font-cairo"
      dir="rtl"
    >
      <ToastContainer position="top-right" autoClose={3000} rtl />

      <div className="max-w-6xl -mt-6 mx-auto">
        <h2 className="text-2xl font-black text-[#3E5879] mb-8 text-right border-r-4 border-[#3E5879] pr-3">
          طلبات حجز الخدمات
        </h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all", label: "الكل" },
            { key: "pending", label: "قيد المعالجة" },
            { key: "contacted", label: "تم التواصل" },
            { key: "done", label: "منتهي" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-[0.5rem] font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-[#3E5879] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[0.5rem] p-12 text-center shadow-sm">
            <Wrench size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-[#3E5879] mb-2">
              لا توجد طلبات
            </h3>
            <p className="text-gray-500">لم تقم بحجز أي خدمات بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[0.5rem] p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  {getStatusBadge(booking.status)}
                  <span className="text-sm text-gray-500 font-bold">
                    رقم الطلب {booking.id}
                  </span>
                </div>

                <div className="flex gap-4 mb-4">
                  <img
                    src={booking.service.image}
                    alt={booking.service.title}
                    className="w-20 h-20 rounded-[0.5rem] object-cover"
                  />
                  <div className="flex-1 text-right">
                    <h3 className="text-lg font-black text-[#3E5879] mb-2">
                      {booking.service.title}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center  gap-2">
                        <Phone size={14} />
                        <span className="font-bold">{booking.phone}</span>
                      </div>
                      <div className="flex items-center  gap-2">
                        <MapPin size={14} />
                        <span className="font-bold">{booking.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 text-gray-400 text-xs">
                  <span className="font-bold">
                    {new Date(booking.created_at).toLocaleDateString("ar-EG")}
                  </span>
                  <Calendar size={14} />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setDetailsModal(booking)}
                      className="px-2 py-2 bg-[#3E5879] text-white rounded-[0.5rem] font-bold text-sm hover:bg-[#2c3e56] transition-all flex items-center gap-2"
                    >
                      <Eye size={16} />
                      تفاصيل
                    </button>
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            setEditModal(booking);
                            setEditForm({
                              phone: booking.phone,
                              address: booking.address,
                              message: booking.message,
                            });
                          }}
                          className="px-2 py-2 bg-blue-500 text-white rounded-[0.5rem] font-bold text-sm hover:bg-blue-600 transition-all flex items-center gap-2"
                        >
                          <Edit size={16} />
                          تعديل
                        </button>
                        <button
                          onClick={() => setDeleteModal(booking)}
                          className="px-2 py-2 bg-[#E02F2F] text-white rounded-[0.5rem] font-bold text-sm hover:bg-red-600 transition-all flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          حذف
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {detailsModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[0.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]">
                <h3 className="text-lg font-black text-[#3E5879]">
                  تفاصيل الطلب
                </h3>
                <button
                  onClick={() => setDetailsModal(null)}
                  className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-4 items-start">
                  <img
                    src={detailsModal.service.image}
                    alt={detailsModal.service.title}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1 text-right">
                    <h4 className="text-xl font-black text-[#3E5879] mb-2">
                      {detailsModal.service.title}
                    </h4>
                    {getStatusBadge(detailsModal.status)}
                  </div>
                </div>
                <div className="space-y-3 text-right">
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-[#3E5879] mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold mb-1">
                        رقم الهاتف
                      </p>
                      <p className="font-bold text-gray-800">
                        {detailsModal.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#3E5879] mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold mb-1">
                        العنوان
                      </p>
                      <p className="font-bold text-gray-800">
                        {detailsModal.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare size={18} className="text-[#3E5879] mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold mb-1">
                        الرسالة
                      </p>
                      <p className="font-bold text-gray-800">
                        {detailsModal.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-[#3E5879] mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold mb-1">
                        تاريخ الطلب
                      </p>
                      <p className="font-bold text-gray-800">
                        {new Date(detailsModal.created_at).toLocaleString(
                          "ar-EG",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[0.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]">
                <h3 className="text-lg font-black text-[#3E5879]">
                  تعديل الطلب
                </h3>
                <button
                  onClick={() => setEditModal(null)}
                  className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEdit} className="p-6 space-y-4">
                <div className="text-right">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[0.5rem] outline-none text-right focus:border-[#3E5879] transition-all"
                    required
                  />
                </div>
                <div className="text-right">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[0.5rem] outline-none text-right focus:border-[#3E5879] transition-all"
                    required
                  />
                </div>
                <div className="text-right">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الرسالة
                  </label>
                  <textarea
                    value={editForm.message}
                    onChange={(e) =>
                      setEditForm({ ...editForm, message: e.target.value })
                    }
                    rows={4}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[0.5rem] outline-none text-right focus:border-[#3E5879] transition-all resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#3E5879] text-white font-bold py-3 rounded-[0.5rem] hover:bg-[#2c3e56] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التعديلات"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[0.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black text-[#3E5879] mb-2">
                  تأكيد الحذف
                </h3>
                <p className="text-gray-600 font-bold mb-6">
                  هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal(null)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-[0.5rem] font-bold hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-[0.5rem] font-bold hover:bg-red-600 transition-all"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
