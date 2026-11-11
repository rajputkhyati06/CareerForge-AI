import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareerForge AI — Gamified Career Learning Engine',
  description: 'Multiple-career, AI-assisted personalized learning and skill assessment platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
