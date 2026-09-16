import React from 'react';
import { Navbar } from '@/components/main/Navbar/Navbar';
import { Footer } from '@/components/main/Footer/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
