"use client";

import { DrinkType } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface DrinkTrackerProps {}

export function DrinkTracker({}: DrinkTrackerProps) {
  // State for drink type and volume
  const [selectedDrinkType, setSelectedDrinkType] = useState<DrinkType>(DrinkType.BEER);
  const [volume, setVolume] = useState<number>(330);
  const [isAddingDrink, setIsAddingDrink] = useState(false);
  const [showAddAnimation, setShowAddAnimation] = useState(false);

  // Get current session data
  const { data: currentSession } = api.drinkSession.getCurrentSession.useQuery();
  
  // Get recent drinks
  const { data: recentDrinks, refetch: refetchRecentDrinks } = 
    api.drinkSession.getRecentDrinks.useQuery(
      { limit: 10 }
    );

  // Add drink mutation
  const addDrink = api.drinkSession.addDrink.useMutation({
    onSuccess: () => {
      refetchRecentDrinks();
      // Show success animation
      setShowAddAnimation(true);
      setTimeout(() => setShowAddAnimation(false), 1000);
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
      await addDrink.mutateAsync({
        drinkType: selectedDrinkType,
        volume,
        sessionId: currentSession?.id,
      });
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main tracking button */}
      <motion.div 
        className="mb-8 flex flex-col items-center"
        variants={itemVariants}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={handleAddDrink}
            disabled={isAddingDrink}
            className="mb-4 flex h-40 w-40 flex-col items-center justify-center rounded-full bg-secondary text-center text-neutral shadow-lg transition focus:outline-none focus:ring-4 focus:ring-secondary/50 focus:ring-offset-2 disabled:opacity-50"
            animate={showAddAnimation ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="text-4xl">+1</span>
            <span className="text-2xl">{getDrinkTypeLabel(selectedDrinkType).split(" ")[0]}</span>
            <span className="text-xl">{volume}ml</span>
            
            <AnimatePresence>
              {showAddAnimation && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 rounded-full border-2 border-highlight"
                />
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Drink type selector */}
        <motion.div 
          className="mb-4 flex flex-wrap justify-center gap-2"
          variants={itemVariants}
        >
          {drinkTypeOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => handleDrinkTypeChange(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                selectedDrinkType === option.value
                  ? "bg-accent text-neutral"
                  : "bg-neutral/10 text-neutral hover:bg-neutral/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Volume selector */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2"
          variants={itemVariants}
        >
          {volumePresets[selectedDrinkType].map((preset) => (
            <motion.button
              key={preset}
              onClick={() => setVolume(preset)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                volume === preset
                  ? "bg-highlight text-primary"
                  : "bg-neutral/10 text-neutral hover:bg-neutral/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {preset}ml
            </motion.button>
          ))}
          <motion.div 
            className="flex items-center rounded-full bg-neutral/10 px-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              min="10"
              max="1000"
              step="10"
              className="w-16 bg-transparent px-2 py-2 text-center text-sm text-neutral focus:outline-none"
            />
            <span className="text-sm text-neutral">ml</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Recent entries */}
      <motion.div 
        className="w-full max-w-md rounded-lg bg-accent/10 p-4 backdrop-blur-sm"
        variants={itemVariants}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-medium">Recent Drinks</h3>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/stats"
              className="text-sm text-highlight hover:text-secondary"
            >
              View Stats 📊
            </Link>
          </motion.div>
        </div>

        {recentDrinks && recentDrinks.length > 0 ? (
          <motion.ul className="space-y-2">
            <AnimatePresence>
              {recentDrinks.map((drink, index) => (
                <motion.li
                  key={drink.id}
                  className="flex items-center justify-between rounded-md bg-neutral/5 p-3 backdrop-blur-sm"
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                  layout
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(242, 244, 243, 0.1)" }}
                >
                  <div className="flex items-center">
                    <motion.span 
                      className="mr-2 text-xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {drink.drinkType === DrinkType.BEER
                        ? "🍺"
                        : drink.drinkType === DrinkType.WINE
                        ? "🍷"
                        : drink.drinkType === DrinkType.COCKTAIL
                        ? "🍸"
                        : "🥃"}
                    </motion.span>
                    <div>
                      <p className="font-medium">
                        {drink.drinkType.charAt(0) + drink.drinkType.slice(1).toLowerCase()}
                      </p>
                      <p className="text-sm text-neutral/70">{drink.volume}ml</p>
                    </div>
                  </div>
                  <span className="text-sm text-highlight">
                    {formatTime(drink.timestamp)}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.p 
            className="py-4 text-center text-neutral/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No drinks logged yet. Add your first one!
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}