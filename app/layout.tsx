import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Growfinitys", description: "AI automated signals." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1, maxWidth: 960, margin: "0 auto", padding: 16 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
