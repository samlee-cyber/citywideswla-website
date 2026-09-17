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
} from "../lib/publication.mjs";
import { renderForm, renderReceipt } from "../lib/form.mjs";
import { renderPage, notFound } from "../lib/render.mjs";
export async function build({
  registry = pages,
  out = "dist",
  production = productionReady(),
} = {}) {
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
