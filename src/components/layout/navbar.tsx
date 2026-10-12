"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { GithubIcon, CubeLogoIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface NavSection {
  id: string;
  label: string;
  roman: string;
}

const NAV_SECTIONS: NavSection[] = [
  { id: "hero", label: "Overview", roman: "I" },
  { id: "harness", label: "Harness", roman: "II" },
  { id: "demo", label: "Showcase", roman: "III" },
  { id: "ship", label: "Ship", roman: "IV" },
  { id: "faq", label: "FAQ", roman: "V" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isClickScrolling = useRef(false);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const scrollToSection = (id: string) => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    isClickScrolling.current = true;
    setActiveSection(id);
    setMobileMenuOpen(false);

    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 850);

    if (id === "hero") {
      window.scrollTo({ top: 0, behavior });
      window.history.pushState(null, "", "#hero");
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const elementPosition = Math.ceil(el.getBoundingClientRect().top + window.scrollY);
      window.scrollTo({
        top: Math.max(0, elementPosition - 90),
        behavior,
      });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const fullHeight = document.documentElement.scrollHeight;

          if (scrollY + windowHeight >= fullHeight - 100) {
            setActiveSection("faq");
            ticking = false;
            return;
          }

          if (scrollY < 180) {
            setActiveSection("hero");
            ticking = false;
            return;
          }

          const activationLine = windowHeight * 0.38;
          let currentId = "hero";

          for (let i = 0; i < NAV_SECTIONS.length; i++) {
            const id = NAV_SECTIONS[i].id;
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= activationLine) {
                currentId = id;
              }
            }
          }

          setActiveSection(currentId);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
    };
  }, []);

  return (
    <header className="sticky top-3 z-50 w-full px-4 sm:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between sm:justify-center">
        {/* Architectural Frieze / Entablature Nav */}
        <div className="w-full sm:w-auto pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-3 py-1.5 rounded-sm bg-[#141210]/95 backdrop-blur-md border border-[#2A2622] shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative">
          {/* Brand Logo & Roman Inscription */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 group px-2 py-1 hover:bg-white/[0.04] cursor-pointer select-none text-left transition-colors"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <CubeLogoIcon className="w-5 h-5" />
            </div>
            <span className="font-cinzel font-bold text-sm tracking-widest text-[#F5F5F4]">
              CUBE
            </span>
            <span className="text-[10px] font-mono text-[#3E3833] px-1.5 py-0.2 bg-[#0A0908] border border-[#2A2622] hidden sm:inline-block">
              CLI
            </span>
          </button>

          <span className="hidden sm:inline-block text-[#3E3833] select-none text-xs">|</span>

          {/* Desktop Navigation Links with Roman Numerals */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  aria-current={isActive ? "location" : undefined}
                  className="relative min-h-11 px-3 py-1 rounded-sm text-xs transition-colors cursor-pointer select-none font-mono"
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbarActivePlate"
                      className="absolute inset-0 rounded-sm bg-[#38BDF8]"
                      transition={{ type: "spring", stiffness: 480, damping: 35 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-150 flex items-center gap-1.5",
                      isActive
                        ? "text-[#0A0908] font-bold"
                        : "text-[#A8A29E] hover:text-[#F5F5F4]"
                    )}
                  >
                    <span className={cn("text-[9px] opacity-70", isActive && "text-[#0A0908]")}>
                      {sec.roman}
                    </span>
                    <span>{sec.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <span className="hidden sm:inline-block text-[#3E3833] select-none text-xs">|</span>

          {/* Desktop GitHub Link */}
          <div className="hidden sm:flex items-center pr-1 gap-2">
            <a
              href="https://github.com/hphucdev-04/cube"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 min-w-11 p-1.5 rounded-sm text-[#A8A29E] hover:text-[#F5F5F4] hover:bg-white/[0.04] transition-colors flex items-center justify-center border border-transparent hover:border-[#2A2622]"
              title="View on GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex items-center gap-2 sm:hidden pr-1">
            <span className="text-[11px] font-mono text-[#0A0908] font-bold px-2 py-0.5 rounded-sm bg-[#38BDF8]">
              {NAV_SECTIONS.find((s) => s.id === activeSection)?.label || "Get Started"}
            </span>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-11 min-w-11 p-1.5 text-[#A8A29E] hover:text-[#F5F5F4] transition-colors cursor-pointer"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="sm:hidden mt-2 max-w-sm mx-auto pointer-events-auto rounded-sm bg-[#141210]/95 backdrop-blur-md border border-[#2A2622] p-2.5 flex flex-col gap-1 text-sm shadow-2xl"
          >
            {NAV_SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={cn(
                    "min-h-11 w-full text-left px-3.5 py-2 rounded-sm text-xs flex items-center justify-between transition-colors cursor-pointer font-mono",
                    isActive
                      ? "bg-[#38BDF8] text-[#0A0908] font-bold shadow-sm"
                      : "text-[#A8A29E] hover:text-[#F5F5F4] hover:bg-white/[0.04]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#78716C]">{sec.roman}</span>
                    <span>{sec.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 bg-[#0A0908]" />}
                </button>
              );
            })}

            <div className="pt-2 mt-1 border-t border-[#2A2622] flex items-center justify-between px-2">
              <a
                href="https://github.com/hphucdev-04/cube"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#A8A29E] hover:text-[#F5F5F4] flex items-center gap-1.5 py-1"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <span className="text-[10px] font-mono text-[#78716C]">Cube 0.1.7</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
