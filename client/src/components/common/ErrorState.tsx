import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] border rounded-xl bg-destructive/5 text-destructive border-destructive/20">
      <AlertTriangle className="h-10 w-10 mb-4" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 mb-6 text-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
          Try Again
        </Button>
      )}
    </div>
  );
}
