import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createRoutineSchema } from '@/lib/validations/routine';
import { getWeekStart } from '@/lib/utils';

// GET /api/routines - Get all routines for the current user with weekly data
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get routines with current week's data
    const weekStart = getWeekStart();
    const { data: routines, error: routinesError } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });

    if (routinesError) {
      return NextResponse.json({ error: routinesError.message }, { status: 500 });
    }

    // Get weekly data for all routines
    const routineIds = routines.map((r) => r.id);
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('weekly_data')
      .select('*')
      .in('routine_id', routineIds)
      .eq('week_start', weekStart);

    if (weeklyError) {
      return NextResponse.json({ error: weeklyError.message }, { status: 500 });
    }

    // Merge routines with weekly data
    const routinesWithWeeklyData = routines.map((routine) => ({
      ...routine,
      weekly_data: weeklyData?.find((wd) => wd.routine_id === routine.id) || null,
    }));

    return NextResponse.json({ data: routinesWithWeeklyData });
  } catch (error) {
    console.error('GET /api/routines error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/routines - Create a new routine
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createRoutineSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Get the max sort_order for the user
    const { data: maxOrderData } = await supabase
      .from('routines')
      .select('sort_order')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextSortOrder = (maxOrderData?.sort_order ?? -1) + 1;

    // Insert the routine
    const { data: routine, error: insertError } = await supabase
      .from('routines')
      .insert({
        user_id: user.id,
        name: validation.data.name,
        daily_average: validation.data.daily_average,
        comments: validation.data.comments ?? null,
        sort_order: nextSortOrder,
      })
      .select()
      .single();

    if (insertError) {
      // Handle unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'A routine with this name already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Create empty weekly data for the current week
    const weekStart = getWeekStart();
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('weekly_data')
      .insert({
        routine_id: routine.id,
        week_start: weekStart,
      })
      .select()
      .single();

    if (weeklyError) {
      console.error('Failed to create weekly data:', weeklyError);
    }

    return NextResponse.json(
      { data: { ...routine, weekly_data: weeklyData || null } },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/routines error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
