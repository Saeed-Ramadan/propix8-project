import React from 'react';

export default function EditProfile() {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-[#3E5879] mb-8 text-right">تعديل البيانات</h2>
      
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 text-right">
          <label className="font-bold text-gray-600 pr-2">الاسم الجديد</label>
          <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 ring-[#3E5879]/20 outline-none transition-all text-right" />
        </div>
        {/* كرر باقي الحقول... */}
        
        <div className="md:col-span-2 flex gap-4 mt-8">
          <button type="submit" className="flex-1 bg-[#3E5879] text-white font-black py-4 rounded-xl shadow-lg">حفظ</button>
          <button type="button" onClick={() => window.history.back()} className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-xl">إلغاء</button>
        </div>
      </form>
    </div>
  );
}