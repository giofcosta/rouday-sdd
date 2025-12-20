'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DayCell } from './DayCell';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, Target, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
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
  const progressPercent = routine.apw > 0 ? Math.min(100, Math.round((routine.wr / routine.apw) * 100)) : 0;

  return (
    <Card className={cn(
      "w-full transition-all hover:shadow-md",
      isTargetMet && "ring-2 ring-green-500/20 bg-green-500/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate">{routine.name}</h3>
            {routine.comments && (
              <p className="text-sm text-muted-foreground line-clamp-2">{routine.comments}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 pt-3">
          <div className="flex items-center gap-1.5 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Daily:</span>
            <span className="font-medium">{routine.daily_average}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <TrendingUp className={cn(
              "h-4 w-4",
              isTargetMet ? "text-green-600" : "text-amber-600"
            )} />
            <span className={cn(
              "font-bold",
              isTargetMet ? "text-green-600" : "text-amber-600"
            )}>
              {routine.wr}/{routine.apw}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <Progress 
            value={progressPercent} 
            className={cn(
              "h-2",
              isTargetMet && "[&>div]:bg-green-500"
            )}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">{progressPercent}% complete</p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex flex-col items-center">
              <span className="text-[10px] font-medium text-muted-foreground uppercase mb-1">
                {day.slice(0, 2)}
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
