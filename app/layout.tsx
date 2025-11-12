import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Growfinitys",
  description: "AI-powered multi-tier signal engine",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0b0b0b", color: "#f5f5f5" }}>{children}</body>
    </html>
  );
}
