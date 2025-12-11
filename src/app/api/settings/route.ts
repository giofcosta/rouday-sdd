import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateSettingsSchema } from '@/lib/validations/settings';

// GET /api/settings - Get user settings
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get settings or create default ones
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsError && settingsError.code === 'PGRST116') {
      // No settings found, create defaults
      const { data: newSettings, error: insertError } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          available_days: 7,
          work_days: 5,
          work_hours_day: 8,
          timezone: 'UTC',
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      return NextResponse.json({ data: newSettings });
    } else if (settingsError) {
      return NextResponse.json({ error: settingsError.message }, { status: 500 });
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/settings - Update user settings
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();

    // Get current settings for cross-field validation
    const { data: currentSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Merge with current settings for validation
    const mergedData = {
      available_days: body.available_days ?? currentSettings?.available_days ?? 7,
      work_days: body.work_days ?? currentSettings?.work_days ?? 5,
      work_hours_day: body.work_hours_day ?? currentSettings?.work_hours_day ?? 8,
      timezone: body.timezone ?? currentSettings?.timezone ?? 'UTC',
    };

    const validation = updateSettingsSchema.safeParse(mergedData);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Ensure work_days doesn't exceed available_days
    if (validation.data.work_days && validation.data.available_days) {
      if (validation.data.work_days > validation.data.available_days) {
        return NextResponse.json(
          { error: 'Work days cannot exceed available days' },
          { status: 400 }
        );
      }
    }

    // Update settings
    const { data: settings, error: updateError } = await supabase
      .from('user_settings')
      .update(body)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('PATCH /api/settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
