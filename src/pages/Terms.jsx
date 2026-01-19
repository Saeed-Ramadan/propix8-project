import React from 'react';
import { ChevronRight, CreditCard, ShieldAlert, BadgeCheck, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Terms() {
    const navigate = useNavigate();

    const sections = [
        {
            id: 1,
            title: "جدول الدفع",
            icon: <CreditCard className="text-[#415a77]" size={24} />,
            items: [
                "يجب دفع 100% من المبلغ الإجمالي في وقت الحجز",
                "الرصيد المتبقي: مستحق لاحقاً"
            ]
        },
        {
            id: 2,
            title: "سياسة الإلغاء",
            icon: <ShieldAlert className="text-[#415a77]" size={24} />,
            items: [
                "75% من الدفعات المسبقة المدفوعة قابلة للاسترداد عند الإلغاء قبل 41 يوماً من الوصول أو قبل ذلك",
                "50% من الدفعات المقدمة المدفوعة قابلة للاسترداد عند الإلغاء قبل 21 يوماً من الوصول أو قبل ذلك",
                "0% قابلة للاسترداد في حالة الإلغاء بعد ذلك"
            ]
        },
        {
            id: 3,
            title: "وديعة الضمان",
            icon: <BadgeCheck className="text-[#415a77]" size={24} />,
            items: [
                "يجب دفع وديعة تأمين قابلة للاسترداد بنسبة 25%"
            ]
        },
        {
            id: 4,
            title: "ملحوظات",
            icon: <Info className="text-[#415a77]" size={24} />,
            items: [
                "خصم 5% على الإقامة لمدة 14 ليلة أو أكثر",
                "خصم 10% على الإقامة لمدة 30 ليلة أو أكثر"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 font-cairo" dir="rtl">
            <div className="max-w-4xl mx-auto">

                {/* زر الرجوع والعنوان */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                    >
                        <ChevronRight size={24} className="text-[#415a77]" />
                    </button>
                    <h1 className="text-3xl font-bold text-[#415a77]">الشروط والأحكام</h1>
                </div>

                {/* كروت الشروط */}
                <div className="grid gap-6">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                                {section.icon}
                                <h2 className="text-xl font-bold text-[#1b263b]">
                                    {section.id}. {section.title}
                                </h2>
                            </div>

                            <ul className="space-y-4">
                                {section.items.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                                        <span className="mt-2 w-2 h-2 rounded-full bg-[#415a77] shrink-0" />
                                        <p className="text-md md:text-lg">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Terms;