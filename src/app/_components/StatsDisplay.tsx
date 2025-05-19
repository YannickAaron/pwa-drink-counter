"use client";

import { DrinkType } from "@prisma/client";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "~/trpc/react";

// Colors for charts
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

// Drink type labels with emojis
const drinkTypeLabels = {
  [DrinkType.BEER]: "Beer 🍺",
  [DrinkType.WINE]: "Wine 🍷",
  [DrinkType.COCKTAIL]: "Cocktail 🍸",
  [DrinkType.SHOT]: "Shot 🥃",
};

export function StatsDisplay() {
  const [activeTab, setActiveTab] = useState<"current" | "allTime">("current");

  // Get current session stats
  const { data: currentStats } = api.statistics.getCurrentSessionStats.useQuery({});

  // Get all-time stats
  const { data: allTimeStats } = api.statistics.getAllTimeStats.useQuery();

  // Format drink type distribution data for pie chart
  const formatDrinkTypeData = (distribution: Record<DrinkType, number> | undefined) => {
    if (!distribution) return [];

    return Object.entries(distribution).map(([type, count]) => ({
      name: drinkTypeLabels[type as DrinkType],
      value: count,
    }));
  };

  // Format drinks per hour data for bar chart
  const formatDrinksPerHourData = (drinksPerHour: { hour: number; count: number }[] | undefined) => {
    if (!drinksPerHour) return [];

    return drinksPerHour.map((item) => ({
      hour: `Hour ${item.hour + 1}`,
      drinks: item.count,
    }));
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Tab selector */}
      <div className="mb-6 flex rounded-lg bg-white/5">
        <button
          onClick={() => setActiveTab("current")}
          className={`flex-1 rounded-lg px-4 py-2 text-center ${
            activeTab === "current"
              ? "bg-indigo-600 text-white"
              : "text-white/70 hover:bg-white/10"
          }`}
        >
          Current Session
        </button>
        <button
          onClick={() => setActiveTab("allTime")}
          className={`flex-1 rounded-lg px-4 py-2 text-center ${
            activeTab === "allTime"
              ? "bg-indigo-600 text-white"
              : "text-white/70 hover:bg-white/10"
          }`}
        >
          All-Time Stats
        </button>
      </div>

      {/* Current session stats */}
      {activeTab === "current" && (
        <div>
          {currentStats ? (
            <div className="space-y-8">
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white/5 p-4 text-center">
                  <p className="text-sm text-white/70">Total Drinks</p>
                  <p className="text-3xl font-bold">{currentStats.totalDrinks}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4 text-center">
                  <p className="text-sm text-white/70">Alcohol (g)</p>
                  <p className="text-3xl font-bold">
                    {currentStats.totalAlcohol.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 p-4 text-center">
                  <p className="text-sm text-white/70">Avg. Per Hour</p>
                  <p className="text-3xl font-bold">
                    {currentStats.avgDrinksPerHour.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Drink type distribution pie chart */}
              <div className="rounded-lg bg-white/5 p-4">
                <h3 className="mb-4 text-center text-lg font-medium">
                  Drink Types
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatDrinkTypeData(currentStats.drinkTypeDistribution)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {formatDrinkTypeData(currentStats.drinkTypeDistribution).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Drinks per hour bar chart */}
              {currentStats.drinksPerHour.length > 0 && (
                <div className="rounded-lg bg-white/5 p-4">
                  <h3 className="mb-4 text-center text-lg font-medium">
                    Drinks Per Hour
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formatDrinksPerHourData(currentStats.drinksPerHour)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="drinks" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-white/5 p-8 text-center">
              <p className="text-xl">No drinks logged in the current session.</p>
              <p className="mt-2 text-white/70">
                Head back to the tracking page to log your first drink!
              </p>
            </div>
          )}
        </div>
      )}

      {/* All-time stats */}
      {activeTab === "allTime" && (
        <div>
          {allTimeStats && allTimeStats.totalSessions > 0 ? (
            <div className="space-y-8">
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-white/5 p-4 text-center">
                  <p className="text-sm text-white/70">Total Sessions</p>
                  <p className="text-3xl font-bold">{allTimeStats.totalSessions}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4 text-center">
                  <p className="text-sm text-white/70">Total Drinks</p>
                  <p className="text-3xl font-bold">{allTimeStats.totalDrinks}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4 text-center">
                  <p className="text-sm text-white/70">Total Alcohol (g)</p>
                  <p className="text-3xl font-bold">
                    {allTimeStats.totalAlcohol.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 p-4 text-center">
                  <p className="text-sm text-white/70">Avg. Per Session</p>
                  <p className="text-3xl font-bold">
                    {allTimeStats.avgDrinksPerSession.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Drink type distribution pie chart */}
              <div className="rounded-lg bg-white/5 p-4">
                <h3 className="mb-4 text-center text-lg font-medium">
                  All-Time Drink Types
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatDrinkTypeData(allTimeStats.drinkTypeDistribution)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {formatDrinkTypeData(allTimeStats.drinkTypeDistribution).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white/5 p-8 text-center">
              <p className="text-xl">No drinking sessions recorded yet.</p>
              <p className="mt-2 text-white/70">
                Your all-time stats will appear here once you start logging drinks.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}