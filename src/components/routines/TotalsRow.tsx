'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DAYS_OF_WEEK } from '@/types';

interface TotalsRowProps {
  totals: {
    totalAP: number;
    totalAPW: number;
    totalWR: number;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  currentDayIndex?: number;
}

export function TotalsRow({ totals, currentDayIndex = -1 }: TotalsRowProps) {
  const isTargetMet = totals.totalWR >= totals.totalAPW;
  const progressPercent = totals.totalAPW > 0 ? Math.round((totals.totalWR / totals.totalAPW) * 100) : 0;

  return (
    <TableRow className="bg-muted/70 font-bold border-t-2">
      <TableCell className="text-base">Totals</TableCell>
      <TableCell className="text-center font-mono">{totals.totalAP}</TableCell>
      <TableCell className="text-center font-mono">{totals.totalAPW}</TableCell>
      {DAYS_OF_WEEK.map((day, index) => (
        <TableCell 
          key={day} 
          className={cn(
            "text-center font-mono",
            index === currentDayIndex && "bg-primary/10"
          )}
        >
          {totals[day]}
        </TableCell>
      ))}
      <TableCell className="text-center">
        <div className={cn(
          "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold",
          isTargetMet 
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
            : progressPercent >= 50
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        )}>
          {totals.totalWR}
          <span className="text-xs font-normal opacity-70">/{totals.totalAPW}</span>
        </div>
      </TableCell>
      <TableCell colSpan={2} className="text-right text-sm font-normal text-muted-foreground">
        {progressPercent}% achieved
      </TableCell>
    </TableRow>
  );
}
