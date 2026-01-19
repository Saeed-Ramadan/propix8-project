import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const siteName = settings?.site_name || "اسم الشركة هنا";
  const siteLogo = settings?.site_logo || null;

  return (
    <footer className="bg-[#415a77] text-white pt-16 font-cairo" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">

        {/* القسم الأول: عن الشركة والشعار */}
        <div className="space-y-6">
          {siteLogo ? (
            <img src={siteLogo} alt={siteName} className="h-14 w-auto object-contain" />
          ) : (
            <h2 className="text-3xl font-bold tracking-tight">{siteName}</h2>
          )}
          <p className="text-gray-300 text-sm leading-relaxed opacity-90">
            نسعى لتقديم تجربة عقارية مميزة تجمع بين الثقة، الجودة، والابتكار في كل مشروع نقدمه لعملائنا.
          </p>
          <Link to="/units" className="group mt-4 bg-white text-[#415a77] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#e9ecef] transition-all w-fit shadow-lg shadow-black/10">
            اكتشف وحدتك الآن
            <ArrowLeft size={18} className="bg-[#415a77] text-white rounded-full p-0.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* القسم الثاني: روابط سريعة */}
        <div>
          <h3 className="text-xl font-bold mb-8 border-r-4 border-white pr-4 leading-none">روابط سريعة</h3>
          <ul className="space-y-4 text-gray-300">
            <li><Link to="/units" className="hover:text-white hover:pr-2 transition-all duration-300">عقارات للبيع</Link></li>
            <li><a href="#" className="hover:text-white hover:pr-2 transition-all duration-300">المشاريع الجديدة</a></li>
            <li><a href="#" className="hover:text-white hover:pr-2 transition-all duration-300">الوحدات المميزة</a></li>
            <li><Link to="/units" className="hover:text-white hover:pr-2 transition-all duration-300">احجز معاينة</Link></li>
            <li><Link to="/services" className="hover:text-white hover:pr-2 transition-all duration-300">خدماتنا</Link></li>
          </ul>
        </div>

        {/* القسم الثالث: تواصل معنا */}
        <div>
          <h3 className="text-xl font-bold mb-8 border-r-4 border-white pr-4 leading-none">تواصل معنا</h3>
          <ul className="space-y-5 text-gray-300">
            <li className="flex items-center gap-4 group">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Phone size={18} />
              </div>
              <span dir="ltr" className="group-hover:text-white transition-colors">{settings?.site_phone || "01000000000"}</span>
            </li>
            <li className="flex items-center gap-4 group">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Mail size={18} />
              </div>
              <span className="group-hover:text-white transition-colors">{settings?.site_email || "info@company.com"}</span>
            </li>
            <li className="flex items-center gap-4 group">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <MapPin size={18} />
              </div>
              <span className="group-hover:text-white transition-colors">{settings?.site_address || "القاهرة، مصر"}</span>
            </li>
          </ul>
        </div>

        {/* القسم الرابع: تابعنا + لوجو المطور */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6 border-r-4 border-white pr-4 leading-none">تابعنا</h3>
            <div className="flex gap-4 mb-10">
              {settings?.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#1877F2] hover:scale-110 transition-all shadow-lg">
                  <Facebook size={20} />
                </a>
              )}
              {settings?.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:scale-110 transition-all shadow-lg">
                  <Instagram size={20} />
                </a>
              )}
              {settings?.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-black hover:scale-110 transition-all shadow-lg">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>

          {/* لوجو Fourth Pyramid Agency بشكل احترافي */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase flex justify-end  tracking-widest text-gray-400 mb-3 font-bold">Tech Partner</p>
            <a
              href="https://fourthpyramidagcy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
            >
              <img
                src="http://fourthpyramidagcy.com/wp-content/uploads/2025/06/Screenshot-2025-06-01-194050-1.png"
                alt="Fourth Pyramid Agency"
                className="h-10 w-auto object-contain brightness-110 group-hover:contrast-125 transition-all"
              />
              <div className="flex flex-col">
                <span className=" text-xs font-black text-white/90 group-hover:text-white transition-colors">Fourth Pyramid</span>
                <span className=" text-[9px] text-gray-400 tracking-tighter">Digital Agency</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* حقوق النشر السفلية البسيطة */}
      <div className="bg-[#1b263b]/50 py-5 text-center text-xs font-medium text-gray-400 border-t border-white/5">
        <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لـ {siteName}</p>
      </div>
    </footer>
  );
}