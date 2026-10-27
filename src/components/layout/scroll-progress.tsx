"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = document.documentElement.scrollHeight - window.innerHeight;
      setPercent(travel > 0 ? Math.min(100, Math.round((window.scrollY / travel) * 100)) : 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 font-mono text-[10px] text-[#F5F5F4]">
      <span className="w-1.5 h-1.5 bg-[#38BDF8]" />
      <span className="text-[#38BDF8] font-bold">{percent}%</span>
    </div>
  );
}
