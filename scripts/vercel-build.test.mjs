import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, access, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildVercel } from "./build-vercel.mjs";

test("Vercel output cannot shadow the form and receipt functions; published pages remain indexable", async () => {
  const out = await mkdtemp(join(tmpdir(), "cw-vercel-"));
  try {
    await buildVercel({ out, production: true });
    const config = JSON.parse(await readFile("vercel.json", "utf8"));
    for (const [source, destination] of [
      ["/request-walkthrough/", "/api/walkthrough"],
      ["/request-received/", "/api/receipt"],
    ]) {
      await assert.rejects(access(join(out, source)), { code: "ENOENT" });
      assert.ok(
        config.rewrites.some(
          (r) => r.source === source && r.destination === destination,
        ),
      );
    }
    const home = await readFile(join(out, "index.html"), "utf8");
    assert.match(home, /content="index, follow"/);
    const construction = await readFile(
      join(out, "services/hard-floor-care/index.html"),
      "utf8",
    );
    assert.match(construction, /content="noindex, nofollow"/);
    const map = await readFile(join(out, "sitemap.xml"), "utf8");
    assert.ok(map.includes("/request-walkthrough/</loc>"));
    assert.ok(!map.includes("/request-received/</loc>"));
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});
