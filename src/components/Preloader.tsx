"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF9F6]"
        >
          {/* Grid Background Overlay */}
          <div className="absolute inset-0 grid-paper opacity-10" />
          
          <div className="relative flex flex-col items-center gap-stack-lg">
            {/* Initials */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="font-display text-[12vw] md:text-[8vw] font-bold tracking-tighter text-on-surface leading-none"
            >
              A.P
            </motion.div>

            {/* Progress Bar & Status */}
            <div className="w-[300px] md:w-[400px] space-y-stack-sm">
              <div className="flex justify-between font-mono text-label-mono text-on-surface-variant uppercase tracking-widest font-bold">
                <span>Initializing_Core</span>
                <span>{progress}%</span>
              </div>
              <div className="h-[2px] w-full bg-outline-variant/30 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>

            {/* Status Messages */}
            <motion.div
              key={Math.floor(progress / 20)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-bold"
            >
              {progress < 20 && "Gathering_Ecosystem_Signals..."}
              {progress >= 20 && progress < 40 && "Hydrating_Resilient_Layers..."}
              {progress >= 40 && progress < 60 && "Syncing_Privacy_Primitives..."}
              {progress >= 60 && progress < 80 && "Validating_Mainnet_Scars..."}
              {progress >= 80 && "Compiling_Aesthetic_OS..."}
            </motion.div>
          </div>

          {/* Brutalist Border Accents */}
          <div className="absolute top-8 left-8 border-l border-t border-on-surface/20 w-12 h-12" />
          <div className="absolute bottom-8 right-8 border-r border-b border-on-surface/20 w-12 h-12" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
