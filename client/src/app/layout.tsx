import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TestPilot AI — Tests, written from your repo",
  description:
    "Connect a GitHub repo, TestPilot AI detects your framework and writes test plans and test code your CI can run.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${plexMono.variable} antialiased`}>
        <QueryProvider>
        <div className="bg-grid pointer-events-none fixed inset-0 z-0" />
        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
