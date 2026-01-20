import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import UnitsListing from "./pages/UnitsListing";
import ResetPassword from "./pages/ResetPassword";
import PropertyDetails from "./pages/PropertyDetails";
import RelatedProperties from "./pages/RelatedProperties";

import Terms from "./pages/Terms";
import Booking from "./pages/Booking";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import DevelopersUnits from "./pages/DevelopersUnits";
import CompoundsUnits from "./pages/CompoundsUnits";
import ContactUs from "./pages/ContactUs";
import ProfileInfo from "./pages/profile/ProfileInfo";
import ProfileLayout from "./pages/profile/ProfileLayout";
import NotFound from "./pages/NotFound";

import UserFavorites from "./pages/profile/UserFavorites";
import UserReviews from "./pages/profile/UserReviews";
import UserBookingMessage from "./pages/profile/UserBookingMessage";

// --- 1. مكون حماية المسارات الخاصة (للمسجلين فقط) ---
const ProtectedRoute = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};

// --- 2. مكون حماية المسارات العامة (لغير المسجلين فقط) ---
// يمنع المسجل من الدخول لصفحات SignIn/SignUp
const PublicRoute = () => {
  const token = localStorage.getItem("userToken");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* المجموعه الأولى: صفحات Auth (محمية بـ PublicRoute) */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* المجموعه الثانية: الصفحات التي تحتوي على Navbar/Footer */}
        <Route element={<MainLayout />}>
          {/* صفحات متاحة للجميع */}
          <Route path="/" element={<Home />} />
          <Route path="/units" element={<UnitsListing />} />
          <Route path="/property-details/:id" element={<PropertyDetails />} />
          <Route
            path="/related-properties/:id"
            element={<RelatedProperties />}
          />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/developerUnits/:id" element={<DevelopersUnits />} />
          <Route path="/compoundUnits/:id" element={<CompoundsUnits />} />
          <Route path="/contactUs" element={<ContactUs />} />

          {/* صفحات محمية (تتطلب تسجيل دخول) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/booking/:id" element={<Booking />} />

            <Route path="/profile" element={<ProfileLayout />}>
              <Route index element={<Navigate to="user-profile" replace />} />
              <Route path="user-profile" element={<ProfileInfo />} />
              <Route path="user-booking" element={<UserBookingMessage />} />
              <Route path="favorites" element={<UserFavorites />} />
              <Route path="reviews" element={<UserReviews />} />
            </Route>
          </Route>

          {/* صفحة 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
