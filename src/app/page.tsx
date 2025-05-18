import { redirect } from "next/navigation";
import Link from "next/link";

import { AppLayout } from "~/app/_components/AppLayout";
import { DrinkTracker } from "~/app/_components/DrinkTracker";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  // For development/testing purposes, provide a mock login option
  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Drink <span className="text-[hsl(280,100%,70%)]">Counter</span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/api/auth/signin"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Sign in
            </Link>
            <Link
              href="/demo"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has completed onboarding
  const isOnboarded = await api.profile.isOnboarded.query();
  
  // If not onboarded, redirect to onboarding
  if (!isOnboarded) {
    redirect("/onboarding");
    return null;
  }

  // Prefetch current session data
  await api.drinkSession.getCurrentSession.prefetch();
  await api.drinkSession.getRecentDrinks.prefetch({ limit: 10 });

  return (
    <HydrateClient>
      <AppLayout title="Drink Counter">
        <DrinkTracker />
      </AppLayout>
    </HydrateClient>
  );
}
