'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RoutineRow } from './RoutineRow';
import { TotalsRow } from './TotalsRow';
import type { RoutineWithWeeklyData, DayOfWeek } from '@/types';
import { DAYS_OF_WEEK } from '@/types';

interface RoutineTableProps {
  routines: RoutineWithWeeklyData[];
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
  onIncrement: (routineId: string, day: DayOfWeek) => void;
  onDecrement: (routineId: string, day: DayOfWeek) => void;
  onEdit: (routine: RoutineWithWeeklyData) => void;
  onDelete: (routineId: string) => void;
}

export function RoutineTable({
  routines,
  totals,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
}: RoutineTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Routine</TableHead>
            <TableHead className="text-center w-[60px]">AP</TableHead>
            <TableHead className="text-center w-[60px]">APW</TableHead>
            {DAYS_OF_WEEK.map((day) => (
              <TableHead key={day} className="text-center w-[80px] capitalize">
                {day.slice(0, 3)}
              </TableHead>
            ))}
            <TableHead className="text-center w-[80px]">WR</TableHead>
            <TableHead className="w-[150px]">Comments</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routines.map((routine) => (
            <RoutineRow
              key={routine.id}
              routine={routine}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onEdit={() => onEdit(routine)}
              onDelete={() => onDelete(routine.id)}
            />
          ))}
          <TotalsRow totals={totals} />
        </TableBody>
      </Table>
    </div>
  );
}
