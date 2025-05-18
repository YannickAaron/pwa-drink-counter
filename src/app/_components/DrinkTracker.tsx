"use client";

import { DrinkType } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

import { api } from "~/trpc/react";

// Drink type options with emojis
const drinkTypeOptions = [
  { value: DrinkType.BEER, label: "Beer 🍺", defaultVolume: 330 },
  { value: DrinkType.WINE, label: "Wine 🍷", defaultVolume: 150 },
  { value: DrinkType.COCKTAIL, label: "Cocktail 🍸", defaultVolume: 200 },
  { value: DrinkType.SHOT, label: "Shot 🥃", defaultVolume: 40 },
];

// Volume presets for each drink type
const volumePresets = {
  [DrinkType.BEER]: [200, 330, 500],
  [DrinkType.WINE]: [100, 150, 250],
  [DrinkType.COCKTAIL]: [150, 200, 300],
  [DrinkType.SHOT]: [20, 40, 60],
};

interface DrinkTrackerProps {
  isDemoMode?: boolean;
}

interface DemoDrink {
  id: string;
  drinkType: DrinkType;
  volume: number;
  timestamp: Date;
}

export function DrinkTracker({ isDemoMode = false }: DrinkTrackerProps) {
  // State for drink type and volume
  const [selectedDrinkType, setSelectedDrinkType] = useState<DrinkType>(DrinkType.BEER);
  const [volume, setVolume] = useState<number>(330);
  const [isAddingDrink, setIsAddingDrink] = useState(false);
  const [demoDrinks, setDemoDrinks] = useState<DemoDrink[]>([]);

  // Get current session data (only if not in demo mode)
  const { data: currentSession } = api.drinkSession.getCurrentSession.useQuery(
    undefined,
    { enabled: !isDemoMode }
  );
  
  // Get recent drinks (only if not in demo mode)
  const { data: recentDrinks, refetch: refetchRecentDrinks } = 
    api.drinkSession.getRecentDrinks.useQuery(
      { limit: 10 },
      { enabled: !isDemoMode }
    );

  // Add drink mutation
  const addDrink = api.drinkSession.addDrink.useMutation({
    onSuccess: () => {
      refetchRecentDrinks();
    },
  });

  // Handle drink type change
  const handleDrinkTypeChange = (drinkType: DrinkType) => {
    setSelectedDrinkType(drinkType);
    // Set default volume for the selected drink type
    const defaultVolume = drinkTypeOptions.find(
      (option) => option.value === drinkType
    )?.defaultVolume ?? 330;
    setVolume(defaultVolume);
  };

  // Handle add drink
  const handleAddDrink = async () => {
    if (isAddingDrink) return;

    setIsAddingDrink(true);
    try {
      if (isDemoMode) {
        // In demo mode, just add to local state
        const newDrink: DemoDrink = {
          id: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          drinkType: selectedDrinkType,
          volume,
          timestamp: new Date(),
        };
        setDemoDrinks((prev) => [newDrink, ...prev].slice(0, 10));
      } else {
        // In normal mode, use the API
        await addDrink.mutateAsync({
          drinkType: selectedDrinkType,
          volume,
          sessionId: currentSession?.id,
        });
      }
    } catch (error) {
      console.error("Error adding drink:", error);
    } finally {
      setIsAddingDrink(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get drink type label
  const getDrinkTypeLabel = (drinkType: DrinkType) => {
    return drinkTypeOptions.find((option) => option.value === drinkType)?.label ?? drinkType;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main tracking button */}
      <div className="mb-8 flex flex-col items-center">
        <button
          onClick={handleAddDrink}
          disabled={isAddingDrink}
          className="mb-4 flex h-40 w-40 flex-col items-center justify-center rounded-full bg-indigo-600 text-center text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <span className="text-4xl">+1</span>
          <span className="text-2xl">{getDrinkTypeLabel(selectedDrinkType).split(" ")[0]}</span>
          <span className="text-xl">{volume}ml</span>
        </button>

        {/* Drink type selector */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {drinkTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDrinkTypeChange(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                selectedDrinkType === option.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Volume selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {volumePresets[selectedDrinkType].map((preset) => (
            <button
              key={preset}
              onClick={() => setVolume(preset)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                volume === preset
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {preset}ml
            </button>
          ))}
          <div className="flex items-center rounded-full bg-white/10 px-3">
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              min="10"
              max="1000"
              step="10"
              className="w-16 bg-transparent px-2 py-2 text-center text-sm text-white focus:outline-none"
            />
            <span className="text-sm text-white">ml</span>
          </div>
        </div>
      </div>

      {/* Recent entries */}
      <div className="w-full max-w-md rounded-lg bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-medium">Recent Drinks</h3>
          <Link
            href={isDemoMode ? "/demo/stats" : "/stats"}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            View Stats 📊
          </Link>
        </div>

        {isDemoMode ? (
          demoDrinks.length > 0 ? (
            <ul className="space-y-2">
              {demoDrinks.map((drink) => (
                <li
                  key={drink.id}
                  className="flex items-center justify-between rounded-md bg-white/5 p-3"
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-xl">
                      {drink.drinkType === DrinkType.BEER
                        ? "🍺"
                        : drink.drinkType === DrinkType.WINE
                        ? "🍷"
                        : drink.drinkType === DrinkType.COCKTAIL
                        ? "🍸"
                        : "🥃"}
                    </span>
                    <div>
                      <p className="font-medium">
                        {drink.drinkType.charAt(0) + drink.drinkType.slice(1).toLowerCase()}
                      </p>
                      <p className="text-sm text-white/70">{drink.volume}ml</p>
                    </div>
                  </div>
                  <span className="text-sm text-white/70">
                    {formatTime(drink.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-white/50">
              No drinks logged yet. Add your first one!
            </p>
          )
        ) : recentDrinks && recentDrinks.length > 0 ? (
          <ul className="space-y-2">
            {recentDrinks.map((drink) => (
              <li
                key={drink.id}
                className="flex items-center justify-between rounded-md bg-white/5 p-3"
              >
                <div className="flex items-center">
                  <span className="mr-2 text-xl">
                    {drink.drinkType === DrinkType.BEER
                      ? "🍺"
                      : drink.drinkType === DrinkType.WINE
                      ? "🍷"
                      : drink.drinkType === DrinkType.COCKTAIL
                      ? "🍸"
                      : "🥃"}
                  </span>
                  <div>
                    <p className="font-medium">
                      {drink.drinkType.charAt(0) + drink.drinkType.slice(1).toLowerCase()}
                    </p>
                    <p className="text-sm text-white/70">{drink.volume}ml</p>
                  </div>
                </div>
                <span className="text-sm text-white/70">
                  {formatTime(drink.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-center text-white/50">
            No drinks logged yet. Add your first one!
          </p>
        )}
      </div>
    </div>
  );
}