import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] border border-dashed border-border/60 rounded-2xl relative overflow-hidden bg-card/30">
      <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border/50 shadow-sm mb-6 relative z-10">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="text-[20px] font-bold tracking-tight text-foreground relative z-10">{title}</h2>
      <p className="mt-3 mb-8 text-[14.5px] leading-relaxed text-muted-foreground max-w-[340px] mx-auto relative z-10">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" className="relative z-10 font-mono tracking-tight text-[13.5px]" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
