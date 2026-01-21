import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToButton from "../components/ScrollToButton";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32">
        <Outlet />
      </main>
      <ScrollToButton />
      <Footer />
    </div>
  );
}
