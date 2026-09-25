import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AppErrorBoundary from '@/components/common/AppErrorBoundary';
import ScrollToTop from '@/components/ScrollToTop';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { queryClientInstance } from '@/lib/query-client';
import AppRoutes from '@/routes/AppRoutes';

export default function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClientInstance}>
          <BrowserRouter>
            <AuthProvider>
              <ScrollToTop />
              <AppRoutes />
              <Toaster />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
