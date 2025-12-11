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
import { Plus, Loader2 } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Routines</h1>
          <p className="text-muted-foreground">
            Track your daily goals and build better habits
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Routine
        </Button>
      </div>

      {/* Stats Panel */}
      <StatsPanel settings={settings} totals={totals} />

      {/* Routine List or Empty State */}
      {routines.length === 0 ? (
        <EmptyState onAddRoutine={() => setIsDialogOpen(true)} />
      ) : (
        <RoutineList
          routines={routines}
          totals={totals}
          onIncrement={incrementDay}
          onDecrement={decrementDay}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
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
