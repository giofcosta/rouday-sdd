'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DayCell } from './DayCell';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RoutineWithWeeklyData, DayOfWeek } from '@/types';
import { DAYS_OF_WEEK } from '@/types';

interface RoutineCardProps {
  routine: RoutineWithWeeklyData;
  onIncrement: (routineId: string, day: DayOfWeek) => void;
  onDecrement: (routineId: string, day: DayOfWeek) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function RoutineCard({
  routine,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
}: RoutineCardProps) {
  const isTargetMet = routine.wr >= routine.apw;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{routine.name}</CardTitle>
            {routine.comments && (
              <p className="text-sm text-muted-foreground">{routine.comments}</p>
            )}
          </div>
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
        </div>
        <div className="flex gap-2 pt-2">
          <Badge variant="outline">AP: {routine.daily_average}</Badge>
          <Badge variant="outline">Target: {routine.apw}</Badge>
          <Badge
            variant={isTargetMet ? 'default' : 'destructive'}
            className={cn(isTargetMet && 'bg-success hover:bg-success/90')}
          >
            WR: {routine.wr}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground capitalize mb-1">
                {day.slice(0, 3)}
              </span>
              <DayCell
                value={routine.weekly_data?.[day] ?? 0}
                onIncrement={() => onIncrement(routine.id, day)}
                onDecrement={() => onDecrement(routine.id, day)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
