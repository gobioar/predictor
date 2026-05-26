"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import type { CurrentUser } from "@/lib/auth";

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: CurrentUser | null;
}) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(50,170,147,0.24),transparent_31rem),radial-gradient(circle_at_bottom_right,rgba(124,191,129,0.16),transparent_30rem),linear-gradient(180deg,#3b3f41,#2f3334)]">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="min-w-0 flex-1 bg-[radial-gradient(circle_at_top_left,rgba(50,170,147,0.24),transparent_31rem),radial-gradient(circle_at_bottom_right,rgba(124,191,129,0.16),transparent_30rem),linear-gradient(180deg,#3b3f41,#2f3334)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-7">{children}</div>
      </main>
    </div>
  );
}
