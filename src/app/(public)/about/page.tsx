import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">About Routine</h1>
          <p className="text-lg text-muted-foreground">
            Building better habits through gamification and accountability.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
          <p className="mb-4 text-muted-foreground">
            Routine was built to solve a simple problem: staying consistent with daily tasks is hard. 
            Traditional to-do lists and habit trackers often feel like a chore, and it&apos;s easy to 
            lose motivation when you can&apos;t see your progress clearly.
          </p>
          <p className="text-muted-foreground">
            We believe that gamification and visual feedback can transform how you approach your 
            daily routines. By turning your tasks into a points-based system with weekly goals and 
            real-time calculations, we make consistency not just achievable, but enjoyable.
          </p>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Simplicity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No complex features or overwhelming options. Just what you need to track and improve.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your data is yours. We don&apos;t sell it, share it, or use it for anything but your benefit.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Continuous Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We&apos;re always working to make Routine better based on user feedback.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">How It Works</h2>
          <ol className="space-y-4 text-muted-foreground">
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span>
              <div>
                <strong className="text-foreground">Create your routines</strong> — Define the daily 
                tasks you want to track and set target points for each.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span>
              <div>
                <strong className="text-foreground">Log your progress daily</strong> — Use the +/- 
                buttons to record your accomplishments for each day of the week.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</span>
              <div>
                <strong className="text-foreground">Watch your results</strong> — See your weekly 
                totals update in real-time with color-coded feedback showing whether you&apos;re hitting your goals.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">4</span>
              <div>
                <strong className="text-foreground">Start fresh each week</strong> — Every Monday, 
                your daily points reset automatically, giving you a new opportunity to achieve your goals.
              </div>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
