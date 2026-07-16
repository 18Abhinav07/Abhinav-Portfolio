"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { site } from "@/content/site";
import { getSocialIcon } from "./SocialIcons";
import { StaggerGroup, StaggerItem, MaskReveal } from "./Reveal";

export function Footer() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(wordmarkRef, { once: true, margin: "0px 0px 200px 0px" });

  return (
    <footer className="relative z-10 bg-bg">
      {/* Background Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1] z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 60%, rgba(191,255,0,0.3), transparent 70%),
            radial-gradient(circle at 75% 80%, rgba(250,255,0,0.2), transparent 70%)
          `,
        }}
      />

      {/* Contact content: sits above the name watermark */}
      <div className="px-6 md:px-[80px] relative z-20 pt-[80px] md:pt-[140px] pb-[80px]">
        <StaggerGroup className="grid md:grid-cols-12 gap-column-gap mb-10">
          <div className="md:col-span-7">
            <StaggerItem>
              <MaskReveal>
                <h4 className="font-mono text-label-mono uppercase tracking-[0.3em] text-on-surface font-black mb-10">
                  {"//"} CHANNELS
                </h4>
              </MaskReveal>
            </StaggerItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              {site.socials.map((social) => (
                <StaggerItem key={social.label}>
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-on-surface/[0.03] border border-on-surface/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 ease-premium group-hover:scale-110 shadow-sm">
                      <div className="text-on-surface-variant group-hover:text-on-surface transition-colors duration-500">
                        {getSocialIcon(social.label, { className: "w-4 h-4" })}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-widest text-[11px] text-on-surface">{social.label.split(" / ")[0]}</span>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant/60 group-hover:text-primary transition-colors">{social.handle}</span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </div>
          <div className="md:col-start-9 md:col-span-4 mt-20 md:mt-0">
            <StaggerItem>
              <MaskReveal>
                <h4 className="font-mono text-label-mono uppercase tracking-[0.3em] text-on-surface font-black mb-10">
                  {"//"} DIRECT
                </h4>
              </MaskReveal>
            </StaggerItem>
            <ul className="space-y-8">
              <StaggerItem>
                <Link
                  href={`mailto:${site.email}`}
                  className="group flex flex-col gap-3 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-on-surface-variant/40 font-bold">Establishing Connection</span>
                  <span className="font-display text-headline-sm md:text-headline-md tracking-tighter text-on-surface group-hover:text-primary transition-all duration-500 underline underline-offset-8 decoration-on-surface/10 group-hover:decoration-primary">{site.email}</span>
                </Link>
              </StaggerItem>
            </ul>
          </div>
        </StaggerGroup>
      </div>

      {/* Bedrock Signature: useInView once:true, isInView never reverts to false after firing */}
      <div className="relative bottom-0 left-0 right-0 pointer-events-none select-none z-10 overflow-hidden">
        <motion.h2
          ref={wordmarkRef}
          initial={{ y: "100%", opacity: 0 }}
          animate={{
            y: isInView ? "0%" : "100%",
            opacity: isInView ? 0.07 : 0,
          }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-on-surface text-center whitespace-nowrap leading-[0.9] tracking-[-0.05em]"
        >
          <span className="text-[20vw]">ABHINAV</span>
        </motion.h2>
      </div>
    </footer>
  );
}
