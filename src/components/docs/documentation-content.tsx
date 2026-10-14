"use client";

import type { MouseEvent } from "react";

export function DocumentationContent({ html, codeBlocks }: { html: string; codeBlocks: string[] }) {
  async function copyCode(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>("button[data-copy-code]");
    if (!button || !event.currentTarget.contains(button) || button.disabled) return;
    const code = codeBlocks[Number(button.dataset.copyCode)];
    if (code === undefined) return;
    const status = button.querySelector<HTMLElement>("[data-copy-status]");
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(code);
      button.dataset.copied = "true";
      if (status) status.textContent = "Copied";
    } catch {
      delete button.dataset.copied;
      if (status) status.textContent = "Copy failed — retry";
    } finally {
      button.title = status?.textContent ?? "Copy code";
      button.disabled = false;
    }
  }

  return <div className="docs-prose" onClick={copyCode} dangerouslySetInnerHTML={{ __html: html }} />;
}
