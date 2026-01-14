import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* تأكد من وجود هذا السطر لعرض محتوى الصفحات */}
      </main>
      <Footer />
    </div>
  );
}