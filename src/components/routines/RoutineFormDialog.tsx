'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { createRoutineSchema, type CreateRoutineInput } from '@/lib/validations/routine';
import { useRoutines } from '@/hooks/useRoutines';
import { useToast } from '@/hooks/use-toast';
import type { RoutineWithWeeklyData } from '@/types';

interface RoutineFormDialogProps {
  open: boolean;
  onClose: () => void;
  routine?: RoutineWithWeeklyData | null;
}

export function RoutineFormDialog({ open, onClose, routine }: RoutineFormDialogProps) {
  const { createRoutine, updateRoutine, isLoading } = useRoutines();
  const { toast } = useToast();
  const isEditing = !!routine;

  const form = useForm<CreateRoutineInput>({
    resolver: zodResolver(createRoutineSchema),
    defaultValues: {
      name: '',
      daily_average: 1,
      comments: '',
    },
  });

  // Reset form when dialog opens/closes or routine changes
  useEffect(() => {
    if (open) {
      if (routine) {
        form.reset({
          name: routine.name,
          daily_average: routine.daily_average,
          comments: routine.comments || '',
        });
      } else {
        form.reset({
          name: '',
          daily_average: 1,
          comments: '',
        });
      }
    }
  }, [open, routine, form]);

  const onSubmit = async (data: CreateRoutineInput) => {
    try {
      if (isEditing && routine) {
        await updateRoutine(routine.id, data);
        toast({
          title: 'Routine updated',
          description: `"${data.name}" has been updated successfully.`,
        });
      } else {
        await createRoutine(data);
        toast({
          title: 'Routine created',
          description: `"${data.name}" has been added to your routines.`,
        });
      }
      onClose();
    } catch {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} routine. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Routine' : 'Add New Routine'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your routine details below.'
              : 'Create a new routine to track your daily goals.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Exercise, Reading, Coding" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your routine a descriptive name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="daily_average"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Target (AP)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={24}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    How many points per day do you want to achieve?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this routine..."
                      className="resize-none"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Routine'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
