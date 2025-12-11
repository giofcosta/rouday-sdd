import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWeekStart } from '@/lib/utils';
import type { DayOfWeek } from '@/types';

// POST /api/weekly-data/[routineId]/decrement - Decrement a day's value
export async function POST(
  request: NextRequest,
  { params }: { params: { routineId: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { day } = body as { day: DayOfWeek };

    if (!day || !['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(day)) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
    }

    const weekStartStr = getWeekStart(new Date());

    // Check if record exists
    const { data: existing } = await supabase
      .from('weekly_data')
      .select('*')
      .eq('routine_id', params.routineId)
      .eq('week_start', weekStartStr)
      .single();

    if (!existing) {
      // No record, nothing to decrement (can't go below 0)
      return NextResponse.json({
        routine_id: params.routineId,
        week_start: weekStartStr,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      });
    }

    // Decrement existing value (but not below 0)
    const currentValue = existing[day] || 0;
    const newValue = Math.max(0, currentValue - 1);

    const { data, error } = await supabase
      .from('weekly_data')
      .update({ [day]: newValue })
      .eq('routine_id', params.routineId)
      .eq('week_start', weekStartStr)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error decrementing weekly data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
