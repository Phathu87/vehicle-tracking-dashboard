import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { PageLoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';

export default function AuthenticationBoundary({ required = false }) {
  const { isAuthenticated, isLoadingAuth, status, authError, checkUserAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) return <PageLoadingState />;

  if (required && status === 'unavailable') {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <div className="max-w-md rounded-lg border border-danger/30 bg-card p-8 text-center">
          <h1 className="font-heading text-xl font-semibold">Fleet Drive API unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">{authError?.message || 'Your session could not be verified. Your stored sign-in has not been removed.'}</p>
          <Button className="mt-5" onClick={checkUserAuth}>Retry connection</Button>
        </div>
      </main>
    );
  }

  if (required && !isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <Outlet />;
}
