'use client';

import { useEffect } from 'react';
import { useRoutinesStore } from '@/stores/routines';
import { useSettingsStore } from '@/stores/settings';

export function useRoutines() {
  const {
    routines,
    isLoading,
    error,
    fetchRoutines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    incrementDay,
    decrementDay,
    setWorkDays,
  } = useRoutinesStore();

  const { settings } = useSettingsStore();

  // Sync work days from settings
  useEffect(() => {
    if (settings?.work_days) {
      setWorkDays(settings.work_days);
    }
  }, [settings?.work_days, setWorkDays]);

  // Calculate totals
  const totals = routines.reduce(
    (acc, routine) => {
      acc.totalAP += routine.daily_average;
      acc.totalAPW += routine.apw;
      acc.totalWR += routine.wr;
      if (routine.weekly_data) {
        acc.monday += routine.weekly_data.monday;
        acc.tuesday += routine.weekly_data.tuesday;
        acc.wednesday += routine.weekly_data.wednesday;
        acc.thursday += routine.weekly_data.thursday;
        acc.friday += routine.weekly_data.friday;
        acc.saturday += routine.weekly_data.saturday;
        acc.sunday += routine.weekly_data.sunday;
      }
      return acc;
    },
    {
      totalAP: 0,
      totalAPW: 0,
      totalWR: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    }
  );

  return {
    routines,
    isLoading,
    error,
    totals,
    fetchRoutines,
    createRoutine: addRoutine,
    updateRoutine,
    deleteRoutine,
    incrementDay,
    decrementDay,
  };
}
