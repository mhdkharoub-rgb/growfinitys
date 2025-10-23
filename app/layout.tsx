import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Growfinitys Signals",
  description: "Luxury Forex & Crypto Signals Platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-black text-white">{children}</body>
    </html>
  );
}
