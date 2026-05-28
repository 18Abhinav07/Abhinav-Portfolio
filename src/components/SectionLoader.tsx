"use client";

import { motion } from "motion/react";

interface SectionLoaderProps {
  title: string;
  subtitle: string;
  index?: string;
}

export function SectionLoader({ title, subtitle, index }: SectionLoaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[10000] bg-surface flex flex-col items-center justify-center p-outer-gutter"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="font-display text-headline-lg text-primary mb-2 animate-pulse uppercase">
          {title}
        </div>
        <div className="font-mono text-label-mono text-on-surface-variant tracking-[0.3em] uppercase mb-12">
          {subtitle}
        </div>
        
        <div className="h-[2px] w-full bg-outline-variant relative overflow-hidden rounded-full">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            className="absolute inset-0 bg-primary"
          />
        </div>
        
        <div className="mt-8 flex justify-between font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
          <span>{index ? `INDEX: ${index}` : "SYSTEM_SYNC"}</span>
          <span className="text-primary animate-pulse">STATUS: DEPLOYING_ASSETS...</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
