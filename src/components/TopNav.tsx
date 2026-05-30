"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { site } from "@/content/site";

const PREMIUM_EASE = [0.32, 0.72, 0, 1] as const;

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Fluid Island Transformations: Obsidian Glass anchor for visual depth
  const navWidth = useTransform(scrollY, [0, 100], ["calc(100% - 32px)", "auto"]);
  const navPadding = useTransform(scrollY, [0, 100], ["1.25rem", "0.75rem"]);
  const navBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(7, 9, 15, 0.85)", "rgba(7, 9, 15, 0.95)"]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  const overlayVariants = {
    hidden: { 
      opacity: 0, 
      clipPath: "circle(0% at 90% 5%)",
      transition: { duration: 0.6, ease: PREMIUM_EASE }
    },
    visible: { 
      opacity: 1, 
      clipPath: "circle(150% at 90% 5%)",
      transition: { duration: 0.8, ease: PREMIUM_EASE }
    }
  };

  const linkContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const linkItemVariants = {
    hidden: { y: "110%" },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: PREMIUM_EASE }
    }
  };

  return (
    <>
      <motion.header
        style={{
          width: navWidth,
          paddingLeft: navPadding,
          paddingRight: navPadding,
          backgroundColor: navBg,
        }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-5xl rounded-full backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-6 md:gap-10 justify-between py-4 will-change-transform"
      >
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-white hover:text-primary transition-colors cursor-pointer select-none pl-2 flex-shrink-0"
        >
          {site.wordmark}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
          {site.nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono text-[9px] uppercase tracking-[0.28em] transition-all relative group py-1 whitespace-nowrap ${isActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-primary transition-transform duration-500 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 origin-right group-hover:origin-left'}`} />
              </Link>
            );
          })}
        </nav>

        {/* Right side status and hamburger trigger */}
        <div className="flex items-center gap-4 pr-1">
          {/* Morphing Hamburger Button - High Contrast Obsidian */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden flex-col justify-center items-center w-10 h-10 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/[0.1] active:scale-95 transition-all focus:outline-none z-[101]"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <div className="flex flex-col gap-1.5 justify-center items-center w-5 h-5 relative">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: PREMIUM_EASE }}
                className="w-4 h-[1px] bg-white block origin-center"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: PREMIUM_EASE }}
                className="w-4 h-[1px] bg-white block origin-center"
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Full screen overlays */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[99] bg-on-surface/98 backdrop-blur-3xl flex flex-col justify-center items-center"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Artistic Grid & Scanline Depth */}
            <div className="absolute inset-0 grid-paper opacity-5 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(191,255,0,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

            <motion.nav 
              variants={linkContainerVariants}
              className="flex flex-col gap-8 text-center"
            >
              {site.nav.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.href} className="py-1 overflow-hidden">
                    <motion.div variants={linkItemVariants}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`font-display italic text-[12vw] md:text-[6vw] transition-colors block relative group leading-none ${isActive ? 'text-primary' : 'text-white hover:text-primary'}`}
                      >
                        <span className="relative">
                          {item.label}
                          <span className={`font-mono text-[11px] uppercase absolute -top-4 -right-8 tracking-widest not-italic ${isActive ? 'text-white' : 'text-white/30'}`}>
                            0{idx + 1}
                          </span>
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </motion.nav>

            {/* Overlay Footer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="absolute bottom-12 font-mono text-[9px] uppercase tracking-[0.4em] text-white/50 flex flex-col items-center gap-3"
            >
              <div className="h-[1px] w-12 bg-white/20" />
              <span>{site.wordmark} {" // "} TRANSMISSION</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
