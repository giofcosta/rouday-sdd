import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is Routine?',
    answer: 'Routine is a gamified habit tracking application that helps you build better daily routines through a points-based system. You set daily targets for your tasks, track your progress throughout the week, and get visual feedback on whether you\'re meeting your goals.',
  },
  {
    question: 'How does the points system work?',
    answer: 'For each routine you create, you set a daily target (Average Points or AP). The system automatically calculates your weekly target (APW) based on your configured work days. Throughout the week, you log your points for each day, and the system shows your Week Results (WR) — color-coded green if you\'ve met your target, or red if you\'re behind.',
  },
  {
    question: 'What happens at the end of the week?',
    answer: 'Every Monday, your daily points reset automatically to zero, giving you a fresh start for the new week. Your routine definitions and settings are preserved — only the weekly progress is reset. This allows you to maintain consistency without carrying over unfinished work.',
  },
  {
    question: 'Can I use Routine on my phone?',
    answer: 'Yes! Routine is fully responsive and works great on mobile devices. The interface adapts to smaller screens, showing cards instead of the full table view, and all buttons are optimized for touch interactions.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use Supabase for authentication and database storage, which provides enterprise-grade security. Your data is protected by Row Level Security (RLS), meaning only you can access your routines and progress. We never share or sell your data.',
  },
  {
    question: 'How do I change my weekly settings?',
    answer: 'Go to the Settings page from the dashboard navigation. There you can configure your Available Days (AD), Work Days (WD), and Work Hours per Day (WHD). These settings affect how your weekly targets are calculated.',
  },
  {
    question: 'Can I edit or delete a routine?',
    answer: 'Yes, you can edit or delete any routine using the action menu (three dots) on each routine row or card. Editing allows you to change the name, daily target, and comments. Deleting will permanently remove the routine and all associated weekly data.',
  },
  {
    question: 'What if I miss a day?',
    answer: 'No worries! Simply leave that day\'s points at zero or add points when you get back. The system is designed to be flexible — you can log points at any time during the week, and the totals will update accordingly.',
  },
  {
    question: 'Is Routine free?',
    answer: 'Yes, Routine is completely free to use. We believe everyone should have access to tools that help them build better habits without financial barriers.',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply create a free account by clicking "Get Started" on the homepage. Once logged in, you\'ll be taken to your dashboard where you can create your first routine. Set a name and daily target, and you\'re ready to start tracking!',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions */}
        <div className="mt-12 rounded-lg border bg-muted/50 p-8 text-center">
          <h2 className="mb-2 text-xl font-bold">Still have questions?</h2>
          <p className="mb-4 text-muted-foreground">
            We&apos;re here to help. Reach out to us through our contact page.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center text-primary hover:underline"
          >
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  );
}
