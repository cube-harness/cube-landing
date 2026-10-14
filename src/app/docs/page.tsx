import type { Metadata } from "next";
import { DocsArticle, DocsShell } from "@/components/docs/documentation";
import { overview } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Documentation — Cube",
  description: "Install and configure Cube: gateways, models, permissions, skills, MCP, subagents, context and durable memory.",
  alternates: { canonical: "/docs" },
  openGraph: { title: "Documentation — Cube", url: "/docs", description: "User guides and complete configuration reference for Cube." },
};

export default function Documentation() {
  return <DocsShell><DocsArticle page={overview} /></DocsShell>;
}
