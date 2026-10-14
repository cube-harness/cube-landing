"use client";

import type { MouseEvent } from "react";

export function DocumentationContent({ html, codeBlocks }: { html: string; codeBlocks: string[] }) {
  async function copyCode(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>("button[data-copy-code]");
    if (!button || !event.currentTarget.contains(button) || button.disabled) return;
    const code = codeBlocks[Number(button.dataset.copyCode)];
    if (code === undefined) return;
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Copy failed — retry";
    } finally {
      button.disabled = false;
    }
  }

  return <div className="docs-prose" onClick={copyCode} dangerouslySetInnerHTML={{ __html: html }} />;
}
