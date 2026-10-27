import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(resolve(root, "package.json"));
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
let originalBytes = 0;
let optimizedBytes = 0;

for (let index = 1; index <= 8; index++) {
  const original = resolve(root, `public/assets/ascii-magic-${index}.png`);
  const optimized = resolve(root, `public/assets/ascii-magic-${index}.webp`);
  const before = await readFile(original);
  await sharp(original).webp({ lossless: true, effort: 6 }).toFile(optimized);
  const sourcePixels = await sharp(original).ensureAlpha().raw().toBuffer();
  const outputPixels = await sharp(optimized).ensureAlpha().raw().toBuffer();
  assert(sourcePixels.equals(outputPixels), `Etching ${index}: decoded pixels changed`);
  assert.equal(digest(await readFile(original)), digest(before), "Original PNG changed");
  originalBytes += before.length;
  optimizedBytes += (await stat(optimized)).size;
  console.log(`Plate ${index}: lossless WebP verified, original PNG preserved`);
}
console.log(JSON.stringify({ originalBytes, optimizedBytes, savedPercent: Math.round((1 - optimizedBytes / originalBytes) * 100) }));
