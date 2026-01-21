import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  XCircle,
  Loader2,
  X,
  User,
  Phone,
  Mail,
  FileText,
  MessageSquare,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

function UserBookingMessage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals states
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    user_message: "",
  });

  const { token: userToken } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const fetchBookings = async () => {
    try {
      const response = await axios.get("https://propix8.com/api/bookings", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.status) {
        setBookings(response.data.data);
      }
    } catch (err) {
      setError("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userToken]);

  const handleOpenReschedule = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      date: booking.date || "",
      time: booking.time || "",
      user_message: booking.user_message || "",
    });
    setIsRescheduleModalOpen(true);
  };

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsRescheduleModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
    setFormData({ date: "", time: "", user_message: "" });
  };

  const handleCancelBooking = (id) => {
    const confirmToast = toast.info(
      <div className="flex flex-col gap-3 p-1 text-right" dir="rtl">
        <p className="font-black text-sm text-gray-700">
          هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              executeCancel(id);
              toast.dismiss(confirmToast);
            }}
            className="bg-red-500 text-white px-4 py-1.5 rounded-[0.3rem] text-xs font-black"
          >
            تأكيد الإلغاء
          </button>
          <button
            onClick={() => toast.dismiss(confirmToast)}
            className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-[0.3rem] text-xs font-black"
          >
            تراجع
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      },
    );
  };

  const executeCancel = async (id) => {
    try {
      const response = await axios.post(
        `https://propix8.com/api/bookings/${id}`,
        { _method: "DELETE" },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            Accept: "application/json",
          },
        },
      );

      if (response.data.status) {
        toast.success(response.data.message || "تم إلغاء الحجز بنجاح");
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل إلغاء الحجز");
    }
  };

  const handleSubmitReschedule = async () => {
    if (!formData.date || !formData.time) {
      toast.error("يرجى اختيار التاريخ والوقت");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `https://propix8.com/api/bookings/${selectedBooking.id}`,
        {
          date: formData.date,
          time: formData.time,
          user_message: formData.user_message,
          _method: "PUT",
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            Accept: "application/json",
          },
        },
      );

      if (response.data.status) {
        toast.success(response.data.message || "تم تحديث طلب المعاينة بنجاح");
        handleCloseModals();
        fetchBookings();
      }
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && serverErrors.date) {
        toast.error("يجب أن يكون التاريخ اليوم أو بعده");
      } else {
        toast.error(err.response?.data?.message || "فشل إرسال الموعد");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "accepted":
        return { text: "تم التأكيد", color: "bg-[#E7F3ED] text-[#53B17566]" };
      case "rejected":
        return { text: "ملغية", color: "bg-[#FEE2E2] text-[#E02F2F66]" };
      case "reschedule_admin":
      case "pending":
        return { text: "قيد المعالجة", color: "bg-[#FFF9E5] text-[#F7B23B]" };
      default:
        return { text: "تحت المراجعة", color: "bg-gray-100 text-gray-600" };
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-[#3E5879]" size={40} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 font-cairo" dir="rtl">
      <ToastContainer position="top-center" rtl />

      <div className="space-y-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const status = getStatusDetails(booking.status);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white border border-gray-100 rounded-[1rem] -mt-4 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[#3E5879] font-black tracking-wider">
                    رقم الطلب:{" "}
                    <span className="text-gray-400">#{booking.id}</span>
                  </span>
                  <div
                    className={`px-4 py-1.5 rounded-[0.5rem] text-sm font-black ${status.color}`}
                  >
                    {status.text}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-black text-gray-800 mb-2">
                    {booking.unit?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                    <MapPin size={16} className="text-[#3E5879]" />
                    <span>
                      {booking.unit?.city?.name} -{" "}
                      {booking.unit?.compound?.name}
                    </span>
                  </div>
                  {booking.notes && (
                    <div className="mt-3 flex items-start gap-2 text-gray-500 text-sm bg-gray-50 p-2 rounded">
                      <FileText size={16} className="mt-0.5 text-[#3E5879]" />
                      <p className="font-bold">
                        رسالتك:{" "}
                        <span className="font-medium">{booking.notes}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-3 bg-[#F8F9FA] px-5 py-3 rounded-[0.5rem] border border-gray-50">
                    <Calendar size={20} className="text-[#3E5879]" />
                    <span className="text-md font-black text-[#3E5879]">
                      {booking.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#F8F9FA] px-5 py-3 rounded-[0.5rem] border border-gray-50">
                    <Clock size={20} className="text-[#3E5879]" />
                    <span className="text-md font-black text-[#3E5879]">
                      {booking.time}
                    </span>
                  </div>
                </div>

                <div className="h-[1px] bg-gray-100 w-full mb-6"></div>

                <div className="flex flex-wrap justify-start gap-3">
                  <button
                    onClick={() => handleOpenDetails(booking)}
                    className="bg-[#3E5879] text-white px-8 py-3 rounded-[0.5rem] text-sm font-black hover:bg-[#2C3E50] transition-all shadow-lg shadow-[#3E5879]/20"
                  >
                    عرض التفاصيل
                  </button>

                  {(booking.status === "reschedule_admin" ||
                    booking.status === "pending" ||
                    booking.status === "accepted") && (
                    <>
                      {(booking.status === "reschedule_admin" ||
                        booking.status === "pending" ||
                        booking.status === "accepted") && (
                        <button
                          onClick={() => handleOpenReschedule(booking)}
                          className="bg-gray-100 text-[#3E5879] px-8 py-3 rounded-[0.5rem] text-sm font-black hover:bg-gray-200 transition-all"
                        >
                          اقتراح موعد آخر
                        </button>
                      )}
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="bg-red-50 text-red-500 px-8 py-3 rounded-[0.5rem] text-sm font-black hover:bg-red-100 transition-all"
                      >
                        إلغاء الحجز
                      </button>
                    </>
                  )}

                  {booking.status === "rejected" && (
                    <div className="flex items-center gap-2 text-red-400 font-black text-sm px-4 py-2">
                      <XCircle size={18} />
                      <span>تم إلغاء الحجز</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[1rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-black text-lg">
              لا توجد طلبات معاينة حالياً
            </p>
          </div>
        )}
      </div>

      {/* Modal: Reschedule */}
      <AnimatePresence>
        {isRescheduleModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-md rounded-[1rem] shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-50">
                <button
                  onClick={handleCloseModals}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-lg font-black text-[#3E5879]">
                  اقتراح موعد بديل
                </h2>
              </div>
              <div className="p-6 space-y-5 text-right">
                {/* ... fields ... */}
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">
                    اختار تاريخ جديد
                  </label>
                  <input
                    type="date"
                    min={today}
                    className="w-full bg-[#F3F4F6] border-none rounded-[0.5rem] p-3 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#3E5879] outline-none"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">
                    اختار الوقت
                  </label>
                  <input
                    type="time"
                    className="w-full bg-[#F3F4F6] border-none rounded-[0.5rem] p-3 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#3E5879] outline-none"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">
                    رسالتك للإدارة
                  </label>
                  <textarea
                    rows="3"
                    className="w-full bg-[#F3F4F6] border-none rounded-[0.5rem] p-3 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#3E5879] outline-none resize-none"
                    value={formData.user_message}
                    onChange={(e) =>
                      setFormData({ ...formData, user_message: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>
              <div className="p-6 flex gap-3 border-t border-gray-50 bg-gray-50/50">
                <button
                  onClick={handleCloseModals}
                  className="flex-1 bg-white border border-gray-200 text-gray-500 py-3 rounded-[0.5rem] text-sm font-black hover:bg-gray-100 transition-all"
                >
                  تراجع
                </button>
                <button
                  onClick={handleSubmitReschedule}
                  disabled={submitting}
                  className="flex-1 bg-[#3E5879] text-white py-3 rounded-[0.5rem] text-sm font-black hover:bg-[#2C3E50] transition-all disabled:opacity-50"
                >
                  {submitting ? "جاري الإرسال..." : "تحديث الموعد"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: View Details */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-lg rounded-[0.5rem] shadow-2xl mt-24 overflow-hidden max-h-[80vh] overflow-y-auto custom-scrollbar"
            >
              <div className="sticky top-0 bg-white p-6 border-b border-gray-50 z-10">
                <button
                  onClick={handleCloseModals}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>

                <h2 className="text-lg font-black text-[#3E5879] text-center">
                  تفاصيل طلب المعاينة
                </h2>
              </div>

              <div className="p-6 space-y-6 text-right">
                {/* Unit Info */}
                <div className="bg-gray-50 p-4 rounded-[0.5rem]">
                  <h4 className="font-black text-[#3E5879] mb-2">
                    {selectedBooking.unit?.title}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                    <MapPin size={14} />
                    <span>{selectedBooking.unit?.address}</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-400 flex items-center gap-1">
                      <User size={12} /> الاسم بالكامل
                    </label>
                    <p className="text-sm font-bold text-gray-700">
                      {selectedBooking.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-400 flex items-center gap-1">
                      <Phone size={12} /> رقم الهاتف
                    </label>
                    <p className="text-sm font-bold text-gray-700" dir="ltr">
                      {selectedBooking.phone}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-full">
                    <label className="text-xs font-black text-gray-400 flex items-center gap-1">
                      <Mail size={12} /> البريد الإلكتروني
                    </label>
                    <p className="text-sm font-bold text-gray-700">
                      {selectedBooking.email}
                    </p>
                  </div>
                </div>

                <div className="h-[1px] bg-gray-100"></div>

                {/* Messages */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-[#3E5879] flex items-center gap-1 mb-2">
                      <FileText size={14} /> ملاحظاتك عند الحجز
                    </label>
                    <div className="bg-blue-50/30 p-3 rounded-[0.5rem] border border-blue-100">
                      <p className="text-sm font-bold text-gray-600">
                        {selectedBooking.notes || "لا توجد ملاحظات"}
                      </p>
                    </div>
                  </div>

                  {selectedBooking.user_message && (
                    <div>
                      <label className="text-xs font-black text-[#3E5879] flex items-center gap-1 mb-2">
                        <MessageSquare size={14} /> رسالة التعديل الأخيرة
                      </label>
                      <div className="bg-gray-50 p-3 rounded-[0.5rem]">
                        <p className="text-sm font-bold text-gray-600">
                          {selectedBooking.user_message}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Timestamps */}
                <div className="flex justify-between items-center pt-4 text-[10px] text-gray-400 font-bold border-t border-gray-50">
                  <span>تاريخ الطلب: {selectedBooking.created_at}</span>
                  <span>آخر تحديث: {selectedBooking.updated_at}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 text-center">
                <button
                  onClick={handleCloseModals}
                  className="w-full bg-white border border-gray-200 text-gray-600 py-2.5 rounded-[0.5rem] text-sm font-black hover:bg-gray-100 transition-all"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserBookingMessage;
