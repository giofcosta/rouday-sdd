'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DayCell } from './DayCell';
import { MoreHorizontal, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { RoutineWithWeeklyData, DayOfWeek } from '@/types';
import { DAYS_OF_WEEK } from '@/types';

interface RoutineRowProps {
  routine: RoutineWithWeeklyData;
  onIncrement: (routineId: string, day: DayOfWeek) => void;
  onDecrement: (routineId: string, day: DayOfWeek) => void;
  onEdit: () => void;
  onDelete: () => void;
  isEven?: boolean;
  currentDayIndex?: number;
}

export function RoutineRow({
  routine,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
  isEven = false,
  currentDayIndex = -1,
}: RoutineRowProps) {
  const isTargetMet = routine.wr >= routine.apw;
  const progressPercent = routine.apw > 0 ? Math.round((routine.wr / routine.apw) * 100) : 0;

  return (
    <TableRow className={cn(
      "transition-colors",
      isEven ? "bg-muted/20" : "",
      isTargetMet && "bg-green-500/5"
    )}>
      {/* Routine Name */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {isTargetMet && (
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          )}
          <span className="truncate">{routine.name}</span>
        </div>
      </TableCell>

      {/* Daily Average (AP) */}
      <TableCell className="text-center font-mono">{routine.daily_average}</TableCell>

      {/* Week Target (APW) */}
      <TableCell className="text-center font-mono">{routine.apw}</TableCell>

      {/* Day cells */}
      {DAYS_OF_WEEK.map((day, index) => (
        <TableCell 
          key={day} 
          className={cn(
            "p-2",
            index === currentDayIndex && "bg-primary/5"
          )}
        >
          <DayCell
            value={routine.weekly_data?.[day] ?? 0}
            onIncrement={() => onIncrement(routine.id, day)}
            onDecrement={() => onDecrement(routine.id, day)}
          />
        </TableCell>
      ))}

      {/* Week Results (WR) - color coded with progress */}
      <TableCell className="text-center">
        <div className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold",
          isTargetMet 
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
            : progressPercent >= 50
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        )}>
          {routine.wr}
        </div>
      </TableCell>

      {/* Comments */}
      <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
        {routine.comments || '-'}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
