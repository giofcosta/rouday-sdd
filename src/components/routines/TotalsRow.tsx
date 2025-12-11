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
}

export function TotalsRow({ totals }: TotalsRowProps) {
  const isTargetMet = totals.totalWR >= totals.totalAPW;

  return (
    <TableRow className="bg-muted/50 font-bold">
      <TableCell>Totals</TableCell>
      <TableCell className="text-center">{totals.totalAP}</TableCell>
      <TableCell className="text-center">{totals.totalAPW}</TableCell>
      {DAYS_OF_WEEK.map((day) => (
        <TableCell key={day} className="text-center">
          {totals[day]}
        </TableCell>
      ))}
      <TableCell
        className={cn(
          'text-center',
          isTargetMet ? 'text-success' : 'text-destructive'
        )}
      >
        {totals.totalWR}
      </TableCell>
      <TableCell colSpan={2} />
    </TableRow>
  );
}
