import { readFile, access, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { pages } from "../content/pages.mjs";
import {
  isIndexable,
  productionReady,
  validateRegistry,
} from "../lib/publication.mjs";
import { business } from "../content/business.mjs";
validateRegistry(pages);
const titles = new Set(),
  descriptions = new Set(),
  linked = new Set(["/"]);
let linkCount = 0;
for (const p of pages) {
  const html = await readFile("dist" + p.slug + "index.html", "utf8");
  assert.equal((html.match(/<h1\b/g) || []).length, 1, p.slug + " H1");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, p.slug + " duplicate IDs");
  assert.ok(
    html.includes(`<link rel="canonical" href="${business.url}${p.slug}">`),
    p.slug + " canonical",
  );
  assert.equal(
    html.includes('content="index, follow"'),
    isIndexable(p, productionReady()),
    p.slug + " indexing",
  );
  for (const [, data] of html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs,
  )) {
    const graph = JSON.parse(data)["@graph"];
    assert.ok(graph.length);
    assert.ok(!JSON.stringify(graph).match(/AggregateRating|"Review"/));
  }
  if (isIndexable(p, true)) {
    assert.ok(!titles.has(p.title), "duplicate title");
    titles.add(p.title);
    assert.ok(!descriptions.has(p.description), "duplicate description");
    descriptions.add(p.description);
  }
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"?]*|#[^"]*)"/g)) {
    if (url.startsWith("#")) {
      assert.ok(ids.includes(url.slice(1)), `Missing anchor ${p.slug}${url}`);
      continue;
    }
    linkCount++;
    if (pages.some((x) => x.slug === url)) {
      linked.add(url);
      continue;
    }
    await access("dist" + url);
  }
  assert.ok(
    !/\$4M|\brevenue\b|branch.sales|sales.growth|annual.sales|sales.volume/i.test(
      html,
    ),
    "Prohibited financial copy on " + p.slug,
  );
  for (const [, tag] of html.matchAll(/(<img\b[^>]+>)/g))
    assert.ok(
      /width="\d+"/.test(tag) &&
        /height="\d+"/.test(tag) &&
        /alt="[^"]*"/.test(tag),
      "Image semantics",
    );
}
for (const p of pages.filter((p) => isIndexable(p, true)))
  assert.ok(linked.has(p.slug), "orphan " + p.slug);
const map = await readFile("dist/sitemap.xml", "utf8");
for (const p of pages)
  assert.equal(
    map.includes(business.url + p.slug + "</loc>"),
    isIndexable(p, productionReady()),
    p.slug + " sitemap",
  );
async function syntax(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = dir + "/" + entry.name;
    if (entry.isDirectory()) await syntax(path);
    else if (/\.(mjs|js)$/.test(path)) {
      const r = spawnSync(process.execPath, ["--check", path], {
        encoding: "utf8",
      });
      assert.equal(r.status, 0, r.stderr);
    }
  }
}
for (const dir of ["lib", "content", "api", "scripts", "public"])
  await syntax(dir);
console.log(
  `Verified ${pages.length} routes, ${linkCount} internal references, unique metadata, schema parsing, image semantics, indexing, sitemap, content gates, and JS syntax.`,
);
