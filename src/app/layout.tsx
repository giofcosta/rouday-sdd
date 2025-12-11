import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Routine - Gamified Daily Task Management',
  description:
    'Track your daily routines with a points-based system. Visualize progress, set targets, and build better habits.',
  keywords: ['routine', 'habit tracker', 'productivity', 'gamification', 'task management'],
  authors: [{ name: 'Routine App' }],
  openGraph: {
    title: 'Routine - Gamified Daily Task Management',
    description: 'Track your daily routines with a points-based system.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

