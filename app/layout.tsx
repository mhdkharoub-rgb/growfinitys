import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growfinitys Signals",
  description: "Luxury Forex & Crypto Signals Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-black text-white">{children}</body>
    </html>
  );
}
