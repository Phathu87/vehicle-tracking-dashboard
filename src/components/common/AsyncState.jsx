import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/common/LoadingState';

export default function AsyncState({ loading, error, empty, onRetry, children }) {
  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center border border-danger/30 bg-danger/5 p-6 text-center">
        <AlertCircle className="h-6 w-6 text-danger" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium">{error}</p>
        {onRetry && <Button className="mt-4" size="sm" variant="outline" onClick={onRetry}>Try again</Button>}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center border border-border bg-card p-6 text-center">
        <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  return children;
}
