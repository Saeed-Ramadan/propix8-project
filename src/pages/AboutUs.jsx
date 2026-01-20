import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Home, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  // حالات جديدة لبيانات الصفحة
  const [pageData, setPageData] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  // 1. جلب بيانات الصفحة (من نحن)
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch("https://propix8.com/api/pages");
        const result = await response.json();
        if (result.status && result.data) {
          // البحث عن الصفحة التي تحمل الـ slug "about-us"
          const aboutPage = result.data.find(
            (page) => page.slug === "about-us",
          );
          if (aboutPage) {
            setPageData(aboutPage);
          }
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchPageData();
  }, []);

  // 2. جلب بيانات الأسئلة الشائعة
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("https://propix8.com/api/faqs");
        const result = await response.json();
        if (result.status && result.data) {
          setFaqs(result.data);
          if (result.data.length > 0) setOpenFaq(result.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoadingFaqs(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loadingPage) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#3E5879]" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-cairo text-right" dir="rtl">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-start gap-2 text-gray-400 text-sm">
        <Home size={14} />
        <Link
          to="/"
          className="hover:text-[#3E5879] transition-colors flex items-center gap-1 font-bold"
        >
          الرئيسية
        </Link>
        <span className="text-gray-300 font-bold">/</span>
        <span className="text-[#3E5879] font-bold">
          {pageData?.title || "عن الشركة"}
        </span>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="rounded-[2.5rem] overflow-hidden shadow-xl h-[350px] md:h-[500px]"
        >
          <img
            src={
              pageData?.image ||
              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000"
            }
            className="w-full h-full object-cover"
            alt={pageData?.title}
          />
        </motion.div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-2 lg:order-1"
        >
          <h2 className="text-3xl font-black text-[#3E5879] mb-6">
            {pageData?.title}
          </h2>
          {/* عرض المحتوى كـ HTML بشكل آمن */}
          <div
            className="text-gray-600 leading-[2.2] text-lg text-justify font-medium prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: pageData?.content }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-1 lg:order-2"
        >
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"
            className="w-full h-auto rounded-[2.5rem] shadow-lg"
            alt="Real Estate"
          />
        </motion.div>
      </section>

      {/* Team Section (Dynamic from API) */}
      {pageData?.team_members && pageData.team_members.length > 0 && (
        <section className="mt-24 bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#f0f4f8] rounded-[3rem] p-10 md:p-16 text-center"
            >
              <span className="bg-[#3E5879] text-white px-8 py-2 rounded-full font-bold text-sm mb-6 inline-block">
                فريق العمل
              </span>
              <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-12">
                تعرف على فريق القيادة الذي يعمل على تحويل النظام البيئي العقاري
                من خلال الابتكار والاستراتيجية والخبرة
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pageData.team_members.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center group"
                  >
                    <div className="relative mb-4">
                      <img
                        src={member.photo}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300 object-cover"
                        alt={member.name}
                      />
                    </div>
                    <h4 className="text-lg font-black text-[#3E5879]">
                      {member.name}
                    </h4>
                    <p className="text-gray-500 text-sm font-bold">
                      {member.position}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Dynamic FAQs Section */}
      <section className="max-w-4xl mx-auto px-6 mt-24 pb-24">
        <motion.h2
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-black text-[#3E5879] mb-10 border-r-4 border-[#3E5879] pr-4"
        >
          الأسئلة الشائعة
        </motion.h2>

        {loadingFaqs ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-[#3E5879]" size={40} />
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-gray-100 transition-colors ${openFaq === faq.id ? "bg-gray-50/50 rounded-xl" : ""}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-right font-bold text-lg text-gray-700"
                >
                  <span className={openFaq === faq.id ? "text-[#3E5879]" : ""}>
                    {faq.question}
                  </span>
                  {openFaq === faq.id ? (
                    <ChevronUp className="text-[#3E5879]" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? "max-h-60 p-5 pt-0" : "max-h-0"}`}
                >
                  <p className="text-gray-500 font-medium leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
