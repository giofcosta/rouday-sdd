import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <span className="text-3xl font-bold">Routine</span>
      </Link>
      
      {/* Auth Card Container */}
      <div className="w-full max-w-md">
        {children}
      </div>
      
      {/* Footer */}
      <p className="mt-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Routine. All rights reserved.
      </p>
    </div>
  );
}
