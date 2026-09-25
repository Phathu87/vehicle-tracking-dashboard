import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Fleet Drive UI error', error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="min-h-screen grid place-items-center bg-background p-6">
        <section className="w-full max-w-md border border-border bg-card p-6 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-danger" aria-hidden="true" />
          <h1 className="mt-4 font-heading text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The interface could not finish rendering. Reload to try again.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            <RotateCcw className="h-4 w-4" />
            Reload
          </Button>
        </section>
      </main>
    );
  }
}
