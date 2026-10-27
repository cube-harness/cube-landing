"use client";

import { useEffect, type RefObject } from "react";

/** Let a tall chamber scroll into view before pinning its bottom to the viewport. */
export function useStickyViewport(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const top = Math.min(0, window.innerHeight - element.offsetHeight);
      element.style.setProperty("--sticky-top", `${top}px`);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      element.style.removeProperty("--sticky-top");
    };
  }, [ref]);
}
