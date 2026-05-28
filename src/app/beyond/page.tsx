"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";
import data from "@/content/data.json";
import { Reveal } from "@/components/Reveal";
import { TravelCard } from "@/components/TravelCard";
import { SectionLoader } from "@/components/SectionLoader";

gsap.registerPlugin(ScrollTrigger);

export default function BeyondPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<typeof data.travels[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);

  const [isPageReady, setIsPageReady] = useState(false);
  const [loadedCovers, setLoadedCovers] = useState(0);
  const totalCovers = data.travels.length;

  // Body Lock & Scroll Management
  useEffect(() => {
    if (selectedLocation) {
      // Aggressive scroll lock for both html and body
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      
      // Stop Lenis if possible (it looks for .lenis-stopped class)
      document.documentElement.classList.add("lenis-stopped");

      setIsLoading(true);
      
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.documentElement.classList.remove("lenis-stopped");
        window.scrollTo(0, scrollY);
      };
    }
  }, [selectedLocation]);

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;

    if (!section || !trigger) return;

    const travelCount = data.travels.length;
    const xPercent = -100 * (travelCount - 1);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        { x: 0 },
        {
          x: `${xPercent}vw`,
          ease: "none",
          scrollTrigger: {
            trigger: trigger,
            pin: true,
            scrub: 1,
            start: "top top",
            end: `+=${travelCount * 1000}`,
            invalidateOnRefresh: true,
          },
        }
      );
    }, trigger);

    if (selectedLocation) {
      ScrollTrigger.getAll().forEach(t => t.disable());
    } else {
      ScrollTrigger.getAll().forEach(t => t.enable());
      ScrollTrigger.refresh();
    }

    return () => {
      ctx.revert();
    };
  }, [selectedLocation]);

  const handleLocationClick = (loc: typeof data.travels[0]) => {
    setSelectedLocation(loc);
    setLoadedImages(0);
    setIsLoading(true);
  };

  useEffect(() => {
    if (loadedCovers >= totalCovers) {
      const timer = setTimeout(() => setIsPageReady(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loadedCovers, totalCovers]);

  // Fail-safe for page load
  useEffect(() => {
    const timer = setTimeout(() => setIsPageReady(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedLocation && loadedImages >= selectedLocation.media.length) {
      // Artificial delay for high-fidelity feel
      const timer = setTimeout(() => setIsLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [loadedImages, selectedLocation]);

  // Fail-safe
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {!isPageReady && (
          <SectionLoader 
            title="Beyond" 
            subtitle="Syncing_Global_Locations" 
            index="05" 
          />
        )}
      </AnimatePresence>

      <div className={`bg-surface-dim overflow-hidden ${selectedLocation ? 'h-screen' : ''} ${!isPageReady ? 'invisible' : 'visible'}`}>
        {/* Intro Section */}
        <section className="px-6 md:px-outer-gutter pt-[120px] pb-[60px] relative">
          <div className="grid md:grid-cols-12 gap-column-gap">
            <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary" y={20}>
              05 / Beyond · Field notes
            </Reveal>
            <Reveal className="md:col-span-9 max-w-3xl" y={32} delay={0.1}>
              <h1 className="font-display text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface">
                The rest <em className="italic text-primary">of the world.</em>
              </h1>
            </Reveal>
          </div>
        </section>

        {/* Horizontal Scroller Trigger */}
        <div ref={triggerRef} className="h-screen relative overflow-hidden">
          <div 
            ref={sectionRef} 
            className="flex h-full relative"
            style={{ width: `${data.travels.length * 100}vw` }}
          >
            {data.travels.map((t, i) => (
              <div 
                key={t.location} 
                className="w-screen h-full flex-shrink-0 px-6 md:px-outer-gutter py-12 flex items-center justify-center relative group cursor-pointer"
                onClick={() => handleLocationClick(t)}
              >
                <div className="relative w-full h-full overflow-hidden border border-outline-variant/30 glass-panel group-hover:border-primary/50 transition-colors duration-500">
                  <div className="absolute inset-0 z-0">
                    {t.cover.toLowerCase().endsWith('.mp4') || t.cover.toLowerCase().endsWith('.mov') ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        onLoadedData={() => setLoadedCovers(prev => prev + 1)}
                        className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
                      >
                        <source src={t.cover} />
                      </video>
                      ) : (
                      <Image
                        src={t.cover}
                        alt={t.location}
                        fill
                        onLoad={() => setLoadedCovers(prev => prev + 1)}
                        className="object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
                      />
                    )}
                  <div className="absolute inset-0 bg-surface/20 mix-blend-overlay pointer-events-none" />
                </div>

                <div className="absolute inset-0 z-10 p-stack-xl flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="font-mono text-label-mono text-primary tracking-[0.2em]">
                      {t.coordinates}
                    </div>
                    <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                      EPISODE_{String(i + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <motion.h3 className="font-display text-[8vw] md:text-[5vw] leading-none text-on-surface mb-stack-md group-hover:text-primary transition-colors duration-500">
                      {t.location.split(',')[0]}
                      <span className="block text-body-lg font-sans font-normal text-on-surface-variant tracking-normal mt-2 italic opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        {t.note}
                      </span>
                    </motion.h3>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="font-mono text-label-mono text-on-surface-variant">
                      {t.date}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-label-mono text-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      <span className="material-symbols-outlined text-sm">open_in_full</span>
                      Explore_Logs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-surface flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 md:px-outer-gutter py-12 flex justify-between items-end border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md sticky top-0 z-[101]">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-display text-headline-lg text-primary mb-2"
                >
                  {selectedLocation.location}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-mono text-label-mono text-on-surface-variant uppercase tracking-widest"
                >
                  {selectedLocation.date} · {selectedLocation.coordinates}
                </motion.p>
              </div>
              <button 
                onClick={() => setSelectedLocation(null)}
                className="btn-secondary group flex items-center gap-2"
              >
                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
                Return_To_Field
              </button>
            </div>

            {/* Gallery Content */}
            <div 
              data-lenis-prevent
              className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-outer-gutter bg-surface-dim custom-scrollbar"
            >
              <div className="max-w-7xl mx-auto">
                <div className="mb-16 max-w-2xl">
                   <p className="editorial-text text-on-surface-variant">
                    {selectedLocation.note}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                  {selectedLocation.media.map((m, i) => (
                    <div 
                      key={m.src}
                      className={i % 4 === 0 ? "md:col-span-2 md:aspect-video" : "aspect-square md:aspect-square"}
                    >
                      <TravelCard
                        src={m.src}
                        type={m.type as "image" | "video"}
                        location={selectedLocation.location}
                        date={selectedLocation.date}
                        index={i}
                        onLoad={() => setLoadedImages(prev => prev + 1)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Loader */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[20000] bg-surface flex flex-col items-center justify-center p-outer-gutter"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-2xl w-full text-center"
                  >
                    <div className="font-display text-headline-lg text-primary mb-2 animate-pulse">
                      {selectedLocation.location}
                    </div>
                    <div className="font-mono text-label-mono text-on-surface-variant tracking-[0.3em] uppercase mb-12">
                      Establishing_Satellite_Sync
                    </div>
                    
                    <div className="h-[2px] w-full bg-outline-variant relative overflow-hidden rounded-full">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 1.8, ease: "easeInOut" }}
                        className="absolute inset-0 bg-primary"
                      />
                    </div>
                    
                    <div className="mt-8 flex justify-between font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                      <span>COORD: {selectedLocation.coordinates}</span>
                      <span className="text-primary animate-pulse">STATUS: DOWNLOADING_LOGS...</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bdf532;
          border-radius: 10px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #bdf532 rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
    </>
  );
}
