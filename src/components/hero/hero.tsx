"use client";

import { useRef } from "react";
import Link from "next/link";
import { Artwork } from "@/components/visual/artwork";
import { FileText, ChevronDown } from "lucide-react";
import { InstallBox } from "./install-box";
import { GithubIcon } from "@/components/ui/icons";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="hero-chamber relative w-full flex flex-col justify-center items-center overflow-hidden bg-[#0A0908]"
    >
      {/* FULL-BLEED PARALLAX BACKDROP — artwork IS the space */}
      <motion.div
        style={{ y: reducedMotion ? 0 : bgY, scale: reducedMotion ? 1 : bgScale }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        <Artwork
          src="/assets/ascii-magic-7.png"
          eager
          className="object-cover object-center contrast-[1.15] brightness-[0.82]"
        />
        {/* Chiaroscuro — preserves etching detail, darkens edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/75 via-transparent to-[#0A0908]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,transparent_20%,#0A0908_90%)]" />
      </motion.div>

      {/* Architectural arch wireframe overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center select-none">
        <div className="w-[90vw] h-[calc(100%-5rem)] arch-vault border border-[#3E3833]/35 absolute top-10" />
      </div>

      {/* INSCRIPTION PANEL — centred, fits full viewport */}
      <motion.div
        style={{ y: reducedMotion ? 0 : contentY }}
        className="reading-plane relative z-10 w-full px-5 sm:px-10 md:px-20 max-w-5xl mx-auto text-center flex flex-col items-center"
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#0D0C0A]/90 border border-[#2A2622] mb-5 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 bg-[#38BDF8] animate-pulse rounded-full" />
          <span className="font-cinzel text-[11px] tracking-[0.2em] text-[#F5F5F4] font-bold uppercase">
            AI Coding Agent · Terminal CLI
          </span>
          <span className="text-[#3E3833]">|</span>
          <span className="font-mono text-[11px] text-[#78716C]">0.1.15</span>
        </motion.div>

        {/* Monumental headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="font-sans font-semibold tracking-tight text-[#F5F5F4] leading-[1.06] mb-4
            text-[clamp(2.2rem,6vw,4.5rem)]"
        >
          A coding agent that lives<br className="hidden sm:block" /> where you already work
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-[#C8C5C2] font-serif leading-[1.65] mb-7 max-w-2xl
            text-[clamp(1rem,1.4vw,1.1rem)]"
        >
          Read and edit code, run commands with approval, and keep context across sessions.
          Choose OAuth, 15 API key providers, or local Ollama and LM Studio. Bring your own skills and MCP tools.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex flex-wrap justify-center gap-3 mb-7"
        >
          <a
            href="https://github.com/hphucdev-04/cube"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#0D0C0A]/90 border border-[#2A2622] hover:border-[#38BDF8]/60 text-[#F5F5F4] text-xs sm:text-sm font-medium transition-all backdrop-blur-sm"
          >
            <GithubIcon className="w-4 h-4 text-[#A8A29E]" />
            <span>View on GitHub</span>
          </a>
          <Link
            href="/docs"
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#0D0C0A]/90 border border-[#2A2622] hover:border-[#38BDF8]/60 text-[#F5F5F4] text-xs sm:text-sm font-medium transition-all backdrop-blur-sm"
          >
            <FileText className="w-4 h-4 text-[#A8A29E]" />
            <span>View Docs</span>
          </Link>
        </motion.div>

        {/* Install box */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-xl mx-auto"
        >
          <InstallBox idPrefix="hero" />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1 z-10 pointer-events-none">
        <span className="font-mono text-[9px] tracking-[0.25em] text-[#57534E]">SCROLL TO EXPLORE THE HARNESS</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#78716C] animate-bounce" />
      </div>
    </section>
  );
}
