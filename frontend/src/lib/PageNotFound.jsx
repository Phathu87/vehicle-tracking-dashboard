import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <main className="min-h-screen grid place-items-center bg-background p-6">
      <section className="w-full max-w-md text-center">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="mt-3 font-heading text-2xl font-bold">Page not found</h1>
        <p className="mt-2 break-words text-sm text-muted-foreground">
          No route matches {location.pathname}.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Return home
          </Link>
        </Button>
      </section>
    </main>
  );
}
