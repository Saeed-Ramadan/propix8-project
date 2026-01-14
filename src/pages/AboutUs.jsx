import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Home, Loader2 } from 'lucide-react';

export default function AboutUs() {
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [openFaq, setOpenFaq] = useState(null); // جعل الكل مغلق في البداية

  // 1. جلب بيانات الأسئلة الشائعة من الـ API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('https://propix8.com/api/faqs');
        const result = await response.json();
        if (result.status && result.data) {
          setFaqs(result.data);
          // اختيارياً: فتح أول سؤال تلقائياً بعد التحميل
          if(result.data.length > 0) setOpenFaq(result.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoadingFaqs(false);
      }
    };

    fetchFaqs();
  }, []);

  // بيانات ثابتة للأقسام الأخرى (يمكنك جعلها API أيضاً لاحقاً)
  const aboutData = {
    title: "معلومات عنا",
    description: "هذا النص هو مثال لنص يستخدم في تصميم المواقع والتطبيقات كحشو مؤقت. الهدف منه هو ملء المساحات وعرض التنسيق بصرياً دون الاعتماد على محتوى نهائي.",
    mainImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000",
    subImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"
  };

  const team = [
    { id: 1, image: "https://i.pravatar.cc/150?u=11" },
    { id: 2, image: "https://i.pravatar.cc/150?u=12" },
    { id: 3, image: "https://i.pravatar.cc/150?u=13" },
    { id: 4, image: "https://i.pravatar.cc/150?u=14" },
  ];

  return (
    <div className="bg-white min-h-screen font-cairo text-right" dir="rtl">
      
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-6 flex items-center gap-2 text-gray-500 text-sm">
        <Home size={14} />
        <Link to="/" className="hover:text-[#3E5879] transition-colors font-medium">الرئيسية</Link>
        <span className="text-gray-300">/</span>
        <span className="text-[#3E5879] font-bold">عن الشركة</span>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <div className="rounded-[2.5rem] overflow-hidden shadow-xl h-[350px] md:h-[500px]">
          <img src={aboutData.mainImage} className="w-full h-full object-cover" alt="Team Work" />
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl font-black text-[#3E5879] mb-6">{aboutData.title}</h2>
          <p className="text-gray-600 leading-[2.2] text-lg text-justify font-medium">"{aboutData.description}"</p>
        </div>
        <div className="order-1 lg:order-2">
          <img src={aboutData.subImage} className="w-full h-auto rounded-[2.5rem] shadow-lg" alt="Real Estate" />
        </div>
      </section>

      {/* Team Section */}
      <section className="mt-24 bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#f0f4f8] rounded-[3rem] p-10 md:p-16 text-center">
            <span className="bg-[#3E5879] text-white px-8 py-2 rounded-full font-bold text-sm mb-6 inline-block">من نحن</span>
            <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-12">تعرف على فريق القيادة الذي يعمل على تحويل النظام البيئي العقاري</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.id} className="flex justify-center group">
                  <img src={member.image} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300" alt="Team" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic FAQs Section */}
      <section className="max-w-4xl mx-auto px-6 mt-24 pb-24">
        <h2 className="text-2xl font-black text-[#3E5879] mb-10 border-r-4 border-[#3E5879] pr-4">الأسئلة الشائعة</h2>
        
        {loadingFaqs ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-[#3E5879]" size={40} />
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className={`border-b border-gray-100 transition-colors ${openFaq === faq.id ? 'bg-gray-50/50 rounded-xl' : ''}`}>
                <button 
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-right font-bold text-lg text-gray-700"
                >
                  <span className={openFaq === faq.id ? 'text-[#3E5879]' : ''}>{faq.question}</span>
                  {openFaq === faq.id ? <ChevronUp className="text-[#3E5879]" /> : <ChevronDown className="text-gray-400" />}
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'max-h-60 p-5 pt-0' : 'max-h-0'}`}>
                  <p className="text-gray-500 font-medium leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}