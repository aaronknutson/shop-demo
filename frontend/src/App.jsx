import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ToastProvider } from './contexts/ToastContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ProtectedCustomerRoute from './components/customer/ProtectedCustomerRoute';
import AdminLayout from './components/admin/AdminLayout';
import CustomerPortalLayout from './components/customer/CustomerPortalLayout';
import { CONTACT_INFO } from './config/contact';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Brands = lazy(() => import('./pages/Brands'));
const BrandDetail = lazy(() => import('./pages/BrandDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Quote = lazy(() => import('./pages/Quote'));
const Location = lazy(() => import('./pages/Location'));
const Coupons = lazy(() => import('./pages/Coupons'));
const Tires = lazy(() => import('./pages/Tires'));
const MaintenanceTips = lazy(() => import('./pages/MaintenanceTips'));
const MaintenanceTipDetail = lazy(() => import('./pages/MaintenanceTipDetail'));
const Appointments = lazy(() => import('./pages/Appointments'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Unified login page
const Login = lazy(() => import('./pages/Login'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Quotes = lazy(() => import('./pages/admin/Quotes'));
const QuoteDetail = lazy(() => import('./pages/admin/QuoteDetail'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));
const AdminTips = lazy(() => import('./pages/admin/Tips'));
const AdminContacts = lazy(() => import('./pages/admin/Contacts'));
const AdminAppointments = lazy(() => import('./pages/admin/Appointments'));

// Customer portal pages
const CustomerLogin = lazy(() => import('./pages/customer/CustomerLogin'));
const CustomerRegister = lazy(() => import('./pages/customer/CustomerRegister'));
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'));
const CustomerVehicles = lazy(() => import('./pages/customer/CustomerVehicles'));
const CustomerAppointments = lazy(() => import('./pages/customer/CustomerAppointments'));
const CustomerServiceHistory = lazy(() => import('./pages/customer/CustomerServiceHistory'));
const CustomerProfile = lazy(() => import('./pages/customer/CustomerProfile'));

function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <CustomerAuthProvider>
          <ToastProvider>
            <Helmet>
              <title>{CONTACT_INFO.businessName} - Auto Repair {CONTACT_INFO.address.city} | Expert Car Service Since {CONTACT_INFO.established}</title>
              <meta name="description" content={`${CONTACT_INFO.businessName} provides expert auto repair services in ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state}. Trusted since ${CONTACT_INFO.established} with honest pricing and quality service.`} />
            </Helmet>

            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="services/:slug" element={<ServiceDetail />} />
                <Route path="brands" element={<Brands />} />
                <Route path="tires" element={<Tires />} />
                <Route path="tips" element={<MaintenanceTips />} />
                <Route path="tips/:slug" element={<MaintenanceTipDetail />} />
                <Route path=":slug" element={<BrandDetail />} />
                <Route path="contact" element={<Contact />} />
                <Route path="quote" element={<Quote />} />
                <Route path="location" element={<Location />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Unified Login Route */}
              <Route path="/login" element={<Login />} />

              {/* Redirect old login paths to unified login */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/portal/login" element={<Login />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="quotes" element={<Quotes />} />
                <Route path="quotes/:id" element={<QuoteDetail />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="tips" element={<AdminTips />} />
                <Route path="contacts" element={<AdminContacts />} />
              </Route>

              {/* Customer Portal Routes */}
              <Route path="/portal/register" element={<CustomerRegister />} />
              <Route
                path="/portal"
                element={
                  <ProtectedCustomerRoute>
                    <CustomerPortalLayout />
                  </ProtectedCustomerRoute>
                }
              >
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="vehicles" element={<CustomerVehicles />} />
                <Route path="appointments" element={<CustomerAppointments />} />
                <Route path="service-history" element={<CustomerServiceHistory />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
        </CustomerAuthProvider>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
