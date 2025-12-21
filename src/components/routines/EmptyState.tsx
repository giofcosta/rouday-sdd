'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Target, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  onAddRoutine: () => void;
}

export function EmptyState({ onAddRoutine }: EmptyStateProps) {
  const features = [
    { icon: Target, text: 'Set daily point goals' },
    { icon: TrendingUp, text: 'Track your progress' },
    { icon: CheckCircle2, text: 'Build lasting habits' },
  ];

  return (
    <Card className="border-dashed border-2 bg-gradient-to-br from-muted/30 to-muted/10">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
          <Zap className="h-10 w-10 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold text-center mb-2">
          Start Your Journey
        </h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Create your first routine to start tracking your daily goals and building better habits.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground bg-background/80 px-3 py-2 rounded-full"
            >
              <feature.icon className="h-4 w-4 text-primary" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        <Button onClick={onAddRoutine} size="lg" className="gap-2 shadow-lg">
          <Plus className="h-5 w-5" />
          Add Your First Routine
        </Button>
      </CardContent>
    </Card>
  );
}
