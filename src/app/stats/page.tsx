import { redirect } from "next/navigation";

import { AppLayout } from "~/app/_components/AppLayout";
import { StatsDisplay } from "~/app/_components/StatsDisplay";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function StatsPage() {
  const session = await auth();

  // If not logged in, redirect to sign in
  if (!session?.user) {
    redirect("/api/auth/signin");
    return null;
  }

  // Check if user has completed onboarding
  const isOnboarded = await api.profile.isOnboarded();
  
  // If not onboarded, redirect to onboarding
  if (!isOnboarded) {
    redirect("/onboarding");
    return null;
  }

  // Prefetch stats data
  await api.statistics.getCurrentSessionStats({});
  await api.statistics.getAllTimeStats();

  return (
    <HydrateClient>
      <AppLayout title="Your Drinking Stats">
        <StatsDisplay />
      </AppLayout>
    </HydrateClient>
  );
}