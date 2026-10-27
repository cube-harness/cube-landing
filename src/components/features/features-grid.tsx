"use client";

import { useRef, type ReactNode } from "react";
import { Artwork } from "@/components/visual/artwork";
import { useStickyViewport } from "@/lib/use-sticky-viewport";
import {
  RotateCw,
  Wrench,
  Layers,
  Brain,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HarnessBay {
  id: string;
  roman: string;
  code: string;
  name: string;
  archType: string;
  icon: typeof RotateCw;
  capability: string;
  bgAsset: string;
  bgFocus: string;
  conceptSummary: string;
  specs: string[];
}

const HARNESS_BAYS: HarnessBay[] = [
  {
    id: "loop", roman: "I // AGENT LOOP", code: "I",
    name: "The Coding Agent Loop", archType: "Reasoning & Tool Execution", icon: RotateCw,
    capability: "Read → Edit → Run → Inspect",
    bgAsset: "/assets/ascii-magic-6.png", bgFocus: "object-center",
    conceptSummary: "Work through coding tasks in your terminal. Cube reads files, edits text or applies patches, runs commands, and feeds tool results back to the model. Responses and tool activity stream into the conversation.",
    specs: ["Streaming Responses", "File Tools", "Shell Commands", "Tool Feedback"],
  },
  {
    id: "context", roman: "II // CONTEXT", code: "II",
    name: "Context Management", archType: "Project Rules & Conversation Budget", icon: Layers,
    capability: "Scoped AGENTS.md Rules & Context Compaction",
    bgAsset: "/assets/ascii-magic-5.png", bgFocus: "object-center",
    conceptSummary: "Load workspace and global AGENTS.md instructions, discover scoped rules as files are explored, and enable project or global skills. Context budgeting prunes older tool output and compacts conversation history while keeping tool exchanges together.",
    specs: ["AGENTS.md Discovery", "Scoped Instructions", "Skill Loading", "Context Compaction"],
  },
  {
    id: "tools", roman: "III // TOOLS & EXECUTION", code: "III",
    name: "File & Command Tools", archType: "Workspace IO & Host Commands", icon: Wrench,
    capability: "Targeted Edits, Patches & Process Control",
    bgAsset: "/assets/ascii-magic-4.png", bgFocus: "object-center",
    conceptSummary: "Read and list files, make targeted text edits, or apply patches. File paths and command working directories stay within the workspace by default. Commands run on your host with configurable timeouts; tool permissions control approval.",
    specs: ["Text Edits & Patches", "Workspace Boundaries", "Host Shell", "Command Timeouts"],
  },
  {
    id: "memory", roman: "IV // STATE & MEMORY", code: "IV",
    name: "Local State & Memory", archType: "SQLite History & Durable Memory", icon: Brain,
    capability: "Resume, Fork & Recall Across Sessions",
    bgAsset: "/assets/ascii-magic-3.png", bgFocus: "object-center",
    conceptSummary: "Keep conversation history and memory on your machine. Resume or fork threads, and recall durable notes about preferences and project decisions. Optional semantic recall adds embedding-based search over historical messages.",
    specs: ["Local SQLite", "Resume & Fork", "Durable Memory", "Optional Semantic Recall"],
  },
  {
    id: "guardrails", roman: "V // PERMISSIONS & SAFETY", code: "V",
    name: "Permissions & HITL", archType: "Workspace Trust & Tool Policies", icon: ShieldCheck,
    capability: "Allow, Ask or Deny Per Tool",
    bgAsset: "/assets/ascii-magic-2.png", bgFocus: "object-top",
    conceptSummary: "Trust a workspace before starting. File writes, edits, patches, and shell commands ask for approval by default. Review file changes and use /permissions to configure tool policies, including connected MCP tools.",
    specs: ["Workspace Trust", "Diff Previews", "Tool Approval", "MCP Permissions"],
  },
  {
    id: "orchestration", roman: "VI // BACKGROUND TASKS", code: "VI",
    name: "Background Processes", archType: "Managed Commands & Runtime Events", icon: Activity,
    capability: "Run, Inspect & Stop Long-Running Commands",
    bgAsset: "/assets/ascii-magic-1.png", bgFocus: "object-center",
    conceptSummary: "Run builds, tests, and other long-running commands in the background. Cube tracks process output and completion, limits concurrency, and reports status to the conversation. Use /tasks to inspect or stop managed processes.",
    specs: ["Background Commands", "Concurrency Limits", "Process Output", "/tasks Controls"],
  },
];

/** A single full-screen subsystem card.
 *  Uses sticky stacking cards: each card pins at top-0, and subsequent cards
 *  slide up from below and overlay over the previous card, while the card underneath
 *  recedes subtly in scale and darkness.
 */
function SubsystemCard({
  bay,
  index,
  total,
}: {
  bay: HarnessBay;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useStickyViewport(ref);
  const Icon = bay.icon;
  const isEven = index % 2 === 0;

  // Track scroll while this chamber is active at top of viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // When next chamber (or Showcase for the last card) slides over:
  // scale down subtly (1 -> 0.94) and fade in dark shadow veil (0 -> 0.55)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const veilOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  return (
    <div
      ref={ref}
      style={{
        zIndex: 10 + index,
        maskImage: index > 0 ? "linear-gradient(to bottom, transparent, black 64px)" : undefined,
      }}
      className="harness-card w-full overflow-hidden flex items-center bg-[#0A0908]"
      aria-label={`${bay.roman}: ${bay.name}`}
    >
      {/* Receding depth wrapper (scales down as card underneath) */}
      <motion.div
        style={{ scale }}
        className="harness-stage relative w-full flex items-center origin-top"
      >
        {/* ── FULL-BLEED PIRANESI BACKDROP ────────────────────────────
            The artwork IS the architectural space. Not an image in a box.
            ──────────────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 select-none"
        >
          <Artwork
            src={bay.bgAsset}
            className={`object-cover contrast-[1.15] brightness-[0.78] ${bay.bgFocus}`}
          />
          {/* Chiaroscuro: heavy stone shadow on inscription side, open view on the far side */}
          {isEven ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/96 via-[#0A0908]/55 to-[#0A0908]/15" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908] via-transparent to-[#0A0908]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-l from-[#0A0908]/96 via-[#0A0908]/55 to-[#0A0908]/15" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908] via-transparent to-[#0A0908]" />
            </>
          )}
        </div>

        {/* ── DATUM LINES — stone mortar hairlines, no cyan ──────── */}
        <div aria-hidden="true" className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute left-0 right-0 h-px bg-[#3E3833]/25" style={{ top: "33%" }} />
          <div className="absolute left-0 right-0 h-px bg-[#2A2622]/30" style={{ top: "66%" }} />
          <div
            className="absolute top-0 bottom-0 w-px bg-[#3E3833]/20"
            style={{ left: isEven ? "55%" : "45%" }}
          />
        </div>

        {/* ── CONTENT: INSCRIPTION ON STONE ───────────────────────── */}
        <div
          className={`relative z-10 w-full flex ${isEven ? "justify-start" : "lg:justify-end"} px-6 sm:px-12 md:px-20 lg:px-24`}
        >
          <div className={`reading-plane relative max-w-xl lg:max-w-[min(46rem,56vw)] w-full ${isEven ? "" : "lg:text-right"}`}>

            {/* Giant dim stone ordinal — Piranesi scale, limestone tone */}
            <div
              aria-hidden="true"
              className="font-cinzel font-bold text-[#F5F5F4]/[0.05] leading-none select-none mb-0 -mt-6"
              style={{ fontSize: "clamp(5rem,18vw,13rem)" }}
            >
              {bay.code}
            </div>

            {/* Pier label — carved above the numeral */}
            <div className={`-mt-6 sm:-mt-10 lg:-mt-14 relative z-10 ${isEven ? "" : "flex flex-col lg:items-end"}`}>

              {/* Roman label + arch type */}
              <div className={`flex items-center gap-3 mb-3.5 ${isEven ? "" : "lg:flex-row-reverse"}`}>
                <div className="flex items-center justify-center w-8 h-8 border border-[#3E3833] bg-[#0A0908]/80 backdrop-blur-sm">
                  <Icon className="w-4 h-4 text-[#A8A29E]" />
                </div>
                <div>
                  <span className="font-cinzel text-xs sm:text-[13px] font-bold text-[#E7E5E4] tracking-[0.22em]">
                    {bay.roman}
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs text-[#A8A29E] block lg:inline lg:ml-2.5">
                    {bay.archType}
                  </span>
                </div>
              </div>

              {/* Name — monumental limestone inscription */}
              <h3
                className="font-sans font-semibold text-[#F5F5F4] leading-[1.08] mb-3.5"
                style={{ fontSize: "clamp(2rem, 4.4vw, 3.5rem)" }}
              >
                {bay.name}
              </h3>

              {/* Capability — surveyor's note in mono, muted stone */}
              <div className={`font-mono text-xs sm:text-[13px] text-[#A8A29E] mb-5 tracking-wide ${isEven ? "" : "lg:text-right"}`}>
                ├── {bay.capability}
              </div>

              {/* Summary — etched parchment text */}
              <p className={`text-[#D6D3D1] font-serif leading-relaxed mb-6 text-base lg:text-[1.08rem] ${isEven ? "" : "lg:text-right"}`}>
                {bay.conceptSummary}
              </p>

              {/* Spec tags — stone-tone mortar borders, no cyan */}
              <div className={`flex flex-wrap gap-2 ${isEven ? "" : "lg:justify-end"}`}>
                {bay.specs.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono px-3 py-1 border border-[#3E3833]/80 text-[#A8A29E] bg-[#0A0908]/75 backdrop-blur-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SUBSYSTEM INDEX CALIPER — clear of left sidebar (w-16 = 64px) ── */}
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-6 sm:left-10 md:left-20 lg:left-24 z-10 font-mono text-[10px] text-[#3E3833] flex items-center gap-2"
        >
          <span className="w-4 h-px bg-[#3E3833]/60" />
          <span>SUBSYSTEM {bay.code}{" // VI"}</span>
          <span className="w-4 h-px bg-[#3E3833]/60" />
        </div>

        {/* ── SCROLL CUE — clear of right sidebar (w-16 = 64px) ──── */}
        {index < total - 1 && (
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-5 right-6 sm:right-10 md:right-20 lg:right-24 z-10 flex flex-col items-center gap-1 pointer-events-none"
          >
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#78716C]">NEXT SUBSYSTEM</span>
            <div className="w-px h-5 bg-gradient-to-b from-[#78716C]/40 to-transparent" />
          </motion.div>
        )}

        {/* Subterranean darkness veil: recedes into shadow as next card slides on top */}
        <motion.div
          style={{ opacity: veilOpacity }}
          aria-hidden="true"
          className="depth-veil pointer-events-none absolute inset-0 z-30 bg-[#0A0908]"
        />
      </motion.div>
    </div>
  );
}

export function FeaturesGrid({ children }: { children?: ReactNode }) {
  return (
    <div className="relative w-full bg-[#0A0908]">

      {/* ── SECTION HEADER — entablature frieze ─────────────────── */}
      <div id="harness" className="relative w-full border-t border-b border-[#2A2622] bg-[#0A0908] px-6 sm:px-12 md:px-20 py-10 overflow-hidden">
        {/* ── AUTHENTIC PIRANESI ARCHITECTURAL DRAFTING BACKGROUND (SAME AS FAQ) ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
          {/* Ambient technical cyan glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(56,189,248,0.04),transparent_75%)]" />

          {/* Fine Acid Crosshatch Etching Texture */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.032) 0px, rgba(255, 255, 255, 0.032) 1px, transparent 1px, transparent 7px), repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.032) 0px, rgba(255, 255, 255, 0.032) 1px, transparent 1px, transparent 7px)",
            }}
          />

          {/* Architectural Surveyor Blueprint Grid with Crosshairs (Pure SVG) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="harnessArchitectGrid" width="64" height="64" patternUnits="userSpaceOnUse">
                {/* Subtle grid lines */}
                <path
                  d="M 64 0 L 0 0 0 64"
                  fill="none"
                  stroke="#3E3833"
                  strokeWidth="0.5"
                  strokeDasharray="2 4"
                  opacity="0.45"
                />
                {/* Surveyor crosshair at intersection (┼) */}
                <path
                  d="M -3 0 L 3 0 M 0 -3 L 0 3"
                  stroke="#78716C"
                  strokeWidth="0.75"
                  opacity="0.6"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#harnessArchitectGrid)" />
          </svg>
        </div>

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141210] border border-[#2A2622] text-xs font-mono mb-4">
              {/* #38BDF8 only for the active-indicator dot — product accent */}
              <span className="w-1.5 h-1.5 bg-[#38BDF8]" />
              <span className="font-cinzel tracking-wider text-[#F5F5F4]">
                SYSTEM HARNESS // VI RUNTIME PILLARS
              </span>
            </div>
            <h2
              className="font-sans font-semibold tracking-tight text-[#F5F5F4] leading-[1.06]"
              style={{ fontSize: "clamp(1.8rem,4.5vw,3.5rem)" }}
            >
              Inside the Agent Harness
            </h2>
            <p className="mt-2 text-sm text-[#A8A29E] max-w-2xl font-serif">
              Six runtime subsystems behind the coding loop, workspace context, tools, memory, permissions, and background commands.
            </p>
          </div>

          <div className="shrink-0 flex flex-col lg:items-end gap-1">
            <div className="text-xs font-mono text-[#A8A29E]">VI // RUNTIME SUBSYSTEMS</div>
            <div className="text-[10px] font-mono text-[#3E3833]">AUTONOMOUS AGENT HARNESS</div>
          </div>
        </div>
      </div>

      {/* ── 6 FULL-SCREEN SUBSYSTEM CARDS + SUBSEQUENT STACKING SECTIONS ── */}
      <div className="relative w-full">
        {HARNESS_BAYS.map((bay, index) => (
          <SubsystemCard
            key={bay.id}
            bay={bay}
            index={index}
            total={HARNESS_BAYS.length}
          />
        ))}

        {children}
      </div>
    </div>
  );
}
