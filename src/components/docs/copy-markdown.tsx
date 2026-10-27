"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyMarkdown({ markdown }: { markdown: string }) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  async function copy() {
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(markdown);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div>
      <button type="button" onClick={copy} disabled={status === "copying"}
        className="flex min-h-10 items-center gap-2 rounded-sm border border-[#2A2622] bg-[#141210] px-3 font-mono text-xs text-[#38BDF8] hover:border-[#38BDF8]/60 disabled:opacity-60">
        {status === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span aria-live="polite">{status === "copied" ? "Copied" : status === "copying" ? "Copying…" : "Copy Markdown"}</span>
      </button>
      {status === "error" && <p role="status" className="mt-2 text-xs text-[#A8A29E]">Clipboard unavailable. Open raw Markdown to copy manually.</p>}
    </div>
  );
}
