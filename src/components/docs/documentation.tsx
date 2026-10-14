import Link from "next/link";
import type { ReactNode } from "react";
import { CubeLogoIcon } from "@/components/ui/icons";
import { docs, type DocPage } from "@/lib/docs";
import { CopyMarkdown } from "./copy-markdown";
import { DocumentationContent } from "./documentation-content";
import "highlight.js/styles/github-dark.css";
import "./documentation.css";

function Navigation({ current }: { current?: string }) {
  return (
    <nav aria-label="Documentation" className="space-y-1 text-sm">
      {docs.map((page) => (
        <details key={page.slug} open={current === page.slug} className="group">
          <summary className="cursor-pointer rounded-sm px-3 py-2 text-[#A8A29E] hover:bg-[#141210] hover:text-[#F5F5F4]">
            <Link href={`/docs/${page.slug}`} aria-current={current === page.slug ? "page" : undefined}
              className={current === page.slug ? "font-medium text-[#38BDF8]" : ""}>
              {page.title}
            </Link>
          </summary>
          <ul className="ml-5 border-l border-[#2A2622] py-1">
            {page.sections.map((section) => (
              <li key={section.id}>
                <Link href={`/docs/${page.slug}#${section.id}`}
                  className="block px-3 py-1.5 text-xs text-[#A8A29E] hover:text-[#38BDF8]">
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </nav>
  );
}

export function DocsShell({ current, children }: { current?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0908] text-[#F5F5F4]">
      <a href="#docs-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[#38BDF8] focus:p-3 focus:text-[#0A0908]">Skip to content</a>
      <header className="sticky top-0 z-30 border-b border-[#2A2622] bg-[#0A0908]/95 backdrop-blur-sm">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Cube homepage">
            <CubeLogoIcon className="h-6 w-6" />
            <span className="font-cinzel text-sm font-bold tracking-widest">CUBE</span>
            <span className="border-l border-[#2A2622] pl-3 font-mono text-xs text-[#A8A29E]">DOCS</span>
          </Link>
          <Link href="/#install" className="font-mono text-xs text-[#38BDF8] hover:underline">Install Cube →</Link>
        </div>
      </header>
      <div className="w-full px-4 sm:px-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <aside className="sticky top-[65px] hidden h-[calc(100dvh-65px)] overflow-y-auto border-r border-[#2A2622] py-8 pr-5 lg:block">
          <Link href="/docs" className="mb-4 block px-3 font-mono text-xs uppercase tracking-widest text-[#78716C]">Documentation</Link>
          <Navigation current={current} />
        </aside>
        <div className="min-w-0 py-8 sm:py-12">
          <details className="mb-8 rounded-sm border border-[#2A2622] p-3 lg:hidden">
            <summary className="cursor-pointer font-mono text-sm text-[#38BDF8]">Browse documentation</summary>
            <div className="mt-3"><Navigation current={current} /></div>
          </details>
          <main id="docs-content" className="w-full scroll-mt-24">{children}</main>
          <footer className="mt-16 border-t border-[#2A2622] pt-6 font-mono text-xs text-[#78716C]">
            Cube 0.1.13 · Configuration and behavior verified against the current source.
          </footer>
        </div>
      </div>
    </div>
  );
}


export function DocsArticle({ page }: { page: DocPage }) {
  const index = docs.indexOf(page);
  return (
    <article>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-[#38BDF8]">Cube Documentation</p>
        <div className="flex flex-wrap items-center gap-4">
          <CopyMarkdown key={page.slug} markdown={page.markdown} />
          <a href={"/docs/" + page.slug + ".md"} target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs text-[#A8A29E] hover:text-[#38BDF8] hover:underline">
            View raw Markdown ↗
          </a>
        </div>
      </div>
      <DocumentationContent key={page.slug} html={page.html} codeBlocks={page.codeBlocks} />
      {index >= 0 && (
        <nav aria-label="Previous and next guide" className="mt-12 flex justify-between gap-4 border-t border-[#2A2622] pt-6 text-sm text-[#38BDF8]">
          <Link href={index > 0 ? "/docs/" + docs[index - 1].slug : "/docs"} className="hover:underline">
            ← {index > 0 ? docs[index - 1].title : "Overview"}
          </Link>
          {docs[index + 1] && <Link href={"/docs/" + docs[index + 1].slug} className="text-right hover:underline">
            {docs[index + 1].title} →
          </Link>}
        </nav>
      )}
    </article>
  );
}
