import { redirect } from "next/navigation";

import { AppLayout } from "~/app/_components/AppLayout";
import { ProfileEditor } from "~/app/_components/ProfileEditor";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function ProfilePage() {
  const session = await auth();

  // If not logged in, redirect to sign in
  if (!session?.user) {
    redirect("/api/auth/signin");
    return null;
  }

  // Prefetch profile data
  await api.profile.getProfile();

  return (
    <HydrateClient>
      <AppLayout title="Your Profile">
        <ProfileEditor />
      </AppLayout>
    </HydrateClient>
  );
}