import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, TrendingUp, Calendar } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>Build better habits, one day at a time</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Gamify Your
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {' '}
              Daily Routines
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Track your weekly progress with a points-based system. Set goals, earn points, 
            and watch your productivity soar with real-time calculations and visual feedback.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t pt-8 md:gap-16">
            <div className="flex flex-col items-center">
              <Target className="mb-2 h-6 w-6 text-primary" />
              <span className="text-2xl font-bold md:text-3xl">Track</span>
              <span className="text-sm text-muted-foreground">Daily Goals</span>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="mb-2 h-6 w-6 text-success" />
              <span className="text-2xl font-bold md:text-3xl">Grow</span>
              <span className="text-sm text-muted-foreground">Each Week</span>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="mb-2 h-6 w-6 text-primary" />
              <span className="text-2xl font-bold md:text-3xl">Reset</span>
              <span className="text-sm text-muted-foreground">Automatically</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
