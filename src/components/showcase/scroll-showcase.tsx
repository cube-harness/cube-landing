"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { Terminal, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Artwork } from "@/components/visual/artwork";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface ShowcaseFeature {
  id: string;
  code: string;
  label: string;
  roman: string;
  featureNum: string;
  title: string;
  tagline: string;
  bgAsset: string;
  // bgFocus: object-position for this image
  bgFocus: string;
  videoSrc?: string;
  description: string;
  bullets: string[];
}

const ALL_6_FEATURES: ShowcaseFeature[] = [
  {
    id: "gateway",
    code: "I",
    label: "Gateway",
    roman: "FEATURE I",
    featureNum: "I // VI",
    title: "Multi-Gateway Model Matrix",
    tagline: "Choose your account, API provider, or local model.",
    // ascii-magic-3: the receding arched corridor — perfect for "gateway"
    bgAsset: "/assets/ascii-magic-1.png",
    bgFocus: "object-center",
    videoSrc: "/demos/gateway.mp4",
    description:
      "Choose OAuth for Anthropic, OpenAI, xAI, or Google, API keys from 15 supported providers, or a local Ollama/LM Studio server. Switch gateways and models from the terminal.",
    bullets: [
      "OAuth sign-in for four providers",
      "15 API key providers, including OpenRouter",
      "Local inference via Ollama / LM Studio",
    ],
  },
  {
    id: "skill",
    code: "II",
    label: "Skill",
    roman: "FEATURE II",
    featureNum: "II // VI",
    title: "Workspace Skill & Rule Discovery",
    tagline: "Repository guidelines right where you code.",
    // ascii-magic-2: ascending spiral staircase — recursive hierarchy
    bgAsset: "/assets/ascii-magic-2.png",
    bgFocus: "object-center",
    videoSrc: "/demos/skill.mp4",
    description:
      "Cube loads workspace and global AGENTS.md instructions, then discovers scoped rules as tools explore files. Project and global SKILL.md files add reusable guidance to the agent.",
    bullets: [
      "Scoped AGENTS.md discovery inside the workspace",
      "Enable or disable project and global skills with /skills",
      "Refresh project instructions with /reload",
    ],
  },
  {
    id: "hitl",
    code: "III",
    label: "HITL",
    roman: "FEATURE III",
    featureNum: "III // VI",
    title: "Human-in-the-Loop Safeguards",
    tagline: "Configure which tools need your approval.",
    // ascii-magic-1: mechanical trusses, chains — guardrails
    bgAsset: "/assets/ascii-magic-3.png",
    bgFocus: "object-center",
    videoSrc: "/demos/hitl.mp4",
    description:
      "File edits, writes, patches, and shell commands require approval by default. Review pending file changes in the terminal and configure workspace boundaries and tool policies with /permissions.",
    bullets: [
      "Approval for host shell commands by default",
      "Diff previews for pending file changes",
      "Allow, ask, or deny policies for file and MCP tools",
    ],
  },
  {
    id: "qa",
    code: "IV",
    label: "Q&A",
    roman: "FEATURE IV",
    featureNum: "IV // VI",
    title: "Interactive Terminal Q&A",
    tagline: "Pause to ask. Select answers directly in your shell.",
    // ascii-magic-4: branching stairways & meander frieze — many paths
    bgAsset: "/assets/ascii-magic-4.png",
    bgFocus: "object-center",
    videoSrc: "/demos/qa.mp4",
    description:
      "The agent can ask for clarification through the ask_user tool. Choose a suggested answer or enter your own response in the terminal, then continue the task with that context.",
    bullets: [
      "Arrow-key option selection directly inside the terminal",
      "Suggested choices and free-text answers",
      "Continue the conversation after answering",
    ],
  },
  {
    id: "mcp",
    code: "V",
    label: "MCP",
    roman: "FEATURE V",
    featureNum: "V // VI",
    title: "Model Context Protocol Foundation",
    tagline: "Bring external tools into your coding workflow.",
    // ascii-magic-6: grand colonnade hall — universal connection
    bgAsset: "/assets/ascii-magic-5.png",
    bgFocus: "object-center",
    videoSrc: "/demos/mcp.mp4",
    description:
      "Configure MCP servers in mcp.json and manage their connections, tools, and supported authentication flows with /mcp. Connected tools join the agent's toolset and follow your permission policies.",
    bullets: [
      "Local stdio and remote HTTP server connections",
      "Inspect server status and available tools with /mcp",
      "MCP OAuth support and per-tool permissions",
    ],
  },
  {
    id: "subagent",
    code: "VI",
    label: "Subagent",
    roman: "FEATURE VI",
    featureNum: "VI // VI",
    title: "Parallel Subagent Delegation",
    tagline: "Delegate focused tasks to subagents.",
    // ascii-magic-5: concurrent vaults & scaffolding — parallel execution
    bgAsset: "/assets/ascii-magic-6.png",
    bgFocus: "object-top",
    description:
      "Break a larger coding task into focused assignments for subagents. Delegate independent exploration and implementation work, then bring their findings back into the main conversation.",
    bullets: [
      "Focused assignments for each subagent",
      "Parallel work on independent subtasks",
      "Findings returned to the main conversation",
    ],
  },
];

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function DemoPlayer({ feat, playedVideos, inView, reducedMotion }: {
  feat: ShowcaseFeature;
  playedVideos: RefObject<Set<string>>;
  inView: boolean;
  reducedMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInView = useInView(playerRef, { amount: 0.5 });

  // Autoplay each recording once per page visit, only when its player is visible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!inView || !playerInView) {
      video.pause();
      return;
    }
    if (reducedMotion || playedVideos.current.has(feat.id)) return;

    let active = true;
    video
      .play()
      .then(() => {
        if (active) playedVideos.current.add(feat.id);
      })
      .catch(() => {});
    return () => {
      active = false;
      video.pause();
    };
  }, [feat.id, inView, playerInView, playedVideos, reducedMotion]);

  return (
          <div ref={playerRef} className="min-w-0">
            <div className="plate-frame bg-[#0D0C0A]/95">
              <div className="px-4 py-3 border-b border-[#2A2622] flex items-center justify-between gap-3 font-mono text-[11px] text-[#A8A29E]">
                <span className="flex items-center gap-2"><Terminal aria-hidden="true" className="w-4 h-4" />cube / {feat.label.toLowerCase()}</span>
                <span>{feat.videoSrc ? "RECORDING" : "COMING SOON"}</span>
              </div>
              {feat.videoSrc ? (
                <video
                  key={feat.id}
                  ref={videoRef}
                  src={inView ? feat.videoSrc : undefined}
                  controls
                  onPlay={() => playedVideos.current.add(feat.id)}
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={`${feat.label} terminal demo recording`}
                  className="block w-full aspect-video object-contain bg-[#0A0908]"
                />
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center gap-3 text-center px-6">
                  <Terminal aria-hidden="true" className="w-8 h-8 text-[#78716C]" />
                  <p className="font-cinzel text-sm text-[#D6D3D1]">Subagent demo</p>
                  <p className="font-mono text-xs text-[#A8A29E]">Recording coming soon.</p>
                </div>
              )}
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-[#A8A29E] mt-4">
              {feat.videoSrc ? "Recorded terminal demo. Plays once in view; replay, seek, or open fullscreen." : "Focused delegation, parallel subtasks, and findings returned to the main conversation."}
            </p>
          </div>
  );
}

export function ScrollShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const playedVideos = useRef(new Set<string>());
  const [backgroundFeature, setBackgroundFeature] = useState(ALL_6_FEATURES[0]);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const inView = useInView(sectionRef, { margin: "100px" });

  const feat = ALL_6_FEATURES[activeIdx];

  // Keep the current plate visible until the next full-resolution etching is decoded.
  useEffect(() => {
    if (!inView) return;
    let active = true;
    const image = new window.Image();
    image.src = feat.bgAsset.replace(/\.png$/, ".webp");
    image.decode().then(() => {
      if (active) setBackgroundFeature(feat);
    }).catch(() => {});
    return () => { active = false; };
  }, [feat, inView]);

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="relative z-20"
    >
      <div className="showcase-stage relative w-full overflow-hidden bg-[#0A0908] border-t border-[#3E3833]/80 chamber-shadow">
        {/* One full-bleed plate: the image remains the architectural space. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={backgroundFeature.id}
            aria-hidden="true"
            className="showcase-backdrop absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: reducedMotion ? 0 : 0.2, duration: reducedMotion ? 0 : 0.4 } }}
            transition={{ duration: reducedMotion ? 0 : 0.6, ease: "easeOut" }}
          >
            <Artwork
              src={backgroundFeature.bgAsset}
              className={cn("object-cover contrast-[1.12] brightness-[0.86]", backgroundFeature.bgFocus)}
            />
          </motion.div>
        </AnimatePresence>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/90 via-[#0A0908]/40 to-[#0A0908]/20" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/65 via-transparent to-[#0A0908]/85" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#78716C]/60 to-transparent" />
          <div className="hidden lg:block absolute inset-y-0 left-[42%] w-px bg-[#3E3833]/35" />
          <div className="absolute inset-x-0 top-1/3 h-px bg-[#3E3833]/20" />
          <div className="absolute inset-x-0 bottom-1/3 h-px bg-[#3E3833]/20" />
        </div>

        <div className="relative z-10 px-6 sm:px-12 md:px-20 lg:px-24 pt-24 pb-6 border-b border-[#2A2622]/60">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="font-cinzel text-xs font-bold text-[#D6D3D1] tracking-wider">
              TERMINAL SHOWCASE
            </span>
            <span className="font-mono text-[11px] text-[#A8A29E]">{feat.featureNum}</span>
          </div>
          <div className="flex flex-wrap gap-1" role="tablist" aria-label="Showcase features">
            {ALL_6_FEATURES.map((feature, index) => (
              <button
                key={feature.id}
                id={`demo-tab-${feature.id}`}
                type="button"
                role="tab"
                aria-selected={index === activeIdx}
                aria-controls="demo-panel"
                tabIndex={index === activeIdx ? 0 : -1}
                onClick={() => setActiveIdx(index)}
                onKeyDown={(event) => {
                  const next = event.key === "ArrowRight" ? (index + 1) % 6
                    : event.key === "ArrowLeft" ? (index + 5) % 6
                    : event.key === "Home" ? 0 : event.key === "End" ? 5 : null;
                  if (next === null) return;
                  event.preventDefault();
                  setActiveIdx(next);
                  document.getElementById(`demo-tab-${ALL_6_FEATURES[next].id}`)?.focus({ preventScroll: true });
                }}
                className={cn(
                  "min-h-11 px-3 border-b font-mono text-xs cursor-pointer transition-colors",
                  index === activeIdx
                    ? "border-[#38BDF8] text-[#F5F5F4] bg-[#0D0C0A]/85"
                    : "border-transparent text-[#A8A29E] hover:text-[#F5F5F4]",
                )}
              >
                <span className="mr-2 text-[10px] text-[#78716C]">{feature.code}</span>
                {feature.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={feat.id}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
          transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          id="demo-panel"
          role="tabpanel"
          aria-labelledby={`demo-tab-${feat.id}`}
          className="relative z-10 grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 lg:gap-10 px-6 sm:px-12 md:px-20 lg:px-24 py-10 lg:py-12 items-center flex-1"
        >
          {ALL_6_FEATURES.map((feature, index) => (
            <div key={feature.id} data-demo-copy={feature.id} hidden={index !== activeIdx} className="relative reading-plane">
              <div aria-hidden="true" className="hidden lg:block font-cinzel text-[#F5F5F4]/[0.06] leading-none select-none text-[clamp(5rem,12vw,10rem)] -ml-1 mb-[-3rem]">
                {feature.code}
              </div>
              <div className="relative">
                <p className="font-mono text-xs text-[#A8A29E] mb-3 leading-relaxed">├── {feature.tagline}</p>
                <h2 className="font-sans font-semibold text-[#F5F5F4] leading-[1.1] mb-4 text-[clamp(1.6rem,3vw,2.6rem)]">
                  {feature.title}
                </h2>
                <p className="text-[#D6D3D1] font-serif leading-relaxed text-base mb-6">{feature.description}</p>
                <ul className="space-y-3 pt-4 border-t border-[#3E3833]/50">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-xs leading-relaxed text-[#D6D3D1] font-mono">
                      <Check aria-hidden="true" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A8A29E]" />
                      <span>{bullet}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>
          ))}

          <DemoPlayer feat={feat} playedVideos={playedVideos} inView={inView} reducedMotion={reducedMotion} />
        </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex items-center justify-between gap-4 px-6 sm:px-12 md:px-20 lg:px-24 py-5 border-t border-[#2A2622]/60">
          <button type="button" onClick={() => setActiveIdx((activeIdx + 5) % 6)} aria-label="Previous demo" className="min-h-11 flex items-center gap-2 font-mono text-xs text-[#D6D3D1] cursor-pointer">
            <ChevronLeft aria-hidden="true" className="w-4 h-4" />Previous
          </button>
          <span className="hidden sm:block font-cinzel text-[11px] tracking-wider text-[#78716C]">PLATE {feat.featureNum}</span>
          <button type="button" onClick={() => setActiveIdx((activeIdx + 1) % 6)} aria-label="Next demo" className="min-h-11 flex items-center gap-2 font-mono text-xs text-[#D6D3D1] cursor-pointer">
            Next<ChevronRight aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
