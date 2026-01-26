import React from "react";
import {
  ChevronRight,
  CreditCard,
  ShieldAlert,
  BadgeCheck,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Terms() {
  const navigate = useNavigate();

  const [sections, setSections] = React.useState([]);
  const [pageTitle, setPageTitle] = React.useState("الشروط والأحكام");
  const [pageContent, setPageContent] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const getIcon = (title) => {
    if (title.includes("دفع"))
      return <CreditCard className="text-[#415a77]" size={24} />;
    if (title.includes("إلغاء"))
      return <ShieldAlert className="text-[#415a77]" size={24} />;
    if (title.includes("ضمان") || title.includes("تأمين"))
      return <BadgeCheck className="text-[#415a77]" size={24} />;
    return <Info className="text-[#415a77]" size={24} />;
  };

  React.useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch("https://propix8.com/api/pages");
        const result = await response.json();

        if (result.status) {
          const termsPage = result.data.find(
            (page) => page.slug === "terms-and-conditions",
          );
          if (termsPage) {
            setPageTitle(termsPage.title);
            setPageContent(termsPage.content);
            const mappedSections = termsPage.sections.map((section, index) => ({
              id: index + 1,
              title: section.title,
              icon: getIcon(section.title),
              items: section.content,
            }));
            setSections(mappedSections);
          }
        }
      } catch (error) {
        // console.error("Error fetching terms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-cairo" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* زر الرجوع والعنوان */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-[0.5rem] shadow-sm hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={24} className="text-[#415a77]" />
          </button>
          <h1 className="text-3xl font-bold text-[#415a77]">{pageTitle}</h1>
        </div>

        {pageContent && (
          <div className="mb-10 text-right">
            <p className="text-gray-600 text-lg leading-relaxed font-bold">
              {pageContent}
            </p>
          </div>
        )}

        {/* كروت الشروط */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#415a77]"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-[0.5rem] shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                  {section.icon}
                  <h2 className="text-xl font-bold text-[#1b263b]">
                    {section.title}
                  </h2>
                </div>

                <ul className="space-y-4">
                  {section.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-600 leading-relaxed"
                    >
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#415a77] shrink-0" />
                      <p className="text-md md:text-lg">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Terms;
