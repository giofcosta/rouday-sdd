'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserSettings } from '@/types';

interface StatsPanelProps {
  settings: UserSettings | null;
  totals: {
    totalAP: number;
    totalAPW: number;
    totalWR: number;
  };
}

export function StatsPanel({ settings, totals }: StatsPanelProps) {
  if (!settings) return null;

  // Calculate derived stats
  const offHoursDaily = 24 - settings.work_hours_day;
  const availableWorkHoursWeek = settings.work_hours_day * settings.work_days;
  const hoursLeft = totals.totalAP - totals.totalAPW;
  const medianWorkPerDay =
    settings.available_days > 0
      ? (totals.totalAPW / settings.available_days).toFixed(1)
      : '0';

  const stats = [
    {
      label: 'Off Hours (Daily)',
      value: `${offHoursDaily}h`,
      description: `24 - ${settings.work_hours_day}`,
    },
    {
      label: 'Work Hours (Week)',
      value: `${availableWorkHoursWeek}h`,
      description: `${settings.work_hours_day} × ${settings.work_days}`,
    },
    {
      label: 'Capacity Left',
      value: hoursLeft,
      description: `${totals.totalAP} - ${totals.totalAPW}`,
    },
    {
      label: 'Avg per Day',
      value: medianWorkPerDay,
      description: `${totals.totalAPW} / ${settings.available_days}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
