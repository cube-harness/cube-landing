import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsArticle, DocsShell } from "@/components/docs/documentation";
import { docs } from "@/lib/docs";

export function generateStaticParams() {
  return docs.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = docs.find((item) => item.slug === slug);
  if (!page) notFound();
  return {
    title: `${page.title} — Cube Docs`,
    description: page.description,
    alternates: { canonical: `/docs/${slug}` },
    openGraph: { title: `${page.title} — Cube Docs`, description: page.description, url: `/docs/${slug}` },
  };
}

export default async function Guide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = docs.find((item) => item.slug === slug);
  if (!page) notFound();
  return <DocsShell current={slug}><DocsArticle page={page} /></DocsShell>;
}
