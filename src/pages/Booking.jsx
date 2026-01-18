import React, { useState } from 'react';
import { MapPin, BedDouble, Bath, Maximize, Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';

export default function Booking() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    visitDate: '',
    visitTime: '',
    notes: '',
    agreed: false
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-cairo" dir="rtl">
      <div className="max-w-4xl mx-auto">

        {/* بطاقة تفاصيل الوحدة (الجزء العلوي) */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100 flex flex-col md:flex-row shadow-md">
          <div className="md:w-1/3 h-48 md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#415a77] mb-2">
              <MapPin size={18} />
              <span className="font-bold text-lg">القاهرة الجديدة - التجمع الخامس</span>
            </div>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-gray-500 text-sm mt-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <Maximize size={16} className="text-[#415a77]" />
                <span>520 م²</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble size={16} className="text-[#415a77]" />
                <span>5 غرف</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={16} className="text-[#415a77]" />
                <span>4 حمامات</span>
              </div>
            </div>
          </div>
        </div>

        {/* نموذج الحجز (الجزء السفلي) */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#415a77] mb-8 text-center">احجز موعد للمعاينة</h2>

          <form className="space-y-6">
            {/* الاسم بالكامل */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">الاسم بالكامل</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="أدخل اسمك بالكامل"
                  className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right"
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">رقم الهاتف</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right"
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* التاريخ والوقت */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">تاريخ الزيارة</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right text-gray-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">وقت الزيارة</label>
                <div className="relative">
                  <input
                    type="time"
                    className="w-full bg-gray-50 border-none rounded-lg p-3 pr-10 focus:ring-2 focus:ring-[#415a77] outline-none text-right text-gray-500"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            {/* ملاحظات إضافية */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ملاحظات إضافية</label>
              <div className="relative">
                <textarea
                  rows="4"
                  placeholder="أضف أي ملاحظات أو استفسارات حول المعاينة"
                  className="w-full bg-gray-50 border-none rounded-lg p-3 focus:ring-2 focus:ring-[#415a77] outline-none text-right resize-none"
                ></textarea>
              </div>
            </div>

            {/* الشروط والأحكام */}
            <div className="flex items-center gap-2 justify-start">
            <input
                type="checkbox"
                className="w-4 h-4 accent-[#415a77] cursor-pointer"
              />
              <label className="text-sm text-gray-600 cursor-pointer select-none">
                أوافق على <span className="text-[#415a77] underline">الشروط والأحكام</span> و<span className="text-[#415a77] underline">سياسة الخصوصية</span>
              </label>

            </div>

            {/* زر التأكيد */}
            <button
              type="submit"
              className="w-full bg-[#415a77] text-white font-bold py-4 rounded-lg hover:bg-[#34495e] transition duration-300 shadow-lg mt-4"
            >
              تأكيد الحجز
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}