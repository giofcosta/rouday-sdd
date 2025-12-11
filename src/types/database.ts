// Database types generated from Supabase schema
// These types mirror the database tables

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          available_days: number;
          work_days: number;
          work_hours_day: number;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          available_days?: number;
          work_days?: number;
          work_hours_day?: number;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          available_days?: number;
          work_days?: number;
          work_hours_day?: number;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      routines: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          daily_average: number;
          comments: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          daily_average: number;
          comments?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          daily_average?: number;
          comments?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      weekly_data: {
        Row: {
          id: string;
          routine_id: string;
          week_start: string;
          monday: number;
          tuesday: number;
          wednesday: number;
          thursday: number;
          friday: number;
          saturday: number;
          sunday: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          routine_id: string;
          week_start: string;
          monday?: number;
          tuesday?: number;
          wednesday?: number;
          thursday?: number;
          friday?: number;
          saturday?: number;
          sunday?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          routine_id?: string;
          week_start?: string;
          monday?: number;
          tuesday?: number;
          wednesday?: number;
          thursday?: number;
          friday?: number;
          saturday?: number;
          sunday?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience type aliases
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert'];
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update'];

export type Routine = Database['public']['Tables']['routines']['Row'];
export type RoutineInsert = Database['public']['Tables']['routines']['Insert'];
export type RoutineUpdate = Database['public']['Tables']['routines']['Update'];

export type WeeklyData = Database['public']['Tables']['weekly_data']['Row'];
export type WeeklyDataInsert = Database['public']['Tables']['weekly_data']['Insert'];
export type WeeklyDataUpdate = Database['public']['Tables']['weekly_data']['Update'];
