'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayCellProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

export function DayCell({ value, onIncrement, onDecrement, disabled = false }: DayCellProps) {
  return (
    <div className="flex items-center justify-center gap-1 px-1 py-1 rounded-md bg-muted/30">
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'h-7 w-7 sm:h-8 sm:w-8',
          'touch-manipulation',
          'active:scale-95 transition-transform',
          'flex-shrink-0'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDecrement();
        }}
        disabled={disabled || value <= 0}
        aria-label="Decrease points"
        type="button"
      >
        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      <span className="w-5 sm:w-6 text-center font-mono text-sm tabular-nums">{value}</span>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'h-7 w-7 sm:h-8 sm:w-8',
          'touch-manipulation',
          'active:scale-95 transition-transform',
          'flex-shrink-0'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onIncrement();
        }}
        disabled={disabled}
        aria-label="Increase points"
        type="button"
      >
        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
}
