'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Dashboard Error</h2>
        <p className="text-muted-foreground max-w-md">
          We encountered a problem loading your dashboard. Your data is safe - please try refreshing.
        </p>
        {process.env.NODE_ENV === 'development' && error.message && (
          <pre className="mt-2 max-w-lg overflow-auto rounded bg-muted p-2 text-xs">
            {error.message}
          </pre>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline" className="gap-2">
          <Home className="h-4 w-4" />
          Go home
        </Button>
      </div>
    </div>
  );
}
