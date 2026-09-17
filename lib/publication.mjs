import { business } from "../content/business.mjs";
export function isPublished(page, registry = []) {
  return (
    page?.status === "published" &&
    page.approval?.facts === true &&
    page.approval?.content === true &&
    page.approval?.evidence?.length > 0 &&
    (page.type !== "hub" ||
      !page.collectionType ||
      page.content?.length > 0 ||
      registry.some(
        (child) =>
          child.type === page.collectionType &&
          child.slug.startsWith(page.slug) &&
          isPublished(child, registry),
      ))
  );
}
export const productionReady = (env = process.env) =>
  env.VERCEL_ENV === "production" && env.SITE_LAUNCH === "production";
export const isIndexable = (page, production = true, registry = []) =>
  production && isPublished(page, registry) && page.type !== "utility";
export function sitemap(registry, production = true) {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    registry
      .filter((p) => isIndexable(p, production, registry))
      .map(
        (p) =>
          `<url><loc>${business.url}${p.slug}</loc>${p.updatedAt ? `<lastmod>${p.updatedAt}</lastmod>` : ""}</url>`,
      )
      .join("\n") +
    "\n</urlset>\n"
  );
}
export function validateRegistry(registry) {
  const paths = new Set();
  for (const p of registry) {
    if (!/^\/(?:[a-z0-9-]+\/)*$/.test(p.slug) || paths.has(p.slug))
      throw new Error(`Invalid or repeated route: ${p.slug}`);
    paths.add(p.slug);
    if (
      !p.title ||
      !p.description ||
      !p.h1 ||
      !Array.isArray(p.content) ||
      !Array.isArray(p.relationships)
    )
      throw new Error(`Incomplete record: ${p.slug}`);
    if (
      isPublished(p, registry) &&
      ["service", "industry", "location", "case-study", "resource"].includes(
        p.type,
      ) &&
      !p.content.length
    )
      throw new Error(`Published detail needs substantive content: ${p.slug}`);
    if (
      isPublished(p, registry) &&
      ["case-study", "resource"].includes(p.type) &&
      (!p.author || !p.publishedAt || !p.updatedAt)
    )
      throw new Error(`Article needs genuine author and dates: ${p.slug}`);
    if (
      isPublished(p, registry) &&
      p.type === "case-study" &&
      (!p.caseStudy?.disclosureApproved || !p.caseStudy.results.length)
    )
      throw new Error(`Case study needs approved verified results: ${p.slug}`);
    for (const date of [p.publishedAt, p.updatedAt].filter(Boolean))
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(date))
      )
        throw new Error(`Invalid editorial date: ${p.slug}`);
  }
  for (const p of registry)
    for (const path of p.relationships)
      if (!paths.has(path)) throw new Error(`Unknown relationship: ${path}`);
}

// Every customer-facing link resolves through the same publication policy.
export function publicDestination(page, registry) {
  if (isPublished(page, registry)) return page.slug;
  if (page.type === "service")
    return `${business.contactRoute}?service=${page.slug.split("/")[2]}`;
  if (page.type === "location")
    return `${business.contactRoute}?city=${encodeURIComponent(page.city)}`;
  if (page.type === "industry")
    return `${business.contactRoute}?industry=${page.slug.split("/")[2]}`;
  return null;
}
