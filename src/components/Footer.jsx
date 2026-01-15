import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowLeft, Loader2 } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('https://propix8.com/api/settings');
        const result = await response.json();
        if (result.status) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // روابط احتياطية في حال لم تتوفر البيانات من الـ API
  const siteName = settings?.site_name || "اسم الشركة هنا";
  const siteLogo = settings?.site_logo || null;

  return (
    <footer className="bg-[#415a77] text-white pt-12 font-cairo" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-10 pb-10">
        
        {/* القسم الأول: عن الشركة والشعار */}
        <div className="space-y-4">
          {siteLogo ? (
            <img src={siteLogo} alt={siteName} className="h-12 w-auto object-contain mb-4" />
          ) : (
            <h2 className="text-2xl font-bold">{siteName}</h2>
          )}
          <p className="text-gray-300 text-sm leading-relaxed">
            نسعى لتقديم تجربة عقارية مميزة تجمع بين الثقة، الجودة، والابتكار في كل مشروع نقدمه.
          </p>
          <button className="mt-4 bg-white text-[#415a77] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-100 transition">
            اكتشف وحدتك الآن
            <ArrowLeft size={18} className="bg-[#415a77] text-white rounded-full p-0.5" />
          </button>
        </div>

        {/* القسم الثاني: روابط سريعة */}
        <div>
          <h3 className="text-xl font-bold mb-6">روابط سريعة</h3>
          <ul className="space-y-3 text-gray-300">
            <li><a href="#" className="hover:text-white transition">عقارات للبيع</a></li>
            <li><a href="#" className="hover:text-white transition">المشاريع الجديدة</a></li>
            <li><a href="#" className="hover:text-white transition">الوحدات المميزة</a></li>
            <li><a href="#" className="hover:text-white transition">احجز معاينة</a></li>
            <li><a href="#" className="hover:text-white transition">خدماتنا</a></li>
          </ul>
        </div>

        {/* القسم الثالث: تواصل معنا (ديناميكي) */}
        <div>
          <h3 className="text-xl font-bold mb-6">تواصل معنا</h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-center gap-3">
              <Phone size={18} />
              <span dir="ltr">{settings?.site_phone || "01000000000"}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} />
              <span>{settings?.site_email || "info@company.com"}</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} />
              <span>{settings?.site_address || "القاهرة، مصر"}</span>
            </li>
          </ul>
        </div>

        {/* القسم الرابع: تابعنا (ديناميكي) */}
        <div>
          <h3 className="text-xl font-bold mb-6">تابعنا</h3>
          <div className="flex gap-4">
            {settings?.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="hover:text-gray-400 transition">
                <Facebook />
              </a>
            )}
            {settings?.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="hover:text-gray-400 transition">
                <Instagram />
              </a>
            )}
            {settings?.social_twitter && (
              <a href={settings.social_twitter} target="_blank" rel="noreferrer" className="hover:text-gray-400 transition">
                <Twitter />
              </a>
            )}
            
          </div>
        </div>
      </div>

      {/* حقوق النشر السفلية */}
      <div className="bg-[#e9ecef] text-[#415a77] py-4 text-center text-sm font-bold">
        © {new Date().getFullYear()} جميع الحقوق محفوظة | {siteName}
      </div>
    </footer>
  );
}