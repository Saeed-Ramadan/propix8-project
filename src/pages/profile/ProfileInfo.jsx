import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileInfo() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-[#3E5879] mb-10 text-right">الحساب الشخصي</h2>
      
      <div className="flex justify-center mb-12">
        <div className="relative group">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" 
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl" 
            alt="User" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReadOnlyField label="الاسم بالكامل" value="سارة أحمد" />
        <ReadOnlyField label="البريد الإلكتروني" value="sara@example.com" />
        <ReadOnlyField label="رقم الهاتف" value="0123456789" />
        <ReadOnlyField label="العنوان" value="القاهرة، مصر" />
        <ReadOnlyField label="نوع المستخدم" value="مشتري" />
        <ReadOnlyField label="المدينة" value="التجمع الخامس" />
      </div>

      <button 
        onClick={() => navigate('/profile/edit')}
        className="w-full mt-12 bg-[#3E5879] text-white font-black py-4 rounded-xl hover:bg-[#2c3e56] transition-all shadow-lg active:scale-95"
      >
        تعديل البيانات
      </button>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="space-y-2 text-right">
      <label className="block text-gray-400 text-sm font-bold pr-2">{label}</label>
      <div className="w-full p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-[#3E5879] font-black shadow-inner">
        {value}
      </div>
    </div>
  );
}