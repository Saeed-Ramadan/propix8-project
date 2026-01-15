import React from 'react';
import { User, Heart, Star, ChevronLeft } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export default function ProfileLayout() {
  const menuItems = [
    { name: 'الحساب الشخصي', path: 'user-profile', icon: <User size={20} /> },
    { name: 'المفضلة', path: 'favorites', icon: <Heart size={20} /> },
    { name: 'الآراء', path: 'reviews', icon: <Star size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8 md:py-12 px-4 font-cairo" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="flex flex-col">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center justify-between px-6 py-5 transition-all border-r-4 ${
                      isActive 
                      ? 'bg-[#3E5879] text-white border-[#3E5879]' 
                      : 'text-gray-500 border-transparent hover:bg-gray-50'
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
              <button className="flex items-center px-6 py-6 text-red-500 hover:bg-red-50 font-bold border-t border-gray-50 transition-colors mt-4">
                حذف الحساب
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}