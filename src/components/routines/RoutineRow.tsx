'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DayCell } from './DayCell';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
}

export function RoutineRow({
  routine,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
}: RoutineRowProps) {
  const isTargetMet = routine.wr >= routine.apw;

  return (
    <TableRow>
      {/* Routine Name */}
      <TableCell className="font-medium">{routine.name}</TableCell>

      {/* Daily Average (AP) */}
      <TableCell className="text-center">{routine.daily_average}</TableCell>

      {/* Week Target (APW) */}
      <TableCell className="text-center">{routine.apw}</TableCell>

      {/* Day cells */}
      {DAYS_OF_WEEK.map((day) => (
        <TableCell key={day} className="p-1">
          <DayCell
            value={routine.weekly_data?.[day] ?? 0}
            onIncrement={() => onIncrement(routine.id, day)}
            onDecrement={() => onDecrement(routine.id, day)}
          />
        </TableCell>
      ))}

      {/* Week Results (WR) - color coded */}
      <TableCell
        className={cn(
          'text-center font-bold',
          isTargetMet ? 'text-success' : 'text-destructive'
        )}
      >
        {routine.wr}
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
