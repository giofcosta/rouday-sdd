import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Smartphone, 
  Zap, 
  Shield 
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Set Daily Targets',
    description: 'Define daily point goals for each routine and watch your weekly targets calculate automatically.',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Color-coded results show you instantly whether you\'re meeting your goals or need to push harder.',
  },
  {
    icon: Calendar,
    title: 'Weekly Reset',
    description: 'Start fresh each week while maintaining your routine definitions and settings.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access your routines from any device with our responsive, touch-optimized interface.',
  },
  {
    icon: Zap,
    title: 'Instant Updates',
    description: 'See your totals and statistics update in real-time as you log your daily progress.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security. Only you can see your routines.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Build Better Habits
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Simple yet powerful tools to help you stay consistent and achieve your goals week after week.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
