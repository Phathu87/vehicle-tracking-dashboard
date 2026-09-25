import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingState({ label = 'Loading', className }) {
  return (
    <div
      className={cn('flex min-h-40 items-center justify-center gap-3 text-sm text-muted-foreground', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function PageLoadingState() {
  return <LoadingState label="Loading Fleet Drive" className="min-h-screen bg-background" />;
}
