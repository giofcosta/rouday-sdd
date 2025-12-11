'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Target } from 'lucide-react';

interface EmptyStateProps {
  onAddRoutine: () => void;
}

export function EmptyState({ onAddRoutine }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Target className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle>No routines yet</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Create your first routine to start tracking your daily goals and building better habits.
        </p>
        <Button onClick={onAddRoutine}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Routine
        </Button>
      </CardContent>
    </Card>
  );
}
