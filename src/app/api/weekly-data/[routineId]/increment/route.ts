import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWeekStart } from '@/lib/utils';
import type { DayOfWeek } from '@/types';

// POST /api/weekly-data/[routineId]/increment - Increment a day's value
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

    let result;
    if (existing) {
      // Increment existing value
      const newValue = (existing[day] || 0) + 1;
      result = await supabase
        .from('weekly_data')
        .update({ [day]: newValue })
        .eq('routine_id', params.routineId)
        .eq('week_start', weekStartStr)
        .select()
        .single();
    } else {
      // Create new record with day set to 1
      result = await supabase
        .from('weekly_data')
        .insert({
          routine_id: params.routineId,
          week_start: weekStartStr,
          [day]: 1,
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error incrementing weekly data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
