"use client";

import { useEffect, useState } from "react";

export function useDownloadCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/downloads", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Downloads unavailable");
        return response.json();
      })
      .then((data: { total?: unknown }) => {
        if (
          !controller.signal.aborted &&
          typeof data.total === "number" &&
          Number.isSafeInteger(data.total) &&
          data.total >= 0
        ) {
          setCount(data.total);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoaded(true);
      });
    return () => controller.abort();
  }, []);

  return { count, loaded };
}

export function DownloadCounterBadge() {
  const { count, loaded } = useDownloadCount();

  return (
    <div role="status" className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-[#A8A29E] px-4 text-center">
      <span className="w-1.5 h-1.5 bg-[#38BDF8] shrink-0" />
      <span className="leading-snug">
        {count !== null ? (
          <>
            <span className="text-[#F5F5F4] font-semibold">{count.toLocaleString()}</span>{" "}
            downloads across Windows, macOS &amp; Linux
          </>
        ) : loaded ? "Download count unavailable" : "Loading download count…"}
      </span>
    </div>
  );
}
