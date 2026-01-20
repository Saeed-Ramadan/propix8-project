import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
const PublicRoute = () => {
  const token = localStorage.getItem("userToken");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

// مكون الصفحة مع الانميشن
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// مكون الطرق المتحركة
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* المجموعه الأولى: صفحات Auth */}
        <Route element={<PublicRoute />}>
          <Route
            path="/signin"
            element={
              <PageTransition>
                <SignIn />
              </PageTransition>
            }
          />
          <Route
            path="/signup"
            element={
              <PageTransition>
                <SignUp />
              </PageTransition>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageTransition>
                <ForgotPassword />
              </PageTransition>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PageTransition>
                <ResetPassword />
              </PageTransition>
            }
          />
        </Route>

        {/* المجموعه الثانية: الصفحات التي تحتوي على Navbar/Footer */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/units"
            element={
              <PageTransition>
                <UnitsListing />
              </PageTransition>
            }
          />
          <Route
            path="/property-details/:id"
            element={
              <PageTransition>
                <PropertyDetails />
              </PageTransition>
            }
          />
          <Route
            path="/related-properties/:id"
            element={
              <PageTransition>
                <RelatedProperties />
              </PageTransition>
            }
          />
          <Route
            path="/terms"
            element={
              <PageTransition>
                <Terms />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <AboutUs />
              </PageTransition>
            }
          />
          <Route
            path="/services"
            element={
              <PageTransition>
                <Services />
              </PageTransition>
            }
          />
          <Route
            path="/developerUnits/:id"
            element={
              <PageTransition>
                <DevelopersUnits />
              </PageTransition>
            }
          />
          <Route
            path="/compoundUnits/:id"
            element={
              <PageTransition>
                <CompoundsUnits />
              </PageTransition>
            }
          />
          <Route
            path="/contactUs"
            element={
              <PageTransition>
                <ContactUs />
              </PageTransition>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/booking/:id"
              element={
                <PageTransition>
                  <Booking />
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <ProfileLayout />
                </PageTransition>
              }
            >
              <Route index element={<Navigate to="user-profile" replace />} />
              <Route
                path="user-profile"
                element={
                  <PageTransition>
                    <ProfileInfo />
                  </PageTransition>
                }
              />
              <Route
                path="user-booking"
                element={
                  <PageTransition>
                    <UserBookingMessage />
                  </PageTransition>
                }
              />
              <Route
                path="favorites"
                element={
                  <PageTransition>
                    <UserFavorites />
                  </PageTransition>
                }
              />
              <Route
                path="reviews"
                element={
                  <PageTransition>
                    <UserReviews />
                  </PageTransition>
                }
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
