import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Predictor Demand SaaS",
  description: "Forecast estadístico de demanda de productos de venta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-950 text-neutral-100">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="min-w-0 flex-1 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_32rem),linear-gradient(180deg,#111111,#080808)]">
            <div className="mx-auto w-full max-w-7xl px-6 py-7">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
