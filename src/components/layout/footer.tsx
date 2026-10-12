"use client";

import { GithubIcon, CubeLogoIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="relative w-full border-t border-[#2A2622] bg-[#0A0908] px-6 sm:px-12 md:px-20 lg:px-24 py-6 z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#78716C]">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 flex items-center justify-center">
            <CubeLogoIcon className="w-4 h-4" />
          </div>
          <span className="font-cinzel font-bold text-xs text-[#F5F5F4]">
            CUBE
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#141210] text-[#78716C] border border-[#2A2622]">
            0.1.7
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center gap-5 text-xs text-[#A8A29E]">
          <a href="#hero" className="hover:text-[#F5F5F4] transition-colors">
            Overview
          </a>
          <a href="#harness" className="hover:text-[#F5F5F4] transition-colors">
            Harness
          </a>
          <a href="#demo" className="hover:text-[#F5F5F4] transition-colors">
            Showcase
          </a>
          <a href="#ship" className="hover:text-[#F5F5F4] transition-colors">
            Ship
          </a>
          <a href="#faq" className="hover:text-[#F5F5F4] transition-colors">
            FAQ
          </a>
        </div>

        {/* Contact / Social Links */}
        <div className="flex items-center gap-4 text-[11px] text-[#78716C]">
          <a
            href="https://github.com/hphucdev-04/cube"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#F5F5F4] transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <span className="text-[#3E3833]">·</span>
          <a
            href="mailto:phuc.ph24012004@gmail.com"
            className="hover:text-[#F5F5F4] transition-colors"
          >
            phuc.ph24012004@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
