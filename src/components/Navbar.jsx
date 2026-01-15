import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, User, ChevronDown, Menu, X, Search, Loader2, Mail, MapPin, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [settings, setSettings] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const userToken = localStorage.getItem('userToken');
  const storedData = localStorage.getItem('userData');
  const userData = (storedData && storedData !== "undefined") ? JSON.parse(storedData) : {};

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
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await fetch(`https://propix8.com/api/search?q=${searchQuery}`);
          const result = await response.json();
          if (result.status) {
            setSearchResults(result.data.units || []);
            setShowSearchResults(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setIsMobileMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('https://propix8.com/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userToken}`, 'Accept': 'application/json' },
      });
    } catch (error) { console.error("Logout Error:", error); }
    finally {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      setIsOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/signin');
    }
  };

  const SearchResultsList = () => (
    showSearchResults && (
      <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[1100] max-h-[400px] overflow-y-auto">
        {searchResults.length > 0 ? (
          searchResults.map((unit) => (
            <Link
              key={unit.id}
              to={`/property-details/${unit.id}`}
              onClick={() => { setShowSearchResults(false); setSearchQuery(""); setShowMobileSearch(false); }}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors text-right"
            >
              <img src={unit.main_image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-gray-800 truncate">{unit.title}</h4>
                <p className="text-[11px] text-gray-500 truncate">{unit.address}</p>
                <p className="text-xs font-bold text-[#3E5879] mt-1">{Number(unit.price).toLocaleString()} ج.م</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">لا توجد نتائج مطابقة</div>
        )}
      </div>
    )
  );

  return (
    <div className="flex flex-col w-full sticky top-0 z-[1000]">
      <nav className="bg-[#f8f9fa] py-4 px-4 md:px-16 shadow-sm flex justify-center font-cairo" dir="rtl">
        <div className="w-full max-w-7xl flex justify-between items-center gap-2">
          
          <div className="flex items-center gap-3">
            {/* Mobile & Tablet Toggle */}
            <div className="lg:hidden flex items-center gap-1">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[#3E5879] hover:bg-gray-100 rounded-lg">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="p-2 text-[#3E5879] hover:bg-gray-100 rounded-lg">
                <Search size={22} />
              </button>
            </div>

            {/* Logo Section */}
            <Link to="/" className="flex items-center shrink-0">
                {settings?.site_logo ? (
                  <img 
                    src={settings?.site_logo || null} 
                    alt={settings?.site_name || "Logo"} 
                    className="w-32 md:w-48 h-12 md:h-16 object-contain brightness-0 transition-all"
                  />
                ) : (
                  <span className="text-xl md:text-2xl font-black bg-gradient-to-l from-[#3E5879] to-[#213547] bg-clip-text text-transparent">
                    {settings?.site_name || "برو بيكس"}
                  </span>
                )}
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 text-[#000000] font-bold">
            <NavLink to="/" className={({isActive}) => isActive ? "text-[#3E5879]" : "hover:text-[#3E5879]"}>الرئيسية</NavLink>
            <NavLink to="/units" className={({isActive}) => isActive ? "text-[#3E5879]" : "hover:text-[#3E5879]"}>عقارات</NavLink>
            <NavLink to="/services" className={({isActive}) => isActive ? "text-[#3E5879]" : "hover:text-[#3E5879]"}>خدماتنا</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? "text-[#3E5879]" : "hover:text-[#3E5879]"}>عن الشركة</NavLink>
            {/* الرابط الجديد هنا */}
            <NavLink to="/contactUs" className={({isActive}) => isActive ? "text-[#3E5879]" : "hover:text-[#3E5879]"}>تواصل معنا</NavLink>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex relative flex-1 max-w-sm mx-4" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن عقار..."
                className="w-full bg-white border border-gray-200 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E5879]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </div>
            </div>
            <SearchResultsList />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {userToken && userData?.role === 'seller' && (
              <Link to="/add-property" className="bg-[#3E5879] text-white p-2 md:px-5 md:py-2 rounded-xl shadow-md font-bold flex items-center gap-2 hover:bg-[#2c3846] transition-all">
                <PlusCircle size={18} />
                <span className="hidden sm:inline text-sm">أضف عقار</span>
              </Link>
            )}

            {userToken ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-white border border-gray-200 p-1 md:pr-1.5 md:pl-4 rounded-full font-bold text-[#3E5879] hover:shadow-sm transition-all">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-[#3E5879] text-white rounded-full flex items-center justify-center"><User size={16} /></div>
                  )}
                  <span className="hidden xl:inline text-sm">{userData.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[999] overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 mb-1">
                      <p className="text-sm font-black text-[#3E5879] truncate mb-1.5">{userData.name || "المستخدم"}</p>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Mail size={12} className="shrink-0" />
                        <span className="text-[11px] truncate">{userData.email || "لا يوجد بريد"}</span>
                      </div>
                      {userData.address && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin size={12} className="shrink-0" />
                          <span className="text-[11px] truncate">{userData.address}</span>
                        </div>
                      )}
                    </div>

                    <Link to="/profile/user-profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-[#3E5879]/5 transition-colors" onClick={() => setIsOpen(false)}>
                      <User size={18} /> <span className="text-sm">الملف الشخصي</span>
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[#dc2626] hover:bg-red-50 border-t border-gray-100 mt-1 font-bold transition-colors">
                      <LogOut size={18} /> <span className="text-sm">تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="border-2 border-[#3E5879] text-[#3E5879] px-4 md:px-6 py-1.5 rounded-xl font-bold hover:bg-[#3E5879] hover:text-white transition-all text-sm">دخول</Link>
            )}
          </div>
        </div>

        {/* Mobile Slide Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full right-0 w-full bg-white border-b shadow-xl py-6 flex flex-col items-center gap-5 z-[998] animate-in slide-in-from-top duration-300" ref={mobileMenuRef}>
            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-700 hover:text-[#3E5879]">الرئيسية</NavLink>
            <NavLink to="/units" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-700 hover:text-[#3E5879]">عقارات</NavLink>
            <NavLink to="/services" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-700 hover:text-[#3E5879]">خدماتنا</NavLink>
            <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-700 hover:text-[#3E5879]">عن الشركة</NavLink>
            <NavLink to="/contactUs" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-700 hover:text-[#3E5879]">تواصل معنا</NavLink>
          </div>
        )}
      </nav>

      {/* Mobile/Tablet Search Bar */}
      {showMobileSearch && (
        <div className="lg:hidden bg-white px-4 py-3 border-b border-gray-100 animate-in slide-in-from-top duration-300 shadow-inner" ref={mobileSearchRef}>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="ابحث عن عقار أو مدينة..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-[#3E5879]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </div>
            <SearchResultsList />
          </div>
        </div>
      )}
    </div>
  );
}