import Link from "next/link";
import { type ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  title?: string;
}

export function AppLayout({
  children,
  showNavigation = true,
  title,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {title && (
        <header className="sticky top-0 z-10 border-b border-white/10 bg-[#2e026d]/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </header>
      )}

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>

      {showNavigation && (
        <nav className="sticky bottom-0 border-t border-white/10 bg-[#15162c]/80 backdrop-blur-sm">
          <div className="container mx-auto flex justify-around px-4 py-3">
            <Link
              href="/"
              className="flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              <span className="text-xl">🍺</span>
              <span>Track</span>
            </Link>
            <Link
              href="/stats"
              className="flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              <span className="text-xl">📊</span>
              <span>Stats</span>
            </Link>
            <Link
              href="/profile"
              className="flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              <span className="text-xl">👤</span>
              <span>Profile</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}