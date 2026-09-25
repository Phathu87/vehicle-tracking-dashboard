import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { PageLoadingState } from '@/components/common/LoadingState';

export default function GuestOnlyBoundary() {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return <PageLoadingState />;
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
}
