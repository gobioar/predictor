import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoBio Predictor",
  description: "Forecast estadístico de demanda para productos GoBio.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full bg-neutral-950 text-neutral-100">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
