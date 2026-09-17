import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "./build.mjs";
import { pages } from "../content/pages.mjs";

export async function buildVercel(options = {}) {
  // This project uses Vercel Authentication for every preview deployment.
  // Keep protection enabled: noindex is not access control.
  await build({
    ownerPreview: process.env.VERCEL_ENV === "preview",
    ...options,
  });
  const out = resolve(options.out || "dist");
  // Vercel serves existing files before rewrites. These routes must reach the
  // native form/receipt functions for query values, cookies and signed receipts.
  for (const page of pages.filter((p) =>
    ["action", "utility"].includes(p.type),
  )) {
    await rm(resolve(out, "." + page.slug), { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await buildVercel();
