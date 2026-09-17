import { openapi } from "../lib/openapi.mjs";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { pages } from "../content/pages.mjs";
import { business } from "../content/business.mjs";
import {
  validateRegistry,
  sitemap,
  productionReady,
  isPublished,
} from "../lib/publication.mjs";
import { renderForm, renderReceipt } from "../lib/form.mjs";
import { renderPage, notFound, escape } from "../lib/render.mjs";
export async function build({
  registry = pages,
  out = "dist",
  production = productionReady(),
  ownerPreview = process.env.OWNER_PREVIEW === "1",
} = {}) {
  if (ownerPreview && (production || process.env.VERCEL_ENV === "production"))
    throw new Error(
      "Owner preview cannot be included in a production deployment",
    );
  validateRegistry(registry);
  // Only remove the build output chosen by this command, never the project root.
  const dest = resolve(out);
  if (dest === process.cwd() || dest === "/")
    throw new Error("Unsafe output directory");
  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });
  await cp("public", dest, { recursive: true });
  for (const page of registry) {
    const file = resolve(dest, "." + page.slug, "index.html");
    await mkdir(dirname(file), { recursive: true });
    await writeFile(
      file,
      page.type === "action"
        ? renderForm({ production })
        : page.type === "utility"
          ? renderReceipt(null, { production })
          : renderPage(page, { registry, production }),
    );
  }
  if (ownerPreview) {
    await mkdir(resolve(dest, "owner-preview"), { recursive: true });
    await writeFile(
      resolve(dest, "owner-preview/index.html"),
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>City Wide owner review</title><link rel="stylesheet" href="/styles.css"></head><body><main class="container section"><h1>Owner review</h1><p>Complete route architecture for editorial review. Drafts are not customer-ready. This index must remain on localhost or an authenticated preview deployment.</p><ul>${registry.map((p) => `<li><a href="${escape(p.slug)}">${escape(p.label || p.title)}</a> — ${isPublished(p, registry) ? "Published content" : "Draft / unavailable"} <small>${escape(p.slug)}</small></li>`).join("")}</ul></main></body></html>`,
    );
  }
  await writeFile(resolve(dest, "404.html"), notFound());
  await writeFile(
    resolve(dest, "openapi.json"),
    JSON.stringify(openapi(), null, 2) + "\n",
  );
  await writeFile(resolve(dest, "sitemap.xml"), sitemap(registry, production));
  await writeFile(
    resolve(dest, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\n\nSitemap: ${business.url}/sitemap.xml\n`,
  );
  console.log(
    `Built ${registry.length} routes (${production ? "production indexing" : "preview noindex"}).`,
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await build();
