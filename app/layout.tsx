import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Growfinitys',
  description: 'Automated signals with Nas.io payments',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-black text-white">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
