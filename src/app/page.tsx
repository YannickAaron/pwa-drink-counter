import { redirect } from "next/navigation";
import Link from "next/link";

import { LoginScreen } from "~/app/_components/LoginScreen";

import { AppLayout } from "~/app/_components/AppLayout";
import { DrinkTracker } from "~/app/_components/DrinkTracker";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  // For development/testing purposes, provide a mock login option
  if (!session?.user) {
    return <LoginScreen />;
  }

  try {
    // Check if the user is marked as onboarded in the database
    const dbUser = await api.profile.getUserOnboardedStatus();
    if (!dbUser?.onboarded) {
      redirect("/onboarding");
      return null;
    }

    // Check if user has completed onboarding
    const user = await api.profile.getProfile();

    // If user doesn't have a profile, redirect to onboarding
    if (!user) {
      redirect("/onboarding");
      return null;
    }
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // If there's an error, assume the user needs to be onboarded
    redirect("/onboarding");
    return null;
  }

  // Prefetch current session data
  await api.drinkSession.getCurrentSession();
  await api.drinkSession.getRecentDrinks({ limit: 10 });

  return (
    <HydrateClient>
      <AppLayout title="Drink Counter">
        <DrinkTracker />
      </AppLayout>
    </HydrateClient>
  );
}
