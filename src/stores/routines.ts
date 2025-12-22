import { create } from 'zustand';
import type { RoutineWithWeeklyData, DayOfWeek, WeeklyData } from '@/types';
import { calculateWeekResults, calculateAPW, getWeekStart } from '@/lib/utils';
import { withRetry } from '@/lib/api-retry';

interface RoutinesState {
  routines: RoutineWithWeeklyData[];
  isLoading: boolean;
  error: string | null;
  workDays: number; // From user settings, used for APW calculation
  hasFetched: boolean; // Track if initial fetch has been done

  // Actions
  setWorkDays: (workDays: number) => void;
  fetchRoutines: () => Promise<void>;
  addRoutine: (routine: { name: string; daily_average: number; comments?: string | null }) => Promise<void>;
  updateRoutine: (id: string, updates: { name?: string; daily_average?: number; comments?: string | null }) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  incrementDay: (routineId: string, day: DayOfWeek) => Promise<void>;
  decrementDay: (routineId: string, day: DayOfWeek) => Promise<void>;
  updateDayPoints: (routineId: string, day: DayOfWeek, value: number) => Promise<void>;
}

// Helper to calculate derived fields
function enrichRoutine(routine: RoutineWithWeeklyData, workDays: number): RoutineWithWeeklyData {
  const apw = calculateAPW(routine.daily_average, workDays);
  const wr = routine.weekly_data ? calculateWeekResults(routine.weekly_data) : 0;
  return { ...routine, apw, wr };
}

export const useRoutinesStore = create<RoutinesState>((set, get) => ({
  routines: [],
  isLoading: false,
  error: null,
  workDays: 5, // Default
  hasFetched: false,

  setWorkDays: (workDays) => {
    set((state) => ({
      workDays,
      routines: state.routines.map((r) => enrichRoutine(r, workDays)),
    }));
  },

  fetchRoutines: async () => {
    // Prevent duplicate fetches
    if (get().hasFetched || get().isLoading) {
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await withRetry(() => fetch('/api/routines'));
      if (!response.ok) {
        throw new Error('Failed to fetch routines');
      }
      const data = await response.json();
      const workDays = get().workDays;
      set({
        routines: data.data.map((r: RoutineWithWeeklyData) => enrichRoutine(r, workDays)),
        isLoading: false,
        hasFetched: true,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addRoutine: async (routine) => {
    set({ isLoading: true, error: null });
    try {
      const response = await withRetry(() =>
        fetch('/api/routines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routine),
        })
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add routine');
      }
      const data = await response.json();
      const workDays = get().workDays;
      set((state) => ({
        routines: [...state.routines, enrichRoutine(data.data, workDays)],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateRoutine: async (id, updates) => {
    const { routines, workDays } = get();
    const originalRoutine = routines.find((r) => r.id === id);
    if (!originalRoutine) return;

    // Optimistic update
    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === id ? enrichRoutine({ ...r, ...updates }, workDays) : r
      ),
    }));

    try {
      const response = await withRetry(() =>
        fetch(`/api/routines/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
      );
      if (!response.ok) {
        throw new Error('Failed to update routine');
      }
    } catch (error) {
      // Revert on failure
      set((state) => ({
        routines: state.routines.map((r) => (r.id === id ? originalRoutine : r)),
        error: (error as Error).message,
      }));
      throw error;
    }
  },

  deleteRoutine: async (id) => {
    const { routines } = get();
    const originalRoutines = [...routines];

    // Optimistic update
    set((state) => ({
      routines: state.routines.filter((r) => r.id !== id),
    }));

    try {
      const response = await withRetry(() =>
        fetch(`/api/routines/${id}`, {
          method: 'DELETE',
        })
      );
      if (!response.ok) {
        throw new Error('Failed to delete routine');
      }
    } catch (error) {
      // Revert on failure
      set({ routines: originalRoutines, error: (error as Error).message });
      throw error;
    }
  },

  incrementDay: async (routineId, day) => {
    const { routines, workDays } = get();
    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return;

    const currentValue = routine.weekly_data?.[day] ?? 0;
    const newValue = currentValue + 1;

    // Optimistic update
    const updatedWeeklyData: WeeklyData = routine.weekly_data
      ? { ...routine.weekly_data, [day]: newValue }
      : {
          id: '',
          routine_id: routineId,
          week_start: getWeekStart(),
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
          [day]: newValue,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === routineId
          ? enrichRoutine({ ...r, weekly_data: updatedWeeklyData }, workDays)
          : r
      ),
    }));

    try {
      const response = await withRetry(() =>
        fetch(`/api/weekly-data/${routineId}/increment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day }),
        })
      );
      if (!response.ok) {
        throw new Error('Failed to increment day');
      }
    } catch (error) {
      // Revert on failure
      set((state) => ({
        routines: state.routines.map((r) => (r.id === routineId ? routine : r)),
        error: (error as Error).message,
      }));
    }
  },

  decrementDay: async (routineId, day) => {
    const { routines, workDays } = get();
    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return;

    const currentValue = routine.weekly_data?.[day] ?? 0;
    if (currentValue <= 0) return; // Cannot go below 0

    const newValue = currentValue - 1;

    // Optimistic update
    const updatedWeeklyData: WeeklyData = routine.weekly_data
      ? { ...routine.weekly_data, [day]: newValue }
      : {
          id: '',
          routine_id: routineId,
          week_start: getWeekStart(),
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
          [day]: newValue,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === routineId
          ? enrichRoutine({ ...r, weekly_data: updatedWeeklyData }, workDays)
          : r
      ),
    }));

    try {
      const response = await withRetry(() =>
        fetch(`/api/weekly-data/${routineId}/decrement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day }),
        })
      );
      if (!response.ok) {
        throw new Error('Failed to decrement day');
      }
    } catch (error) {
      // Revert on failure
      set((state) => ({
        routines: state.routines.map((r) => (r.id === routineId ? routine : r)),
        error: (error as Error).message,
      }));
    }
  },

  updateDayPoints: async (routineId, day, value) => {
    const { routines, workDays } = get();
    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return;

    if (value < 0) return; // Cannot go below 0

    // Optimistic update
    const updatedWeeklyData: WeeklyData = routine.weekly_data
      ? { ...routine.weekly_data, [day]: value }
      : {
          id: '',
          routine_id: routineId,
          week_start: getWeekStart(),
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
          [day]: value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === routineId
          ? enrichRoutine({ ...r, weekly_data: updatedWeeklyData }, workDays)
          : r
      ),
    }));

    try {
      const response = await withRetry(() =>
        fetch(`/api/weekly-data/${routineId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day, value }),
        })
      );
      if (!response.ok) {
        throw new Error('Failed to update day points');
      }
    } catch (error) {
      // Revert on failure
      set((state) => ({
        routines: state.routines.map((r) => (r.id === routineId ? routine : r)),
        error: (error as Error).message,
      }));
    }
  },
}));
