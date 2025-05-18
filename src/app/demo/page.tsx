import { AppLayout } from "~/app/_components/AppLayout";
import { DrinkTracker } from "~/app/_components/DrinkTracker";
import { HydrateClient } from "~/trpc/server";

export default function DemoPage() {
  return (
    <HydrateClient>
      <AppLayout title="Drink Counter - Demo Mode">
        <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-800">
          <p className="font-semibold">Demo Mode</p>
          <p className="text-sm">
            You are viewing the app in demo mode. No data will be saved.
          </p>
        </div>
        <DrinkTracker isDemoMode={true} />
      </AppLayout>
    </HydrateClient>
  );
}