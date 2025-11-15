import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Growfinitys",
  description: "AI Signals & Automation",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0a0a0a", color: "#f5f5f5", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
