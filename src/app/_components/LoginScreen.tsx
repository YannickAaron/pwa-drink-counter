"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LoginScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary to-primary/80 text-neutral">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.2
          }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-center sm:text-[5rem]">
            Sip<span className="text-highlight">Stats</span>
          </h1>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.4
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/api/auth/signin"
              className="rounded-full bg-secondary px-10 py-3 font-semibold text-neutral no-underline transition shadow-lg hover:bg-secondary/90"
            >
              Sign in
            </Link>
          </motion.div>
          
          <motion.p 
            className="mt-4 text-neutral/70 text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Track your drinks, monitor your consumption, and gain insights with SipStats.
          </motion.p>
        </motion.div>
        
        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex space-x-4">
            <motion.span 
              className="text-4xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              🍺
            </motion.span>
            <motion.span 
              className="text-4xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.2, rotate: -10 }}
            >
              🍷
            </motion.span>
            <motion.span 
              className="text-4xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              🍸
            </motion.span>
            <motion.span 
              className="text-4xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.2, rotate: -10 }}
            >
              🥃
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}