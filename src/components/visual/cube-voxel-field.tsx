"use client";

import { useEffect, useRef } from "react";

interface AsciiGlyph {
  x: number;
  y: number;
  char: string;
  opacity: number;
  isCyan: boolean;
  size: number;
}

const GLYPH_CHARS = ["·", "+", "▫", "::", "—", ".", "~", "×", "▪", "•"];

export function CubeVoxelField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isVisible = true;

    let glyphs: AsciiGlyph[] = [];

    const initGlyphs = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      glyphs = [];
      // Density: delicate artisanal dither texture across viewport
      const cellStep = Math.max(36, Math.floor(width / 38));
      const cols = Math.ceil(width / cellStep);
      const rows = Math.ceil(height / cellStep);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Semi-random scatter with dither feel
          if (Math.random() > 0.45) continue;

          const x = c * cellStep + (Math.random() * 14 - 7);
          const y = r * cellStep + (Math.random() * 14 - 7);

          // Distance from center to soften behind main text
          const dx = (x - width / 2) / (width / 2);
          const dy = (y - height / 2.2) / (height / 2.2);
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);

          // Clearer reading zone in center
          if (distFromCenter < 0.35 && Math.random() > 0.15) continue;

          const isCyan = Math.random() < 0.08; // Rare cold steel cyan accent
          const opacity = isCyan
            ? 0.15 + Math.random() * 0.15
            : 0.04 + Math.random() * 0.12;

          const char = GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)];
          const size = isCyan ? 11 : 9 + Math.floor(Math.random() * 3);

          glyphs.push({
            x,
            y,
            char,
            opacity,
            isCyan,
            size,
          });
        }
      }
    };

    const draw = () => {
      if (!ctx || !isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle organic dither field
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        ctx.font = `${g.size}px "JetBrains Mono", monospace`;

        if (g.isCyan) {
          ctx.fillStyle = `rgba(56, 189, 248, ${g.opacity})`;
        } else {
          ctx.fillStyle = `rgba(214, 211, 209, ${g.opacity})`;
        }

        ctx.fillText(g.char, g.x, g.y);
      }
    };

    initGlyphs();
    draw();

    // Redraw on resize
    const handleResize = () => {
      initGlyphs();
      draw();
    };

    // Tab visibility handling
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) draw();
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Deep atmospheric stone radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(56,189,248,0.05),transparent_70%)]" />

      {/* Artisanal ASCII Dither Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full opacity-70"
      />

      {/* Soft stone vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0A0908_100%)] pointer-events-none" />
    </div>
  );
}
