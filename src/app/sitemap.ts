import type { MetadataRoute } from "next";
import { docs } from "@/lib/docs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://cube-agent.pages.dev/",
      lastModified: new Date("2026-10-07T00:00:00Z"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...["/docs", ...docs.map((page) => `/docs/${page.slug}`)].map((path) => ({
      url: `https://cube-agent.pages.dev${path}`,
      lastModified: new Date("2026-10-13T00:00:00Z"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
