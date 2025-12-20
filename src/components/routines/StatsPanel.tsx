'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Briefcase, Battery, BarChart3 } from 'lucide-react';
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
  const hoursLeft = Math.max(0, totals.totalAP - totals.totalAPW);
  const capacityUsed = totals.totalAP > 0 ? Math.round((totals.totalAPW / totals.totalAP) * 100) : 0;
  const medianWorkPerDay =
    settings.available_days > 0
      ? (totals.totalAPW / settings.available_days).toFixed(1)
      : '0';

  const stats = [
    {
      label: 'Off Hours (Daily)',
      value: `${offHoursDaily}h`,
      description: `24 - ${settings.work_hours_day}h work`,
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Work Hours (Week)',
      value: `${availableWorkHoursWeek}h`,
      description: `${settings.work_hours_day}h × ${settings.work_days} days`,
      icon: Briefcase,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Capacity Left',
      value: `${hoursLeft}h`,
      description: `${totals.totalAP} - ${totals.totalAPW} allocated`,
      icon: Battery,
      color: hoursLeft > 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400',
      bgColor: hoursLeft > 0 ? 'bg-green-500/10' : 'bg-amber-500/10',
    },
    {
      label: 'Avg per Day',
      value: `${medianWorkPerDay}h`,
      description: `${totals.totalAPW}h / ${settings.available_days} days`,
      icon: BarChart3,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Weekly Overview</CardTitle>
          <span className="text-sm text-muted-foreground">
            {settings.available_days} days available
          </span>
        </div>
        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Capacity Used</span>
            <span className="font-medium">{capacityUsed}%</span>
          </div>
          <Progress value={capacityUsed} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
