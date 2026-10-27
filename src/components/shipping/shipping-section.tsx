"use client";

import { useState } from "react";
import { Artwork } from "@/components/visual/artwork";
import { Terminal, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Core capabilities array. Add any new capability label here anytime.
const SHIP_LABELS: string[] = [
  "Multi-Gateway",
  "Persistent-Memory",
  "State",
  "Context-Compression",
  "Tool-Execution",
  "Tool-Pruning",
  "Permissions",
  "Background-Tasks",
  "Skills",
  "SubAgents",
  "MCP",
  "AGENTS.md",
  "SOUL.md",
  "Diff-Preview",
  "Theming",
];

interface CompactPlatform {
  id: "windows" | "macos" | "linux" | "npm" | "pnpm";
  label: string;
  prompt: string;
  command: string;
}

const COMPACT_PLATFORMS: CompactPlatform[] = [
  {
    id: "windows",
    label: "Windows",
    prompt: ">",
    command: "irm https://cube-agent.pages.dev/install.ps1 | iex",
  },
  {
    id: "macos",
    label: "macOS",
    prompt: "$",
    command: "curl -fsSL https://cube-agent.pages.dev/install.sh | bash",
  },
  {
    id: "linux",
    label: "Linux",
    prompt: "$",
    command: "curl -fsSL https://cube-agent.pages.dev/install.sh | bash",
  },
  {
    id: "npm",
    label: "npm",
    prompt: "$",
    command: "npm install -g @cube-harness/cli",
  },
  {
    id: "pnpm",
    label: "pnpm",
    prompt: "$",
    command: "pnpm add -g @cube-harness/cli",
  },
];

export function ShippingSection() {
  const [activePlatform, setActivePlatform] = useState<CompactPlatform["id"]>("windows");
  const [copied, setCopied] = useState(false);

  const activeOpt = COMPACT_PLATFORMS.find((p) => p.id === activePlatform)!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeOpt.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section
      id="ship"
      style={{ zIndex: 25 }}
      className="relative min-h-[75svh] w-full flex flex-col justify-center border-t border-[#3E3833]/80 bg-[#0A0908] overflow-hidden px-6 sm:px-12 md:px-20 lg:px-24 py-24 lg:py-28 shadow-[0_-30px_70px_rgba(0,0,0,0.98),0_-10px_25px_rgba(0,0,0,0.85)]"
    >
      {/* Top hairline highlight for incoming architectural card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#78716C]/60 to-transparent z-30"
      />

      {/* Receding depth wrapper: scales down as FAQ slides over */}
      <div
        className="relative w-full flex flex-col justify-center"
      >
      {/* ── FULL-BLEED PIRANESI BACKDROP (ascii-magic-8.png) ────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        <Artwork
          src="/assets/ascii-magic-8.png"
          className="object-cover object-center contrast-[1.18] brightness-[0.82]"
        />
        {/* Chiaroscuro: dark stone shadow on inscription side, open view on far side */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/96 via-[#0A0908]/65 to-[#0A0908]/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/80 via-transparent to-[#0A0908]/90" />
      </div>

      <div className="reading-plane relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-10 lg:gap-14">
        {/* ── UPPER PART: Bring Cube into your workspace + Labels ────────── */}
        <div>
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141210]/90 border border-[#2A2622] text-xs font-mono mb-3 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-[#38BDF8]" />
            <span className="font-cinzel tracking-wider text-[#F5F5F4]">
              CAPABILITIES // FULL RUNTIME MATRIX
            </span>
          </div>

          {/* Monumental Headline */}
          <h2
            className="font-sans font-semibold tracking-tight text-[#F5F5F4] leading-[1.08] mb-5"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)" }}
          >
            Everything you need to ship
          </h2>

          {/* Minimalist Feature Badges — Sharp Architectural Rectangles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 max-w-3xl">
            {SHIP_LABELS.map((label) => (
              <div
                key={label}
                className="px-3.5 py-1.5 border border-[#2A2622] hover:border-[#38BDF8]/60 bg-[#0D0C0A]/90 backdrop-blur-sm transition-colors flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-[#38BDF8]" />
                <span className="font-mono text-xs sm:text-[13px] text-[#D6D3D1] tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── LOWER PART: Try it in your terminal (Left) + Compact Install (Right) ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12 pt-6 lg:pt-8 border-t border-[#2A2622]/60">
          {/* Left: Try it in your terminal */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-1.5">
              <Terminal className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#F5F5F4] tracking-tight">
                Try it in your terminal
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#A8A29E] font-serif leading-relaxed">
              Install Cube, open your project directory, and run cube. Choose a gateway and model to start.
            </p>
          </div>

          {/* Right: Compact Install Box (Sharp rectangular borders) */}
          <div className="w-full lg:max-w-xl">
            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-1 mb-2">
              {COMPACT_PLATFORMS.map((p) => {
                const isSelected = activePlatform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActivePlatform(p.id);
                      setCopied(false);
                    }}
                    className={cn(
                      "relative min-h-11 px-3.5 py-1 text-xs font-mono transition-colors cursor-pointer select-none",
                      isSelected
                        ? "text-[#0A0908] font-semibold"
                        : "text-[#78716C] hover:text-[#D6D3D1] font-medium"
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="shippingActiveInstallTab"
                        className="absolute inset-0 bg-[#38BDF8] z-0"
                        transition={{ type: "spring", stiffness: 480, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 pointer-events-none">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Single-line Install Command Bar */}
            <div className="bg-[#0D0C0A] border border-[#2A2622] hover:border-[#3E3833] p-2 sm:p-2.5 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 px-1.5 py-0.5 font-mono text-xs sm:text-[13px] whitespace-nowrap overflow-x-auto scrollbar-none min-w-0">
                  <span className="text-[#38BDF8] font-semibold select-none shrink-0">
                    {activeOpt.prompt}
                  </span>
                  <code className="text-[#F5F5F4] select-all whitespace-nowrap shrink-0 block">
                    {activeOpt.command}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "min-h-11 shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer select-none",
                    copied
                      ? "bg-[#38BDF8] text-[#0A0908]"
                      : "bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#0A0908] border border-transparent"
                  )}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

    </section>
  );
}
