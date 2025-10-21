import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


export const metadata = {
title: 'Growfinitys',
description: 'Automated signals with Nas.io payments',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<Navbar />
<main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
<Footer />
</body>
</html>
);
}
