import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Marked, Renderer } from "marked";

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  markdown: string;
  html: string;
  codeBlocks: string[];
  sections: { id: string; title: string }[];
};

// Only repository-owned Markdown is read here. Marked is a parser, not an
// HTML sanitizer; never use this loader for remote or request-supplied content.
function readDoc(slug: string): DocPage {
  const markdown = readFileSync(join(process.cwd(), "public", "docs", slug + ".md"), "utf8");
  const parser = new Marked({ gfm: true });
  const sections: DocPage["sections"] = [];
  const codeBlocks: string[] = [];
  const renderer = new Renderer();
  const headingIds = new WeakMap<object, string>();
  let anchor: string | undefined;
  const tokens = parser.lexer(markdown).filter((token) => {
    const marker = /^<a id="([a-z0-9-]+)"><\/a>$/.exec(token.raw.trim());
    if (marker) { anchor = marker[1]; return false; }
    if (token.type === "heading" && token.depth === 2) {
      const id = anchor ?? token.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (!id || sections.some((section) => section.id === id))
        throw new Error("Invalid or duplicate documentation heading: " + slug + "#" + id);
      sections.push({ id, title: token.text });
      headingIds.set(token, id);
      anchor = undefined;
    }
    return true;
  });
  const titleToken = tokens.find((token) => token.type === "heading" && token.depth === 1);
  const descriptionToken = tokens.find((token) => token.type === "paragraph");
  if (titleToken?.type !== "heading" || descriptionToken?.type !== "paragraph" ||
      !titleToken.text || !descriptionToken.text)
    throw new Error("Documentation needs a title and description: " + slug);
  const title = titleToken.text;
  const description = descriptionToken.text;
  parser.use({ renderer: {
    code(token) {
      const index = codeBlocks.push(token.text) - 1;
      return '<div class="docs-code-block"><div class="docs-code-toolbar">' +
        '<button type="button" data-copy-code="' + index + '" aria-label="Copy code" aria-live="polite">Copy</button>' +
        '</div>' + renderer.code(token) + '</div>\n';
    },
    heading(token) {
      const id = headingIds.get(token);
      return "<h" + token.depth + (id ? ' id="' + id + '"' : "") + ">" +
        this.parser.parseInline(token.tokens) + "</h" + token.depth + ">\n";
    },
  } });
  return { slug, title, description, markdown, html: parser.parser(tokens), codeBlocks, sections };
}

export const docs = [
  "getting-started", "gateways", "models", "commands", "tools-permissions",
  "instructions", "skills", "mcp", "background-tasks", "subagents", "context",
  "memory-sessions", "configuration", "troubleshooting",
].map(readDoc);

export const overview = readDoc("index");
