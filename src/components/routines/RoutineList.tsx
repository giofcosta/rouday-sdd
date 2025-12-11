'use client';

import { RoutineTable } from './RoutineTable';
import { RoutineCard } from './RoutineCard';
import type { RoutineWithWeeklyData, DayOfWeek } from '@/types';

interface RoutineListProps {
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

export function RoutineList({
  routines,
  totals,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
}: RoutineListProps) {
  return (
    <>
      {/* Desktop Table View */}
      <RoutineTable
        routines={routines}
        totals={totals}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onEdit={() => onEdit(routine)}
            onDelete={() => onDelete(routine.id)}
          />
        ))}
        
        {/* Mobile Totals Card */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-bold mb-2">Weekly Totals</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total AP:</span>
              <span className="ml-2 font-mono">{totals.totalAP}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Target:</span>
              <span className="ml-2 font-mono">{totals.totalAPW}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Results:</span>
              <span
                className={`ml-2 font-mono font-bold ${
                  totals.totalWR >= totals.totalAPW ? 'text-success' : 'text-destructive'
                }`}
              >
                {totals.totalWR}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
