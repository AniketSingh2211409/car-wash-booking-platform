import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import BusinessLayout from './layouts/BusinessLayout';
import AppLayout from './layouts/AppLayout';

// Shared Pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBusinesses from './pages/admin/Businesses';
import AdminCommissions from './pages/admin/Commissions';
import AdminWallet from './pages/admin/Wallet';

// Business Pages
import BusinessDashboard from './pages/dashboard/Dashboard';
import BusinessServices from './pages/dashboard/Services';
import BusinessSubscriptions from './pages/dashboard/Subscriptions';
import RecordWash from './pages/dashboard/RecordWash';
import WashHistory from './pages/dashboard/WashHistory';
import BusinessReports from './pages/dashboard/Reports';
import BusinessCustomers from './pages/dashboard/Customers';
import BusinessRequests from './pages/dashboard/Requests';
import BusinessPurchases from './pages/dashboard/Purchases';
import BusinessWallet from './pages/dashboard/Wallet';

// Customer Pages
import CustomerHome from './pages/app/Home';
import CustomerCenters from './pages/app/Centers';
import CustomerCenterDetails from './pages/app/CenterDetails';
import CustomerHistory from './pages/app/History';
import CustomerSubscriptions from './pages/app/Subscriptions';
import CustomerProfile from './pages/app/Profile';
import CustomerNotifications from './pages/app/Notifications';
import CustomerPrivacy from './pages/app/Privacy';
import CustomerSupport from './pages/app/Support';
import CustomerGiftCards from './pages/app/GiftCards';

import ErrorBoundary from './components/ErrorBoundary';

import { Toaster } from 'react-hot-toast';
import Sales from './pages/dashboard/Sales';
import Purchases from './pages/dashboard/Purchases';
import SettingsHub from './pages/dashboard/settings/SettingsHub';
import PriceListManagement from './pages/dashboard/settings/PriceListManagement';
import OffersManagement from './pages/dashboard/settings/OffersManagement';
import SubscriptionPlanManagement from './pages/dashboard/settings/SubscriptionPlanManagement';
import BranchManagement from './pages/dashboard/settings/BranchManagement';
import GiftCardManagement from './pages/dashboard/settings/GiftCardManagement';
import AdminUserManagement from './pages/dashboard/settings/AdminUserManagement';
import CompanyInformation from './pages/dashboard/settings/CompanyInformation';
import CenterPolicy from './pages/dashboard/settings/CenterPolicy';
import DataExport from './pages/dashboard/settings/DataExport';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <ErrorBoundary>
          <Routes>
            {/* Landing Page - Force as root */}
            <Route path="/" element={
              <ErrorBoundary>
                <Landing />
              </ErrorBoundary>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
          
          {/* Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="businesses" element={<AdminBusinesses />} />
            <Route path="commissions" element={<AdminCommissions />} />
            <Route path="wallet" element={<AdminWallet />} />
          </Route>

          {/* Business Portal */}
          <Route path="/dashboard" element={<BusinessLayout />}>
            <Route index element={<BusinessDashboard />} />
            <Route path="customers" element={<BusinessCustomers />} />
            <Route path="requests" element={<BusinessRequests />} />
            <Route path="sales" element={<Sales />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="settings" element={<SettingsHub />} />
            <Route path="settings/price-list" element={<PriceListManagement />} />
            <Route path="settings/offers" element={<OffersManagement />} />
            <Route path="settings/subscriptions" element={<SubscriptionPlanManagement />} />
            <Route path="settings/branches" element={<BranchManagement />} />
            <Route path="settings/gift-cards" element={<GiftCardManagement />} />
            <Route path="settings/users" element={<AdminUserManagement />} />
            <Route path="settings/company" element={<CompanyInformation />} />
            <Route path="settings/policy" element={<CenterPolicy />} />
            <Route path="settings/export" element={<DataExport />} />
            <Route path="wallet" element={<BusinessWallet />} />
            <Route path="wash/new" element={<RecordWash />} />
            <Route path="washes" element={<WashHistory />} />
            <Route path="reports" element={
              <ErrorBoundary>
                <BusinessReports />
              </ErrorBoundary>
            } />
          </Route>

          {/* Customer Portal */}
          <Route path="/app" element={
            (() => {
              let role = null;
              try {
                role = localStorage.getItem('role');
              } catch (e) {
                console.error('Error accessing localStorage:', e);
              }
              if (role === 'super_admin') return <Navigate to="/admin" replace />;
              if (role === 'business_owner' || role === 'business') return <Navigate to="/dashboard" replace />;
              if (role !== 'customer') return <Navigate to="/login" replace />;
              return <AppLayout />;
            })()
          }>
            <Route index element={<CustomerHome />} />
            <Route path="centers" element={<CustomerCenters />} />
            <Route path="centers/:id" element={<CustomerCenterDetails />} />
            <Route path="history" element={<CustomerHistory />} />
            <Route path="subscriptions" element={<CustomerSubscriptions />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="notifications" element={<CustomerNotifications />} />
            <Route path="privacy" element={<CustomerPrivacy />} />
            <Route path="support" element={<CustomerSupport />} />
            <Route path="gift-cards" element={
              <ErrorBoundary>
                <CustomerGiftCards />
              </ErrorBoundary>
            } />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </LanguageProvider>
  );
}
