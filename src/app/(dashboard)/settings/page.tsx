import { SettingsForm } from '@/components/settings/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your weekly schedule and preferences
        </p>
      </div>
      <div className="max-w-2xl">
        <SettingsForm />
      </div>
    </div>
  );
}
