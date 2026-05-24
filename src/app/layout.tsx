import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/context/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Euphoria | Where Every Moment Becomes a Memory",
  description: "Plan unforgettable surprises and events with a personal, human touch. From destination planning to emotional moments, craft beautiful experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#FFFAF0] text-stone-800 selection:bg-amber-100 selection:text-amber-900">
        <Providers>
          <Navbar />
          <main className="flex-grow flex flex-col pt-20">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
