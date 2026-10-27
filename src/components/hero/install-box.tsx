"use client";

import { useState, useId } from "react";
import { Check, Copy, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadCounterBadge } from "./download-counter";

interface InstallOption {
  id: "windows" | "linux" | "macos" | "npm" | "pnpm";
  label: string;
  prompt: string;
  command: string;
  platform: string;
}

const INSTALL_OPTIONS: InstallOption[] = [
  {
    id: "windows",
    label: "Windows",
    prompt: ">",
    command: "irm https://cube-agent.pages.dev/install.ps1 | iex",
    platform: "Windows x64",
  },
  {
    id: "macos",
    label: "macOS",
    prompt: "$",
    command: "curl -fsSL https://cube-agent.pages.dev/install.sh | bash",
    platform: "macOS arm64 / x64",
  },
  {
    id: "linux",
    label: "Linux",
    prompt: "$",
    command: "curl -fsSL https://cube-agent.pages.dev/install.sh | bash",
    platform: "Linux / WSL x64",
  },
  {
    id: "npm",
    label: "npm",
    prompt: "$",
    command: "npm install -g @cube-harness/cli",
    platform: "Node.js >=18",
  },
  {
    id: "pnpm",
    label: "pnpm",
    prompt: "$",
    command: "pnpm add -g @cube-harness/cli",
    platform: "Node.js >=18",
  },
];

export function InstallBox({ idPrefix }: { idPrefix?: string }) {
  const autoId = useId();
  const prefix = idPrefix || autoId;
  const [activeTab, setActiveTab] = useState<InstallOption["id"]>("windows");
  const [copied, setCopied] = useState(false);

  const activeOption = INSTALL_OPTIONS.find((opt) => opt.id === activeTab)!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeOption.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div id={idPrefix === "hero" ? "install" : `${prefix}-install`} className="w-full flex flex-col items-center mx-auto">
      {/* Platform Tabs — #38BDF8 active background is the product tab indicator per DESIGN.md */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-1 mb-2.5 max-w-full px-1">
        {INSTALL_OPTIONS.map((opt) => {
          const isSelected = activeTab === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setActiveTab(opt.id);
                setCopied(false);
              }}
              className={cn(
                "relative min-h-11 px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-mono transition-colors cursor-pointer select-none",
                isSelected
                  ? "text-[#0A0908] font-semibold"
                  : "text-[#78716C] hover:text-[#D6D3D1] font-medium"
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId={`${prefix}-activeInstallTab`}
                  className="absolute inset-0 bg-[#38BDF8] z-0"
                  transition={{ type: "spring", stiffness: 480, damping: 35 }}
                />
              )}
              <span className="relative z-10 pointer-events-none">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Terminal Card — stone palette */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="relative group w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl mx-auto"
      >
        <div className="relative bg-[#0D0C0A] border border-[#2A2622] group-hover:border-[#3E3833] p-2 sm:p-2.5 transition-colors">
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            {/* Terminal prompt and command */}
            <div className="flex items-center gap-2 px-1.5 py-0.5 font-mono text-xs sm:text-[13px] whitespace-nowrap overflow-x-auto scrollbar-none min-w-0 flex-1">
              {/* prompt cursor = #38BDF8 per DESIGN.md "con trỏ cube >" */}
              <span className="text-[#38BDF8] font-semibold select-none shrink-0">
                {activeOption.prompt}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.code
                  key={`${prefix}-${activeTab}`}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="text-[#F5F5F4] select-all whitespace-nowrap shrink-0 block"
                >
                  {activeOption.command}
                </motion.code>
              </AnimatePresence>
            </div>

            {/* Copy button — #38BDF8 on active/hover per DESIGN.md "active tabs" */}
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "min-h-11 shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer",
                copied
                  ? "bg-[#38BDF8] text-[#0A0908]"
                  : "bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#0A0908] border border-transparent"
              )}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
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
      </motion.div>

      {/* Verification notes — stone palette */}
      <div className="mt-3 max-w-full flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4 text-[11px] sm:text-xs text-[#78716C] font-mono">
        <span className="flex items-center gap-1.5 text-[#A8A29E] shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A8A29E]" />
          <span>SHA-256 Verified Release</span>
        </span>
        <span className="text-[#2A2622] select-none shrink-0">·</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={`${prefix}-${activeTab}`}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.15 }}
            className="min-w-0 text-center"
          >
            {activeOption.platform}
          </motion.span>
        </AnimatePresence>
        <span className="text-[#2A2622] select-none shrink-0">·</span>
      </div>

      {/* Live Download / Install Counter Badge */}
      <DownloadCounterBadge />
    </div>
  );
}
