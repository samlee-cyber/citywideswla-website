import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pages } from "../content/pages.mjs";
import { business } from "../content/business.mjs";
const base = "http://127.0.0.1:4174";
let checks = 0;
for (const p of pages) {
  const r = await fetch(base + p.slug);
  assert.equal(r.status, 200, p.slug);
  const html = await r.text();
  assert.ok(
    html.includes(`href="${business.url}${p.slug}"`),
    p.slug + " canonical",
  );
  assert.ok(html.includes("noindex, nofollow"), p.slug + " preview indexing");
  checks++;
}
const config = JSON.parse(await readFile("vercel.json", "utf8"));
for (const rule of config.redirects) {
  const r = await fetch(base + rule.source, { redirect: "manual" });
  assert.equal(r.status, 301, rule.source);
  assert.equal(r.headers.get("location"), rule.destination);
  assert.equal((await fetch(base + rule.destination)).status, 200);
  checks++;
}
for (const path of ["/not-a-real-page/", "/case-studies/not-a-project/"])
  assert.equal((await fetch(base + path)).status, 404);
for (const agent of [
  "Googlebot",
  "bingbot",
  "OAI-SearchBot",
  "Claude-SearchBot",
  "Claude-User",
])
  assert.equal(
    (
      await fetch(base + "/services/hard-floor-care/", {
        headers: { "User-Agent": agent },
      })
    ).status,
    200,
  );
const robots = await (await fetch(base + "/robots.txt")).text();
assert.ok(!robots.includes("Disallow: /\n"));
assert.ok(robots.includes(business.url + "/sitemap.xml"));
const spec = await (await fetch(base + "/openapi.json")).json();
assert.equal(Object.keys(spec.paths).length, 1);
const invalid = await fetch(base + "/api/v1/walkthrough-request", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ work_email: "invalid" }),
});
assert.equal(invalid.status, 422);
assert.ok((await invalid.json()).field_errors.contact_name);
const nojs = await fetch(base + "/request-walkthrough/?nojs=1");
assert.equal(nojs.headers.get("content-security-policy"), "script-src 'none'");
const receipt = await (await fetch(base + "/request-received/")).text();
assert.ok(!receipt.includes("data-receipt="));
console.log(
  `HTTP QA passed: ${pages.length} pages, ${config.redirects.length} direct 301s, true 404s, five crawler user agents, robots, OpenAPI, API validation, no-JS mode, and neutral receipt.`,
);
