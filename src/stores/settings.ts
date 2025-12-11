import { create } from 'zustand';
import type { UserSettings } from '@/types';
import { withRetry } from '@/lib/api-retry';

interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await withRetry(() => fetch('/api/settings'));
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      set({ settings: data.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateSettings: async (updates) => {
    const { settings } = get();
    if (!settings) return;

    const originalSettings = { ...settings };

    // Optimistic update
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...updates } : null,
    }));

    try {
      const response = await withRetry(() =>
        fetch('/api/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }
      const data = await response.json();
      set({ settings: data.data });
    } catch (error) {
      // Revert on failure
      set({ settings: originalSettings, error: (error as Error).message });
      throw error;
    }
  },
}));
