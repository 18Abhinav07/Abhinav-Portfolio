"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TravelCardProps {
  src: string;
  type: "image" | "video";
  location: string;
  date: string;
  index: number;
  onLoad?: () => void;
}

export function TravelCard({ src, type, location, date, index, onLoad }: TravelCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { damping: 25, stiffness: 180 });
  const mouseYSpring = useSpring(y, { damping: 25, stiffness: 180 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleMediaLoad = () => {
    if (!isLoaded) {
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  };

  // Fail-safe: ensure skeleton disappears even if events don't fire 
  useEffect(() => {
    // Shorter fail-safe for individual cards
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsLoaded(true);
        if (onLoad) onLoad();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isLoaded, onLoad]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay: index * 0.05, ease: [0.32, 0.72, 0, 1] }}
      className="group w-full h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full"
      >
        {/* Sibling 1: Media Container (Clipped & styled with border) */}
        <div className="absolute inset-0 rounded-xl bg-bg overflow-hidden border border-outline-variant/30 transition-all duration-500 ease-out group-hover:border-primary/50 z-0 pointer-events-none">
          {type === "video" ? (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              onLoadedData={onLoad}
              onError={onLoad} // Fail gracefully by showing the container
              className="w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] scale-[1.01] group-hover:scale-105"
            >
              <source src={src} />
            </video>
          ) : (
            <div className="w-full h-full relative">
              <Image
                src={src}
                alt={`Media from ${location} dated ${date}`}
                fill
                priority={index < 3}
                onLoad={onLoad}
                onError={onLoad} // Fail gracefully
                className="object-cover transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] scale-[1.01] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        {/* Sibling 2: Subtle Shine (outside overflow boundary) */}
        <div 
          style={{ transform: "translateZ(20px)" }}
          className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" 
        />

        {/* Sibling 3: Floating text & gradient overlay (outside overflow boundary) */}
        <div 
          style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}
          className="absolute inset-0 z-30 p-6 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl pointer-events-none"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white mb-1 font-bold">
            {date}
          </p>
          <h4 className="font-display italic text-headline-sm text-white tracking-tight drop-shadow-sm">
            Dispatch_{String(index + 1).padStart(2, '0')}
          </h4>
        </div>
      </motion.div>
    </motion.div>
  );
}
