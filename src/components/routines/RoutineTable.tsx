'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
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

// Get current day index (0 = Monday, 6 = Sunday)
const getCurrentDayIndex = () => {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Mon (1) to 0, etc.
};

export function RoutineTable({
  routines,
  totals,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
}: RoutineTableProps) {
  const currentDayIndex = getCurrentDayIndex();

  return (
    <Card className="hidden md:block overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[200px] font-semibold">Routine</TableHead>
              <TableHead className="text-center w-[60px] font-semibold">AP</TableHead>
              <TableHead className="text-center w-[60px] font-semibold">Target</TableHead>
              {DAYS_OF_WEEK.map((day, index) => (
                <TableHead 
                  key={day} 
                  className={`text-center w-[100px] capitalize font-semibold ${
                    index === currentDayIndex 
                      ? 'bg-primary/10 text-primary' 
                      : ''
                  }`}
                >
                  {day.slice(0, 3)}
                </TableHead>
              ))}
              <TableHead className="text-center w-[80px] font-semibold">Score</TableHead>
              <TableHead className="w-[150px] font-semibold">Notes</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routines.map((routine, index) => (
              <RoutineRow
                key={routine.id}
                routine={routine}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onEdit={() => onEdit(routine)}
                onDelete={() => onDelete(routine.id)}
                isEven={index % 2 === 0}
                currentDayIndex={currentDayIndex}
              />
            ))}
            <TotalsRow totals={totals} currentDayIndex={currentDayIndex} />
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
