"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MIN_MS = 1200;

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const startTime = useRef(Date.now());
  const gates = useRef({ fonts: false, load: false, hero3d: false });
  const dismissed = useRef(false);

  useEffect(() => {
    const advance = (gate: keyof typeof gates.current, pct: number) => {
      gates.current[gate] = true;
      setProgress(p => Math.max(p, pct));
      const { fonts, load, hero3d } = gates.current;
      if (fonts && load && hero3d && !dismissed.current) {
        dismissed.current = true;
        const delay = Math.max(0, MIN_MS - (Date.now() - startTime.current));
        setTimeout(() => setIsLoading(false), delay);
      }
    };

    // Gate 1: All fonts (Clash Display, Material Symbols, Hanken, JetBrains)
    document.fonts.ready.then(() => advance("fonts", 50));

    // Gate 2: All resources (images, scripts, stylesheets)
    if (document.readyState === "complete") {
      advance("load", 80);
    } else {
      window.addEventListener("load", () => advance("load", 80), { once: true });
    }

    // Gate 3: Hero3D canvas + textures (dispatched by Hero3DReadyGate)
    window.addEventListener("hero3d:ready", () => advance("hero3d", 100), { once: true });

    // Failsafe: if hero3d never fires (no 3D scene or WebGL unavailable)
    const failsafe = setTimeout(() => advance("hero3d", 100), 4000);

    // Idle ticks to show activity while waiting for real gates
    const ticker = setInterval(() => {
      setProgress(p => {
        if (p >= 40) { clearInterval(ticker); return p; }
        return p + 2;
      });
    }, 80);

    return () => {
      clearTimeout(failsafe);
      clearInterval(ticker);
    };
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
        >
          <div className="absolute inset-0 grid-paper opacity-10" />

          <div className="relative flex flex-col items-center gap-stack-lg">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="font-display text-[12vw] md:text-[8vw] font-bold tracking-tighter text-on-surface leading-none"
            >
              A.P
            </motion.div>

            <div className="w-[300px] md:w-[400px] space-y-stack-sm">
              <div className="flex justify-between font-mono text-label-mono text-on-surface-variant uppercase tracking-widest font-bold">
                <span>Initializing_Core</span>
                <span>{progress}%</span>
              </div>
              <div className="h-[2px] w-full bg-outline-variant/30 overflow-hidden">
                <div
                  className="h-full bg-primary transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <motion.div
              key={Math.floor(progress / 25)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-bold"
            >
              {progress < 25 && "Gathering_Ecosystem_Signals..."}
              {progress >= 25 && progress < 50 && "Hydrating_Resilient_Layers..."}
              {progress >= 50 && progress < 80 && "Syncing_Privacy_Primitives..."}
              {progress >= 80 && progress < 100 && "Validating_Mainnet_Scars..."}
              {progress >= 100 && "Compiling_Aesthetic_OS..."}
            </motion.div>
          </div>

          <div className="absolute top-8 left-8 border-l border-t border-on-surface/20 w-12 h-12" />
          <div className="absolute bottom-8 right-8 border-r border-b border-on-surface/20 w-12 h-12" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
