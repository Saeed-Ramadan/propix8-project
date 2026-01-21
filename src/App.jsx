import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.js";

// Lazy Loading Pages
const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UnitsListing = lazy(() => import("./pages/UnitsListing"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const RelatedProperties = lazy(() => import("./pages/RelatedProperties"));
const Terms = lazy(() => import("./pages/Terms"));
const Booking = lazy(() => import("./pages/Booking"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Services = lazy(() => import("./pages/Services"));
const DevelopersUnits = lazy(() => import("./pages/DevelopersUnits"));
const CompoundsUnits = lazy(() => import("./pages/CompoundsUnits"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ProfileInfo = lazy(() => import("./pages/profile/ProfileInfo"));
const ProfileLayout = lazy(() => import("./pages/profile/ProfileLayout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UserFavorites = lazy(() => import("./pages/profile/UserFavorites"));
const UserReviews = lazy(() => import("./pages/profile/UserReviews"));
const UserBookingMessage = lazy(
  () => import("./pages/profile/UserBookingMessage"),
);
const UserServiceBookings = lazy(
  () => import("./pages/profile/UserServiceBookings"),
);

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
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

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <Loader2 className="animate-spin text-[#3E5879]" size={48} />
  </div>
);

// مكون الطرق المتحركة
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
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
                <Route
                  path="service-bookings"
                  element={
                    <PageTransition>
                      <UserServiceBookings />
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
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
