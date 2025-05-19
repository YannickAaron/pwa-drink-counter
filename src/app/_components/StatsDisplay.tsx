"use client";

import { DrinkType } from "@prisma/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Colors for charts - using our color scheme
const COLORS = ["#08415C", "#CC2936", "#53917E", "#EE964B"];

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

  const tabVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.05 }
  };

  return (
    <motion.div 
      className="mx-auto max-w-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tab selector */}
      <motion.div 
        className="mb-6 flex rounded-lg bg-accent/10 backdrop-blur-sm"
        variants={itemVariants}
      >
        <motion.button
          onClick={() => setActiveTab("current")}
          className={`flex-1 rounded-lg px-4 py-2 text-center ${
            activeTab === "current"
              ? "bg-secondary text-neutral"
              : "text-neutral/70 hover:bg-neutral/10"
          }`}
          whileHover="active"
          whileTap={{ scale: 0.95 }}
          variants={tabVariants}
          animate={activeTab === "current" ? "active" : "inactive"}
        >
          Current Session
        </motion.button>
        <motion.button
          onClick={() => setActiveTab("allTime")}
          className={`flex-1 rounded-lg px-4 py-2 text-center ${
            activeTab === "allTime"
              ? "bg-secondary text-neutral"
              : "text-neutral/70 hover:bg-neutral/10"
          }`}
          whileHover="active"
          whileTap={{ scale: 0.95 }}
          variants={tabVariants}
          animate={activeTab === "allTime" ? "active" : "inactive"}
        >
          All-Time Stats
        </motion.button>
      </motion.div>

      {/* Current session stats */}
      <AnimatePresence mode="wait">
        {activeTab === "current" && (
          <motion.div
            key="current"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStats ? (
              <motion.div className="space-y-8">
                {/* Summary stats */}
                <motion.div 
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                  variants={containerVariants}
                >
                  <motion.div 
                    className="rounded-lg bg-accent/10 p-4 text-center backdrop-blur-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(83, 145, 126, 0.2)" }}
                  >
                    <p className="text-sm text-neutral/70">Total Drinks</p>
                    <motion.p 
                      className="text-3xl font-bold text-highlight"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      {currentStats.totalDrinks}
                    </motion.p>
                  </motion.div>
                  <motion.div 
                    className="rounded-lg bg-accent/10 p-4 text-center backdrop-blur-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(83, 145, 126, 0.2)" }}
                  >
                    <p className="text-sm text-neutral/70">Alcohol (g)</p>
                    <motion.p 
                      className="text-3xl font-bold text-highlight"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      {currentStats.totalAlcohol.toFixed(1)}
                    </motion.p>
                  </motion.div>
                  <motion.div 
                    className="rounded-lg bg-accent/10 p-4 text-center backdrop-blur-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(83, 145, 126, 0.2)" }}
                  >
                    <p className="text-sm text-neutral/70">Avg. Per Hour</p>
                    <motion.p 
                      className="text-3xl font-bold text-highlight"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {currentStats.avgDrinksPerHour.toFixed(1)}
                    </motion.p>
                  </motion.div>
                </motion.div>

                {/* Drink type distribution pie chart */}
                <motion.div 
                  className="rounded-lg bg-accent/10 p-4 backdrop-blur-sm"
                  variants={itemVariants}
                >
                  <h3 className="mb-4 text-center text-lg font-medium">
                    Drink Types
                  </h3>
                  <motion.div 
                    className="h-64"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
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
                          animationBegin={300}
                          animationDuration={1500}
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
                        <Tooltip contentStyle={{ backgroundColor: '#08415C', borderColor: '#53917E', color: '#F2F4F3' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </motion.div>

                {/* Drinks per hour bar chart */}
                {currentStats.drinksPerHour.length > 0 && (
                  <motion.div 
                    className="rounded-lg bg-accent/10 p-4 backdrop-blur-sm"
                    variants={itemVariants}
                  >
                    <h3 className="mb-4 text-center text-lg font-medium">
                      Drinks Per Hour
                    </h3>
                    <motion.div 
                      className="h-64"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={formatDrinksPerHourData(currentStats.drinksPerHour)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="hour" stroke="#F2F4F3" />
                          <YAxis stroke="#F2F4F3" />
                          <Tooltip contentStyle={{ backgroundColor: '#08415C', borderColor: '#53917E', color: '#F2F4F3' }} />
                          <Bar 
                            dataKey="drinks" 
                            fill="#EE964B" 
                            animationBegin={300}
                            animationDuration={1500}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                className="rounded-lg bg-accent/10 p-8 text-center backdrop-blur-sm"
                variants={itemVariants}
              >
                <motion.p 
                  className="text-xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  No drinks logged in the current session.
                </motion.p>
                <motion.p 
                  className="mt-2 text-neutral/70"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Head back to the tracking page to log your first drink!
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* All-time stats */}
        {activeTab === "allTime" && (
          <motion.div
            key="allTime"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {allTimeStats && allTimeStats.totalSessions > 0 ? (
              <motion.div className="space-y-8">
                {/* Summary stats */}
                <motion.div 
                  className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                  variants={containerVariants}
                >
                  <motion.div 
                    className="rounded-lg bg-accent/10 p-4 text-center backdrop-blur-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(83, 145, 126, 0.2)" }}
                  >
                    <p className="text-sm text-neutral/70">Total Sessions</p>
                    <motion.p 
                      className="text-3xl font-bold text-highlight"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      {allTimeStats.totalSessions}
                    </motion.p>
                  </motion.div>
                  <motion.div 
                    className="rounded-lg bg-accent/10 p-4 text-center backdrop-blur-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(83, 145, 126, 0.2)" }}
                  >
                    <p className="text-sm text-neutral/70">Total Drinks</p>
                    <motion.p 
                      className="text-3xl font-bold text-highlight"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      {allTimeStats.totalDrinks}
                    </motion.p>
                  </motion.div>
                  <motion.div 
                    className="rounded-lg bg-accent/10 p-4 text-center backdrop-blur-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(83, 145, 126, 0.2)" }}
                  >
                    <p className="text-sm text-neutral/70">Total Alcohol (g)</p>
                    <motion.p 
                      className="text-3xl font-bold text-highlight"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {allTimeStats.totalAlcohol.toFixed(1)}
                    </motion.p>
                  </motion.div>
                  <motion.div 
                    className="rounded-lg bg-accent/10 p-4 text-center backdrop-blur-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(83, 145, 126, 0.2)" }}
                  >
                    <p className="text-sm text-neutral/70">Avg. Per Session</p>
                    <motion.p 
                      className="text-3xl font-bold text-highlight"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                    >
                      {allTimeStats.avgDrinksPerSession.toFixed(1)}
                    </motion.p>
                  </motion.div>
                </motion.div>

                {/* Drink type distribution pie chart */}
                <motion.div 
                  className="rounded-lg bg-accent/10 p-4 backdrop-blur-sm"
                  variants={itemVariants}
                >
                  <h3 className="mb-4 text-center text-lg font-medium">
                    All-Time Drink Types
                  </h3>
                  <motion.div 
                    className="h-64"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
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
                          animationBegin={300}
                          animationDuration={1500}
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
                        <Tooltip contentStyle={{ backgroundColor: '#08415C', borderColor: '#53917E', color: '#F2F4F3' }} />
                        <Legend 
                          formatter={(value) => <span style={{ color: '#F2F4F3' }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className="rounded-lg bg-accent/10 p-8 text-center backdrop-blur-sm"
                variants={itemVariants}
              >
                <motion.p 
                  className="text-xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  No drinking sessions recorded yet.
                </motion.p>
                <motion.p 
                  className="mt-2 text-neutral/70"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Your all-time stats will appear here once you start logging drinks.
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}