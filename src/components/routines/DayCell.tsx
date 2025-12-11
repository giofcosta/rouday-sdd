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
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8 min-w-[44px] min-h-[44px]', // 44px minimum for touch targets
          'touch-manipulation', // Optimize for touch
          'active:scale-95 transition-transform' // Micro-interaction
        )}
        onClick={onDecrement}
        disabled={disabled || value <= 0}
        aria-label="Decrease points"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-6 text-center font-mono text-sm">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8 min-w-[44px] min-h-[44px]', // 44px minimum for touch targets
          'touch-manipulation', // Optimize for touch
          'active:scale-95 transition-transform' // Micro-interaction
        )}
        onClick={onIncrement}
        disabled={disabled}
        aria-label="Increase points"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
