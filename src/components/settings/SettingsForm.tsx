'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { updateSettingsSchema, type UpdateSettingsInput } from '@/lib/validations/settings';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';

export function SettingsForm() {
  const { settings, isLoading, updateSettings } = useSettings();
  const { toast } = useToast();

  const form = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      available_days: 7,
      work_days: 5,
      work_hours_day: 8,
    },
  });

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      form.reset({
        available_days: settings.available_days,
        work_days: settings.work_days,
        work_hours_day: settings.work_hours_day,
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: UpdateSettingsInput) => {
    // Validate work_days <= available_days
    if ((data.work_days ?? 0) > (data.available_days ?? 7)) {
      form.setError('work_days', {
        message: 'Work days cannot exceed available days',
      });
      return;
    }

    try {
      await updateSettings(data);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Configuration</CardTitle>
        <CardDescription>
          Configure your weekly schedule to calculate targets accurately
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="available_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Days (AD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={7}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    Days per week you&apos;re available for routines (1-7)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Days (WD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={7}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    Days per week you work on routines (must be ≤ AD)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_hours_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Hours per Day (WHD)</FormLabel>
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
                    Hours you dedicate to routines each day (1-24)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
