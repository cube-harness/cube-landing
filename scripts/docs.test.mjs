import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Marked } from "marked";
import { docs, overview } from "../src/lib/docs.ts";

test("Markdown is the complete docs source and preserves navigation/config coverage", () => {
  assert.equal(docs.length, 14);
  for (const page of [overview, ...docs]) {
    assert.equal(page.markdown, readFileSync(`public/docs/${page.slug}.md`, "utf8"));
    assert.ok(page.html.includes("<h1>"));
    assert.doesNotMatch(page.html, /<(?:title|script|style|textarea)\b/i,
      "Markdown placeholders must not become HTML that hides the remaining guide");
    const code = new Marked().lexer(page.markdown).filter((token) => token.type === "code");
    assert.deepEqual(page.codeBlocks, code.map((token) => token.text));
    assert.equal([...page.html.matchAll(/data-copy-code="\d+"/g)].length, code.length);
    for (let index = 0; index < code.length; index++)
      assert.ok(page.html.includes(`data-copy-code="${index}"`));
    assert.equal(new Set(page.sections.map((section) => section.id)).size, page.sections.length);
    for (const section of page.sections) assert.ok(page.html.includes(`id="${section.id}"`));
    for (const [, slug] of page.markdown.matchAll(/\/docs\/([a-z-]+)(?:\.md)?(?:[#)])/g))
      assert.ok(docs.some((guide) => guide.slug === slug), `Broken guide link: ${slug}`);
  }
  const configuration = docs.find((page) => page.slug === "configuration");
  const table = new Marked().lexer(configuration.markdown).find((token) =>
    token.type === "table" && token.header[0].text === "Field");
  assert.ok(table);
  assert.equal(table.rows.length, 35, "Update coverage when Cube's config schema changes");
  assert.equal(new Set(table.rows.map((row) => row[0].text)).size, 35);
  for (const page of docs) assert.ok(overview.markdown.includes(`/docs/${page.slug}.md`));
});
