import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword'; // استيراد الصفحة الجديدة
import UnitsListing from './pages/UnitsListing';
import ResetPassword from './pages/ResetPassword';
import PropertyDetails from './pages/PropertyDetails';
import RelatedProperties from './pages/RelatedProperties';
import UserProfile from './pages/UserProfile';
import ProfileFromOther from './pages/ProfileFromOther';
import Terms from './pages/Terms';
import Booking from './pages/Booking';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';



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
          <Route path="/related-properties/:id" element={<RelatedProperties />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/profileFromOther/:id" element={<ProfileFromOther />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />




          {/* أي صفحة تضعها هنا سيظهر لها الـ Navbar والـ Footer تلقائياً */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;