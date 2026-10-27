"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/** Keep the original etching at full resolution; load each chamber near entry. */
export function Artwork({
  src,
  className,
  eager = false,
}: {
  src: string;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {(eager || visible) && (
        <Image
          src={src.replace(/\.png$/, ".webp")}
          alt=""
          fill
          preload={eager}
          sizes="100vw"
          className={className}
        />
      )}
    </div>
  );
}
