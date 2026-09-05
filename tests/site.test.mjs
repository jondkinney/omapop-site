import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");

test("all local page assets exist", async () => {
  const references = [...html.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g)].map(match => match[1]);
  assert.ok(references.length >= 4);
  for (const path of new Set(references)) await access(new URL(path, root));
});
test("navigation anchors resolve to unique IDs", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
});
test("the page exposes one main heading and accessible image descriptions", () => {
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.equal([...html.matchAll(/<main\b/g)].length, 1);
  for (const match of html.matchAll(/<img\b[^>]*>/g)) assert.match(match[0], /\balt="[^"]*"/);
  assert.match(html, /class="skip-link" href="#main"/);
});
test("canonical, social metadata, sitemap, and custom domain agree", async () => {
  assert.match(html, /rel="canonical" href="https:\/\/omapop\.rocks\/"/);
  assert.match(html, /property="og:url" content="https:\/\/omapop\.rocks\/"/);
  assert.equal((await readFile(new URL("CNAME", root), "utf8")).trim(), "omapop.rocks");
  assert.match(await readFile(new URL("sitemap.xml", root), "utf8"), /<loc>https:\/\/omapop\.rocks\/<\/loc>/);
  assert.match(await readFile(new URL("robots.txt", root), "utf8"), /Sitemap: https:\/\/omapop\.rocks\/sitemap\.xml/);
});
test("install commands point at the real plugin and explicitly enable it", () => {
  assert.match(html, /omarchy plugin add https:\/\/github\.com\/jondkinney\/omapop\.git\nomarchy plugin enable io\.github\.jondkinney\.omapop/);
});
test("scripts, styles, and fonts introduce no third-party runtime requests", async () => {
  assert.doesNotMatch(html, /<(?:script|link)[^>]*(?:src|href)="https?:\/\//);
  const script = await readFile(new URL("assets/site.js", root), "utf8");
  assert.doesNotMatch(script, /\b(?:fetch|XMLHttpRequest|WebSocket|eval)\s*\(/);
  assert.doesNotMatch(await readFile(new URL("assets/site.css", root), "utf8"), /@import|url\(\s*["']?https?:/);
});
test("demo and compatibility limits are explicit", () => {
  assert.match(html, /hands-on web demo/);
  assert.match(html, /not affiliated with PopClip/);
  assert.match(html, /only install ones you trust/);
  assert.match(html, /maxlength="2000"/);
});
