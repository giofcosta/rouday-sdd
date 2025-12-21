'use client';

import { useState } from 'react';
import { useRoutines } from '@/hooks/useRoutines';
import { useSettings } from '@/hooks/useSettings';
import { RoutineList } from '@/components/routines/RoutineList';
import { StatsPanel } from '@/components/routines/StatsPanel';
import { EmptyState } from '@/components/routines/EmptyState';
import { RoutineFormDialog } from '@/components/routines/RoutineFormDialog';
import { DeleteRoutineDialog } from '@/components/routines/DeleteRoutineDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Loader2, Calendar, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { RoutineWithWeeklyData } from '@/types';

export default function DashboardPage() {
  const { routines, isLoading, totals, incrementDay, decrementDay, deleteRoutine } =
    useRoutines();
  const { settings } = useSettings();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineWithWeeklyData | null>(null);
  const [deletingRoutine, setDeletingRoutine] = useState<RoutineWithWeeklyData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (routine: RoutineWithWeeklyData) => {
    setEditingRoutine(routine);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (routineId: string) => {
    const routine = routines.find((r) => r.id === routineId);
    if (routine) {
      setDeletingRoutine(routine);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRoutine) return;
    setIsDeleting(true);
    try {
      await deleteRoutine(deletingRoutine.id);
      toast({
        title: 'Routine deleted',
        description: `"${deletingRoutine.name}" has been deleted.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete routine. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeletingRoutine(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRoutine(null);
  };

  // Calculate week progress
  const currentDay = new Date().getDay();
  const daysIntoWeek = currentDay === 0 ? 7 : currentDay;
  const weekProgress = Math.round((daysIntoWeek / 7) * 100);
  
  // Calculate achievement rate
  const achievementRate = totals.totalAPW > 0 
    ? Math.round((totals.totalWR / totals.totalAPW) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your routines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Weekly Routines
          </h1>
          <p className="text-muted-foreground">
            Track your daily goals and build better habits
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="lg" className="gap-2 shadow-lg">
          <Plus className="h-5 w-5" />
          Add Routine
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Week Progress</p>
              <p className="text-2xl font-bold">{weekProgress}%</p>
              <p className="text-xs text-muted-foreground">Day {daysIntoWeek} of 7</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Points Earned</p>
              <p className="text-2xl font-bold">{totals.totalWR}</p>
              <p className="text-xs text-muted-foreground">of {totals.totalAPW} target</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-br ${achievementRate >= 100 ? 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20' : achievementRate >= 50 ? 'from-amber-500/10 to-amber-600/5 border-amber-500/20' : 'from-red-500/10 to-red-600/5 border-red-500/20'}`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-full ${achievementRate >= 100 ? 'bg-emerald-500/20' : achievementRate >= 50 ? 'bg-amber-500/20' : 'bg-red-500/20'}`}>
              <TrendingUp className={`h-6 w-6 ${achievementRate >= 100 ? 'text-emerald-600 dark:text-emerald-400' : achievementRate >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievement</p>
              <p className="text-2xl font-bold">{achievementRate}%</p>
              <p className="text-xs text-muted-foreground">{routines.length} routine{routines.length !== 1 ? 's' : ''}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Panel */}
      <StatsPanel settings={settings} totals={totals} />

      {/* Routine List or Empty State */}
      {routines.length === 0 ? (
        <EmptyState onAddRoutine={() => setIsDialogOpen(true)} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Routines</h2>
            <p className="text-sm text-muted-foreground">
              Click +/- to adjust daily points
            </p>
          </div>
          <RoutineList
            routines={routines}
            totals={totals}
            onIncrement={incrementDay}
            onDecrement={decrementDay}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {/* Form Dialog */}
      <RoutineFormDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        routine={editingRoutine}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteRoutineDialog
        open={!!deletingRoutine}
        onClose={() => setDeletingRoutine(null)}
        onConfirm={handleDeleteConfirm}
        routineName={deletingRoutine?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
