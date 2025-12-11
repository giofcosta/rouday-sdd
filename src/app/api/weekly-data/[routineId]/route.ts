import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { weeklyDataSchema } from '@/lib/validations/weekly-data';
import { getWeekStart } from '@/lib/utils';

// GET /api/weekly-data/[routineId] - Get weekly data for a routine
export async function GET(
  request: NextRequest,
  { params }: { params: { routineId: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const weekStart = getWeekStart(new Date());

    const { data, error } = await supabase
      .from('weekly_data')
      .select('*')
      .eq('routine_id', params.routineId)
      .eq('week_start', weekStart)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Return default values if no data exists
    if (!data) {
      return NextResponse.json({
        routine_id: params.routineId,
        week_start: weekStart,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/weekly-data/[routineId] - Update weekly data
export async function PATCH(
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
    const validatedData = weeklyDataSchema.partial().parse(body);

    const weekStart = getWeekStart(new Date());
    const weekStartStr = weekStart;

    // Check if record exists
    const { data: existing } = await supabase
      .from('weekly_data')
      .select('id')
      .eq('routine_id', params.routineId)
      .eq('week_start', weekStartStr)
      .single();

    let result;
    if (existing) {
      // Update existing record
      result = await supabase
        .from('weekly_data')
        .update(validatedData)
        .eq('routine_id', params.routineId)
        .eq('week_start', weekStartStr)
        .select()
        .single();
    } else {
      // Create new record
      result = await supabase
        .from('weekly_data')
        .insert({
          routine_id: params.routineId,
          week_start: weekStartStr,
          ...validatedData,
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating weekly data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
