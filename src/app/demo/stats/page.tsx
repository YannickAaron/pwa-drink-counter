import Link from "next/link";
import { AppLayout } from "~/app/_components/AppLayout";

export default function DemoStatsPage() {
  return (
    <AppLayout title="Statistics - Demo Mode">
      <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-800">
        <p className="font-semibold">Demo Mode</p>
        <p className="text-sm">
          You are viewing the app in demo mode. No data will be saved.
        </p>
      </div>
      
      <div className="mb-6 flex justify-between">
        <Link
          href="/demo"
          className="flex items-center text-indigo-400 hover:text-indigo-300"
        >
          <span className="mr-1">←</span> Back to Tracking
        </Link>
      </div>
      
      <div className="rounded-lg bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold">Demo Statistics</h2>
        
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white/10 p-4 text-center">
            <p className="text-sm text-white/70">Total Drinks</p>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4 text-center">
            <p className="text-sm text-white/70">Estimated Alcohol</p>
            <p className="text-3xl font-bold">68g</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4 text-center">
            <p className="text-sm text-white/70">Avg. Per Hour</p>
            <p className="text-3xl font-bold">1.2</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-medium">Drink Distribution</h3>
          <div className="h-64 rounded-lg bg-white/10 p-4">
            <div className="flex h-full items-center justify-center">
              <p className="text-white/50">
                Demo chart would appear here with real data
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="mb-2 text-lg font-medium">Timeline</h3>
          <div className="h-64 rounded-lg bg-white/10 p-4">
            <div className="flex h-full items-center justify-center">
              <p className="text-white/50">
                Demo timeline would appear here with real data
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}