'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings';
import { useRoutinesStore } from '@/stores/routines';

export function useSettings() {
  const { settings, isLoading, error, fetchSettings, updateSettings } = useSettingsStore();
  const { setWorkDays } = useRoutinesStore();

  // Sync work days to routines store when settings change
  useEffect(() => {
    if (settings?.work_days) {
      setWorkDays(settings.work_days);
    }
  }, [settings?.work_days, setWorkDays]);

  // Calculate derived stats
  const stats = settings
    ? {
        offHoursDaily: 24 - settings.work_hours_day,
        availableWorkHoursWeek: settings.work_hours_day * settings.work_days,
      }
    : null;

  return {
    settings,
    isLoading,
    error,
    stats,
    fetchSettings,
    updateSettings,
  };
}
