import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToButton from "../components/ScrollToButton";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${!isHome ? "pt-24 " : ""}`}>
        <Outlet />
      </main>
      <ScrollToButton />
      <Footer />
    </div>
  );
}
