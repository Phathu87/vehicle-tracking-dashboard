import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '@/components/landing/PublicLayout';
import AuthLayout from '@/components/authentication/AuthLayout';
import AuthenticationBoundary from '@/components/authentication/AuthenticationBoundary';
import GuestOnlyBoundary from '@/components/authentication/GuestOnlyBoundary';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { PageLoadingState } from '@/components/common/LoadingState';
import { PUBLIC_PAGES } from '@/components/landing/publicPageContent';

const Landing = lazy(() => import('@/pages/Landing'));
const PublicInfoPage = lazy(() => import('@/pages/PublicInfoPage'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Vehicles = lazy(() => import('@/pages/Vehicles'));
const VehicleDetail = lazy(() => import('@/pages/VehicleDetail'));
const Drivers = lazy(() => import('@/pages/Drivers'));
const DriverDetail = lazy(() => import('@/pages/DriverDetail'));
const Maintenance = lazy(() => import('@/pages/Maintenance'));
const Alerts = lazy(() => import('@/pages/Alerts'));
const Geofences = lazy(() => import('@/pages/Geofences'));
const RouteOptimisation = lazy(() => import('@/pages/RouteOptimisation'));
const Reports = lazy(() => import('@/pages/Reports'));
const ComingSoon = lazy(() => import('@/pages/ComingSoon'));
const Settings = lazy(() => import('@/pages/Settings'));
const PageNotFound = lazy(() => import('@/lib/PageNotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoadingState />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          {PUBLIC_PAGES.map((page) => (
            <Route key={page.path} path={page.path.slice(1)} element={<PublicInfoPage page={page} />} />
          ))}
        </Route>

        <Route element={<AuthLayout />}>
          <Route element={<GuestOnlyBoundary />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<AuthenticationBoundary required />}>
          <Route path="app" element={<DashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleDetail />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="drivers/:id" element={<DriverDetail />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="geofences" element={<Geofences />} />
            <Route path="routes" element={<RouteOptimisation />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<ComingSoon title="Analytics" />} />
            <Route path="fuel" element={<ComingSoon title="Fuel Management" />} />
            <Route path="users" element={<ComingSoon title="User Management" />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}
