import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

import ProfileFromOther from "./pages/ProfileFromOther";
import Terms from "./pages/Terms";
import Booking from "./pages/Booking";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import DevelopersUnits from "./pages/DevelopersUnits";
import CompoundsUnits from "./pages/CompoundsUnits";
import ContactUs from "./pages/ContactUs";
import ProfileInfo from "./pages/profile/ProfileInfo";
import ProfileLayout from "./pages/profile/ProfileLayout";

import UserFavorites from "./pages/profile/UserFavorites";
import UserReviews from "./pages/profile/UserReviews";

function App() {
  return (
    <Router>
      <Routes>
        {/* المجموعه الأولى: الصفحات التي بدون Navbar/Footer (Auth Pages) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* المجموعه الثانية: كل الصفحات التي تحتاج Navbar/Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/units" element={<UnitsListing />} />
          <Route path="/property-details/:id" element={<PropertyDetails />} />
          <Route
            path="/related-properties/:id"
            element={<RelatedProperties />}
          />

          <Route path="/profileFromOther/:id" element={<ProfileFromOther />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/developerUnits/:id" element={<DevelopersUnits />} />
          <Route path="/compoundUnits/:id" element={<CompoundsUnits />} />
          <Route path="/contactUs" element={<ContactUs />} />

          {/* --- مسارات الحساب الشخصي الجديدة --- */}
          <Route path="/profile" element={<ProfileLayout />}>
            {/* تحويل تلقائي من /profile إلى /profile/info */}
            <Route index element={<Navigate to="user-profile" replace />} />
            <Route path="user-profile" element={<ProfileInfo />} />

            <Route path="favorites" element={<UserFavorites />} />
            <Route path="reviews" element={<UserReviews />} />
          </Route>
          {/* ---------------------------------- */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
