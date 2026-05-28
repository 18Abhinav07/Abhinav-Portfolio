"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

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

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

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
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group w-full h-full relative"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full rounded-xl bg-surface-variant/20 overflow-hidden border border-outline-variant/30 transition-all duration-500 ease-out group-hover:border-primary/50"
      >
        {/* Skeleton Loader */}
        <div 
          className={`absolute inset-0 bg-surface-container-highest animate-pulse z-10 transition-opacity duration-700 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />

        {/* Subtle Shine */}
        <div 
          style={{ transform: "translateZ(30px)" }}
          className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" 
        />

        <div className={`relative w-full h-full z-0 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {type === "video" ? (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              onLoadedData={handleMediaLoad}
              className="w-full h-full object-cover transition-all duration-700 scale-[1.01] group-hover:scale-110"
            >
              <source src={src} />
            </video>
          ) : (
            <div className="w-full h-full relative">
              <Image
                src={src}
                alt={location}
                fill
                priority={index < 3}
                onLoad={handleMediaLoad}
                className="object-cover transition-all duration-700 scale-[1.01] group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        {/* Content Overlay */}
        <div 
          style={{ transform: "translateZ(50px)" }}
          className="absolute inset-0 z-30 p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-1">
            {date}
          </p>
          <h4 className="font-display text-headline-sm text-white tracking-tight">
            Dispatch_{String(index + 1).padStart(2, '0')}
          </h4>
        </div>
      </motion.div>
    </motion.div>
  );
}
