"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  title?: string;
}

export function AppLayout({
  children,
  showNavigation = true,
  title,
}: AppLayoutProps) {
  const pathname = usePathname();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const navItemVariants = {
    hover: { scale: 1.1, y: -5 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary to-primary/80 text-neutral">
      {title && (
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sticky top-0 z-10 border-b border-neutral/10 bg-primary/90 backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </motion.header>
      )}

      <motion.main 
        className="flex-1"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container mx-auto px-4 py-6">{children}</div>
      </motion.main>

      {showNavigation && (
        <motion.nav 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sticky bottom-0 border-t border-neutral/10 bg-primary/90 backdrop-blur-md"
        >
          <div className="container mx-auto flex justify-around px-4 py-3">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={navItemVariants}
            >
              <Link
                href="/"
                className={`flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/" 
                    ? "text-highlight" 
                    : "text-neutral hover:text-highlight"
                }`}
              >
                <span className="text-xl">🍺</span>
                <span>Track</span>
                {pathname === "/" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 h-1 w-12 rounded-full bg-highlight"
                  />
                )}
              </Link>
            </motion.div>
            
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={navItemVariants}
            >
              <Link
                href="/stats"
                className={`flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/stats" 
                    ? "text-highlight" 
                    : "text-neutral hover:text-highlight"
                }`}
              >
                <span className="text-xl">📊</span>
                <span>Stats</span>
                {pathname === "/stats" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 h-1 w-12 rounded-full bg-highlight"
                  />
                )}
              </Link>
            </motion.div>
            
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={navItemVariants}
            >
              <Link
                href="/profile"
                className={`flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/profile" 
                    ? "text-highlight" 
                    : "text-neutral hover:text-highlight"
                }`}
              >
                <span className="text-xl">👤</span>
                <span>Profile</span>
                {pathname === "/profile" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 h-1 w-12 rounded-full bg-highlight"
                  />
                )}
              </Link>
            </motion.div>
          </div>
        </motion.nav>
      )}
    </div>
  );
}