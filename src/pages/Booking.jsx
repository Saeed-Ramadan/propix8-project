import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, Loader2 } from 'lucide-react';
// استيراد Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        notes: '',
        agreed: false
    });

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'time' && formData.date === today && value < currentTime) {
            toast.warning("يرجى اختيار وقت مستقبلي");
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agreed) {
            toast.error('يرجى الموافقة على الشروط والأحكام');
            return;
        }

        setSubmitting(true);

        const token = localStorage.getItem('userToken');

        try {
            const response = await fetch('https://propix8.com/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    unit_id: id,
                    email: formData.email,
                    phone: formData.phone,
                    date: formData.date,
                    time: formData.time,
                    notes: formData.notes
                }),
            });

            const result = await response.json();

            if (result.status) {
                // رسالة نجاح Toast
                toast.success(result.message || 'تم حجز الموعد بنجاح!');

                setFormData({ name: '', phone: '', email: '', date: '', time: '', notes: '', agreed: false });

                // الانتقال لصفحة التفاصيل بعد 2.5 ثانية
                setTimeout(() => {
                    navigate(`/property-details/${id}`);
                }, 2500);

            } else {
                toast.error(result.message || 'فشل في إرسال الطلب');
            }
        } catch (error) {
            toast.error('حدث خطأ في الاتصال بالخادم');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 font-cairo" dir="rtl">
            {/* حاوية رسائل التوست */}
            <ToastContainer position="top-center" rtl={true} autoClose={2000} />

            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
                    <h2 className="text-2xl font-bold text-[#415a77] mb-8 text-center">احجز موعد للمعاينة</h2>

                    <form onSubmit={handleSubmit} className="space-y-6 text-right">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">الاسم بالكامل</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="أدخل اسمك بالكامل"
                                    className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right"
                                />
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">رقم الهاتف</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="رقم الهاتف"
                                    className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right"
                                />
                                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">البريد الإلكتروني</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="البريد الإلكتروني"
                                    className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right"
                                />
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm">تاريخ الزيارة</label>
                                <div className="relative" onClick={(e) => e.currentTarget.querySelector('input').showPicker()}>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        min={today}
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right text-gray-400 cursor-pointer"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm">وقت الزيارة</label>
                                <div className="relative" onClick={(e) => e.currentTarget.querySelector('input').showPicker()}>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right text-gray-400 cursor-pointer"
                                    />
                                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">ملاحظات إضافية</label>
                            <textarea
                                name="notes"
                                rows="4"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="أضف أي ملاحظات أو استفسارات حول المعاينة"
                                className="w-full bg-gray-50 border-none rounded-lg p-3 focus:ring-2 focus:ring-[#415a77] outline-none text-right resize-none placeholder:text-gray-300"
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-2 justify-start">
                            <input
                                type="checkbox"
                                name="agreed"
                                checked={formData.agreed}
                                onChange={handleChange}
                                className="w-4 h-4 accent-[#415a77] cursor-pointer"
                            />
                            <label className="text-sm text-gray-600 cursor-pointer select-none">
                                أوافق على
                                <Link to="/terms" className="text-[#415a77] underline mx-1"> الشروط والأحكام و سياسة الخصوصية</Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#415a77] text-white font-bold py-4 rounded-lg hover:bg-[#34495e] transition duration-300 shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <><Loader2 className="animate-spin" size={20} /> جاري المعالجة...</>
                            ) : (
                                'تأكيد الحجز'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}