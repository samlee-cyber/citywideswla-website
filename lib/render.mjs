import {
  janitorialPath,
  janitorialRequest,
  programExplanation,
  programNote,
  programBenefits,
  janitorialFaqs,
  serviceGroups,
} from "../content/messaging.mjs";
import { business as b } from "../content/business.mjs";
import { pages, navigation } from "../content/pages.mjs";
import { approvedCustomers } from "../content/customers.mjs";
import { isPublished, isIndexable, productionReady } from "./publication.mjs";
export const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const e = escape;
export const arrow = '<span aria-hidden="true">↗</span>';
const icons = {
  clean: "M5 20h14M7 18V8h10v10M9 8V4h6v4M3 11h3m12 0h3",
  bottle: "M9 4h6m-3 0v4m-4 3 2-3h4l2 3v9H8zM10 14h4",
  tree: "M12 21v-7M7 16a4 4 0 0 1-2-7 5 5 0 0 1 10-4 4 4 0 0 1 4 7 4 4 0 0 1-5 4M8 21h8",
  floor: "M3 9h18v12H3zM3 15h18M9 9v6m6 0v6M6 5l2-2 2 2m6-3v4m-2-2h4",
  carpet: "M5 4h14v16H5zM8 7h8M8 11h8m-8 4h8M3 7h2m-2 4h2m14-4h2m-2 4h2",
  window: "M4 3h16v18H4zM12 3v18M4 12h16M7 6l2 2m6 7 2 2",
  spray: "M3 20l8-8m-2-2 4 4 3-3-4-4zM15 5l2-2m0 5 4-1m-3 4 3 1",
  hammer: "M3 20l9-9m-3-3 4 4 3-3 3 1 2-2-7-6-3 1 1 3z",
  wrench:
    "M20 3l-4 4-3-3 4-3a6 6 0 0 0-7 8L3 16a3 3 0 0 0 4 4l7-7a6 6 0 0 0 6-10z",
  bolt: "M13 2 5 14h6l-1 8 9-13h-6z",
  air: "M3 7h12a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 17h7a3 3 0 1 1-3 3",
  parking: "M6 22V2h10a4 4 0 0 1 0 8H6m4-5v3m-2 9h12l-2-4h-8zM8 17v3m12-3v3",
  roller: "M4 3h14v6H4zM18 6h3v7h-9v3m-2 0h4v6h-4z",
};
const icon = (k) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${icons[k] || icons.window}"/></svg>`;
export const button = (
  label = "Request a Walkthrough",
  path = b.contactRoute,
  klass = "",
  event = "",
) =>
  `<a class="button ${klass}" href="${e(path)}"${event ? ` data-event="${e(event)}"` : ""}>${e(label)} ${arrow}</a>`;
const brand = () =>
  `<a class="brand" href="/" aria-label="City Wide Southwest Los Angeles home"><img src="/assets/city-wide-logo.png" width="434" height="60" alt="City Wide Facility Solutions"><span>Southwest Los Angeles</span></a>`;
const navLink = (p, current) =>
  `<a href="${e(p.slug)}"${p.slug === current ? ' aria-current="page"' : ""}${p.type === "action" ? ' class="button button-small"' : ""}>${e(p.label)}${!isPublished(p) ? ' <span class="badge">In construction</span>' : ""}${p.type === "action" ? arrow : ""}</a>`;
function header(page, registry) {
  return `<a class="skip-link" href="#main">Skip to content</a><div class="utility"><div class="container utility-inner"><span><i class="location-dot" aria-hidden="true"></i>Locally owned. Southwest Los Angeles.</span><a href="tel:${b.telephone}">${b.phone} ${arrow}</a></div></div><header class="header"><div class="container nav-inner">${brand()}<details class="navigation" open><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Main navigation"><a href="/#how-we-work">How We Work</a>${navigation(
    registry,
  )
    .map((p) => navLink(p, page.slug))
    .join("")}</nav></details></div></header>`;
}
function footer(registry) {
  return `<footer class="footer"><div class="container"><div class="footer-grid"><div>${brand()}<p>Commercial building maintenance.<br>One accountable management partner.</p></div><div><h2>Your local office</h2><address>${e(b.address.streetAddress)}<br>${e(b.address.addressLocality)}, ${b.address.addressRegion} ${b.address.postalCode}</address><a href="tel:${b.telephone}">${b.phone}</a></div><div><h2>Explore</h2><a href="/#how-we-work">How We Work</a>${navigation(
    registry,
  )
    .filter((p) => p.type !== "action")
    .map((p) => `<a href="${p.slug}">${e(p.label)}</a>`)
    .join(
      "",
    )}</div><div><h2>Let’s talk</h2><a href="${b.contactRoute}">Request a Walkthrough</a><a href="https://gocitywide.com/southwestlosangeles/why-work-at-city-wide/">Careers</a><a href="https://gocitywide.com/contractors/">Contractor opportunities</a></div></div><div class="footer-bottom"><span>© 2026 ${e(b.name)}</span><div><a href="/privacy/">Privacy</a><a href="${b.parent.url}">City Wide national ${arrow}</a></div></div></div></footer><div class="mobile-cta"><a href="tel:${b.telephone}">Call our local team</a><a href="${b.contactRoute}">Request a Walkthrough ${arrow}</a></div>`;
}
export function metrics() {
  return `<section class="proof" aria-label="Local operational scale"><div class="container metrics">${b.metrics.map((m) => `<div><strong>${m.value}</strong><span>${m.label}</span></div>`).join("")}</div><p>Supporting facilities across the Los Angeles region.</p></section>`;
}
const intro = (eyebrow, title, copy = "") =>
  `<div class="section-heading"><div><p class="eyebrow">${e(eyebrow)}</p><h2>${e(title)}</h2></div>${copy ? `<p>${e(copy)}</p>` : ""}</div>`;
const children = (prefix, registry) =>
  registry.filter((p) => p.slug.startsWith(prefix) && p.slug !== prefix);
export function cards(records, klass = "") {
  return `<div class="cards ${klass}">${records.map((p) => `<a class="card" href="${p.slug}"><div class="card-top">${icon(p.icon)}${arrow}</div><h3>${e(p.label)}</h3><p>${e(p.slug === janitorialPath ? "Commercial cleaning supported by a fractional facility manager, a management team and an ongoing service program." : p.description)}</p><span class="card-label">${isPublished(p) ? "Explore " + e(p.type === "service" ? "service" : p.type === "resource" ? "guide" : "details") : "In construction"} ${arrow}</span></a>`).join("")}</div>`;
}
function customerProof() {
  const records = approvedCustomers();
  return records.length
    ? `<section class="section container">${intro("Our relationships", "Selected Organizations We’ve Supported")}<div class="customer-grid">${records.map((c) => `<div>${c.logo ? `<img src="${e(c.logo)}" alt="${e(c.name)}" width="160" height="90" loading="lazy">` : `<strong>${e(c.name)}</strong>`}<p>${e(c.relationshipLabel)}</p></div>`).join("")}</div></section>`
    : "";
}
export function process() {
  return `<ol class="steps"><li><span>01</span><div><h3>Understand your building</h3><p>We review your priorities, current service issues, operating requirements and budget.</p></div></li><li><span>02</span><div><h3>Build the program</h3><p>We define the scope, coordinate service providers and establish expectations.</p></div></li><li><span>03</span><div><h3>Manage the follow-through</h3><p>Your Facility Solutions Manager coordinates communication, oversees quality and works through service issues.</p></div></li><li><span>04</span><div><h3>Address what comes next</h3><p>As needs change, we help coordinate additional services and projects under an agreed scope.</p></div></li></ol>`;
}
export function cta(event = "service_cta_click", janitorial = false) {
  return `<section class="final-cta" id="contact"><div class="container"><div><p class="eyebrow">Let’s take a look at your facility</p><h2>Put Your Facility Needs on Our Team’s List.</h2><p>Tell us what’s taking up your time, what needs attention and what you need from your next service partner. We’ll review your facility and develop a clear scope and competitive proposal.</p></div>${button(janitorial ? "Request a Janitorial Walkthrough" : "Request a Walkthrough", janitorial ? janitorialRequest : b.contactRoute, "", event)}</div></section>`;
}
const atGlance = () =>
  `<aside class="glance"><p class="eyebrow">At a glance</p><dl><dt>Business</dt><dd>${e(b.name)}</dd><dt>Local office</dt><dd>${e(b.address.streetAddress)}, Long Beach, CA ${b.address.postalCode}</dd><dt>Service model</dt><dd>Commercial building maintenance management through one local team.</dd><dt>Managed janitorial program</dt><dd>${e(programExplanation)} ${e(programNote)}</dd><dt>Initial service areas</dt><dd>${b.areas.join(", ")}</dd><dt>Getting started</dt><dd>Discussion → walkthrough → scope and proposal, as appropriate.</dd></dl><a href="tel:${b.telephone}">${b.phone} ${arrow}</a></aside>`;
function managedServices(registry) {
  const janitorial = registry.find((p) => p.slug === janitorialPath);
  return `${cards([janitorial], "managed-highlight")}${serviceGroups
    .map(
      ([title, slugs]) =>
        `<section class="service-group"><h3 class="service-group-title">${e(title)}</h3>${cards(
          slugs.map((slug) =>
            registry.find((p) => p.slug === `/services/${slug}/`),
          ),
          "grouped-services",
        )}</section>`,
    )
    .join("")}`;
}
function ownerFeature() {
  return `<section class="section container owner"><img src="${b.leadership.photo}" width="447" height="447" alt="Sam Lee, owner and president of City Wide Southwest Los Angeles" loading="lazy"><div><p class="eyebrow">Local ownership. Personal accountability.</p><h2>Your local team, led by Sam Lee.</h2><p>${e(b.leadership.biography)}</p><blockquote>“${e(b.leadership.quote)}”<cite>— Sam Lee</cite></blockquote><a class="text-link section-link" href="/about/">Meet your local team ${arrow}</a></div></section>`;
}
const localAreas = (registry) =>
  `<div class="area-links">${children("/locations/", registry)
    .map(
      (p) =>
        `<a href="${p.slug}"><span>${e(p.label)}<small>${isPublished(p) ? "Explore local services" : "In construction"}</small></span>${arrow}</a>`,
    )
    .join("")}</div>`;
function caseCards(registry) {
  const studies = children("/case-studies/", registry).filter(isPublished);
  return studies.length
    ? `<div class="cards">${studies.map((p) => `<a class="card" href="${p.slug}" data-case-category="${e(p.caseStudy.category)}"><p class="eyebrow">${e(p.caseStudy.facilityType)} · ${e(p.caseStudy.region)}</p><h3>${e(p.label)}</h3><p>${e(p.caseStudy.challenge)}</p><p>${e(p.caseStudy.results.join(" "))}</p><small>${e(p.caseStudy.services.join(" · "))}</small><span class="card-label">View project ${arrow}</span></a>`).join("")}</div>`
    : `<div class="empty-state"><span class="empty-mark" aria-hidden="true">↗</span><div><h3>Local projects. Documented with care.</h3><p>Our case study library is being prepared. Published projects will include verified scope and results, with permission to share.</p><a class="text-link" href="${b.contactRoute}" data-event="case_study_cta_click">Discuss your facility ${arrow}</a></div></div>`;
}
function home(registry) {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">Commercial Facility Management • Southwest Los Angeles</p><h1>Commercial Building Maintenance.<br><em>Managed for You.</em></h1><p class="hero-description">Spend less time coordinating vendors and following up on facility issues. City Wide brings your building maintenance services together through one accountable local team, with a plan built around your needs and budget.</p><div class="hero-actions">${button()}<a class="text-link" href="#how-we-work">See How We Manage Your Facility ${arrow}</a></div><p class="hero-support">Looking for janitorial services? <a href="${janitorialPath}">Explore our managed janitorial program.</a></p></div><div class="hero-visual"><img class="hero-photo" src="/assets/workplace.webp" width="1600" height="1068" fetchpriority="high" alt="Commercial facility with shared workspaces and meeting areas"><div class="photo-caption"><span>Building needs.<br>Managed together.</span>${arrow}</div></div></section>
<section class="section container program" id="how-we-work"><div class="program-intro"><div><p class="eyebrow">A local building maintenance management company</p><h2>Your Facility Manager.<br>Your Management Team.<br>Your Plan.</h2></div><div><p>${e(programExplanation)} We coordinate service providers, oversee quality and follow through on issues, giving you more time to focus on your business.</p><p>Your Facility Solutions Manager serves as an extension of your team, managing the agreed services and helping you plan for additional facility needs as they arise.</p></div></div><div class="program-benefits">${programBenefits.map(([title, copy], i) => `<div><span class="section-number">0${i + 1}</span><h3>${e(title)}</h3><p>${e(copy)}</p></div>`).join("")}</div><p class="program-note">${e(programNote)}</p></section>${metrics()}
<section class="section paper" id="services"><div class="container">${intro("The services we manage", "One Management Partner. Services Across Your Facility.", "From recurring janitorial and floor care to plumbing, HVAC and improvement projects, City Wide coordinates the services your commercial building needs.")}<p class="services-intro">Bring us the issue or project, and we’ll help define the scope and coordinate the work through one local point of contact.</p>${managedServices(registry)}<div class="section-link">${button("Explore Managed Facility Services", "/services/")}</div></div></section>
<section class="section container feature" id="managed-janitorial"><div><p class="eyebrow">Managed janitorial services</p><h2>A Janitorial Contract That Takes More Off Your Plate.</h2><p>If you’re comparing commercial cleaning proposals, consider who will manage the service after the contract is signed. With City Wide, your managed janitorial program includes a fractional facility manager and management team to coordinate providers, oversee quality and address issues.</p><p>We build a competitive proposal around your facility, cleaning requirements and service schedule, with management built into the program. You get dependable support for the day-to-day details and one point of contact when other facility needs come up.</p><div class="hero-actions">${button("Explore Managed Janitorial Services", janitorialPath)}<a class="text-link" href="${janitorialRequest}" data-event="service_cta_click">Request a Janitorial Proposal ${arrow}</a></div></div><figure><img src="/assets/commercial-cleaning.webp" width="900" height="600" alt="Commercial cleaning staff caring for tables and shared surfaces" loading="lazy"><figcaption>Janitorial service. Backed by a management team.</figcaption></figure></section>
<section class="difference" id="program-process"><div class="container difference-grid"><div><p class="eyebrow">How the program works</p><h2>A Clear Plan.<br>Ongoing Management.</h2><p>With a managed janitorial contract, your local team coordinates the agreed services and helps you plan for what’s next.</p><p>${e(programNote)}</p></div>${process()}</div></section>
<section class="section container" id="industries">${intro("Industries we serve", "Facility Management Built Around Your Operation.", "Your building’s use, operating hours and access requirements shape the program. We coordinate services around the needs of offices, logistics facilities, schools, healthcare and professional spaces, automotive businesses, industrial facilities and commercial properties.")}${cards(children("/industries/", registry), "industry-grid")}</section>
<section class="section paper" id="difference"><div class="container">${intro("Why City Wide", "Local Accountability for Your Building Maintenance.", "Your local City Wide team brings provider coordination, quality oversight and problem-solving into one relationship, backed by the resources of the City Wide network.")}<h2 class="case-heading">Facility Problems. Managed Solutions.</h2>${caseCards(registry)}<a class="section-link" href="/case-studies/">Visit our project library ${arrow}</a></div></section>${customerProof()}
${ownerFeature()}<section class="section paper" id="service-area"><div class="container location-split"><div><p class="eyebrow">Right here in Southwest LA</p><h2>National resources.<br>Local relationships.</h2><p>Based in Long Beach, our local team manages commercial facility services across Southwest Los Angeles.</p><a class="text-link" href="/locations/">Explore our service area ${arrow}</a></div>${localAreas(registry)}</div></section>
<section class="section container">${intro("Resources", "Practical Guidance for Managing Your Facility.", "We’re building practical guides for facility teams. Preview the topics in development.")}${cards(children("/resources/", registry).slice(0, 3), "resource-grid")}<a class="section-link" href="/resources/">See all planned resources ${arrow}</a></section>${cta()}`;
}
function breadcrumbs(page, registry) {
  if (page.slug === "/") return "";
  const parts = page.slug.split("/").filter(Boolean);
  const parent =
    parts.length > 1 ? registry.find((p) => p.slug === `/${parts[0]}/`) : null;
  return `<nav class="breadcrumbs container" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span>${parent ? `<a href="${parent.slug}">${e(parent.label)}</a><span aria-hidden="true">/</span>` : ""}<span aria-current="page">${e(page.label)}</span></nav>`;
}
function pageHero(page) {
  return `<section class="page-hero container"><p class="eyebrow">${e(page.type === "hub" ? "Explore City Wide Southwest LA" : page.type === "about" ? "Your local team" : page.type === "service" ? "Services we manage" : page.type === "location" ? "Our service area" : page.type === "industry" ? "Industries we serve" : "City Wide Southwest Los Angeles")}</p><h1>${e(page.h1)}</h1>${isPublished(page) || page.type === "location" ? `<p>${e(page.summary || page.description)}</p>` : ""}${page.slug === janitorialPath ? `<div class="hero-actions">${button("Request a Janitorial Walkthrough", janitorialRequest, "", "service_cta_click")}</div>` : ""}</section>`;
}
function construction(page) {
  return `<section class="container construction-note"><span class="badge">Page in Construction</span><h2>We’re putting the details together.</h2><p>This page is in development. Our local team can discuss your facility and the services you need.</p>${button()}</section><div class="container construction-grid">${page.plannedSections.map((s, i) => `<section><span class="section-number">${String(i + 1).padStart(2, "0")}</span><h2>${e(s)}</h2><p>Content in development</p></section>`).join("")}</div>${cta()}`;
}
function related(page, registry) {
  const records = page.relationships
    .map((s) => registry.find((p) => p.slug === s))
    .filter((p) => p && isPublished(p));
  return records.length
    ? `<section class="related"><h2>Explore related pages</h2><ul>${records.map((p) => `<li><a href="${p.slug}">${e(p.label)} ${arrow}</a></li>`).join("")}</ul></section>`
    : "";
}
function detail(page, registry) {
  return `<div class="container detail-layout"><article>${page.type === "resource" || page.type === "case-study" ? `<p class="byline">By ${e(page.author)} · Published ${e(page.publishedAt)} · Updated ${e(page.updatedAt)}</p>` : ""}${page.content.map((s) => `<section class="content-section"><h2>${e(s.heading)}</h2>${(s.paragraphs || []).map((p) => `<p>${e(p)}</p>`).join("")}${s.items?.length ? `<ul>${s.items.map((i) => `<li>${e(i)}</li>`).join("")}</ul>` : ""}</section>`).join("")}${page.slug === janitorialPath ? `<p class="section-link"><a class="text-link" href="/services/">Explore Managed Facility Services ${arrow}</a></p><section class="content-section"><h2>Frequently asked questions</h2>${janitorialFaqs.map(([question, answer]) => `<details class="faq"><summary>${e(question)} <span aria-hidden="true">+</span></summary><p>${e(answer)}</p></details>`).join("")}</section>` : ""}${page.sources?.length ? `<section class="content-section"><h2>Supporting sources</h2><ul>${page.sources.map((url) => `<li><a href="${e(url)}">${e(url)}</a></li>`).join("")}</ul></section>` : ""}${related(page, registry)}</article>${atGlance()}</div>${cta(page.type === "case-study" ? "case_study_cta_click" : "service_cta_click", page.slug === janitorialPath)}`;
}
function hub(page, registry) {
  let body = "";
  if (page.slug === "/services/") body = managedServices(registry);
  else if (page.slug === "/industries/")
    body = cards(children(page.slug, registry), "industry-grid");
  else if (page.slug === "/locations/")
    body = `<div class="hub-intro"><p>Our local office is at ${e(b.address.streetAddress)}, Long Beach, CA ${b.address.postalCode}. The cities below are service areas, not separate offices. Tell us where your property is located so we can discuss your needs.</p></div>${localAreas(registry)}`;
  else if (page.slug === "/resources/")
    body = cards(children(page.slug, registry), "resource-grid");
  else if (page.slug === "/case-studies/")
    body = `<div class="case-filters" aria-label="Filter case studies">${["All", "Commercial Cleaning", "Logistics / Distribution", "Floor Care", "Multi-Service", "Special Projects"].map((f, i) => `<button type="button" data-case-filter="${e(f)}" aria-pressed="${i === 0}">${e(f)}</button>`).join("")}</div><p class="sr-only" id="filter-status" role="status"></p>${caseCards(registry)}`;
  return `<section class="container hub-content">${body}</section>${cta(page.slug === "/case-studies/" ? "case_study_cta_click" : "service_cta_click")}`;
}
function about(registry) {
  return `${metrics()}<section class="section container owner"><img src="${b.leadership.photo}" width="447" height="447" alt="Sam Lee, owner and president of City Wide Southwest Los Angeles" loading="lazy"><div><p class="eyebrow">${e(b.leadership.role)}</p><h2>${e(b.leadership.name)}</h2><p>${e(b.leadership.biography)}</p><blockquote>“${e(b.leadership.quote)}”<cite>— Sam Lee</cite></blockquote></div></section><section class="difference"><div class="container difference-grid"><div><p class="eyebrow">The City Wide model</p><h2>Local attention.<br>National resources.</h2><p>Our Southwest Los Angeles operation is part of the City Wide Facility Solutions network. We manage service providers and quality follow-up through one local point of contact.</p></div>${process()}</div></section><section class="section container location-split"><div><h2>Services for your facility.</h2><p>Bring us your building’s service needs, from a managed janitorial program to an individual repair or improvement project. We’ll help define the scope and coordinate the next steps.</p><div class="link-stack"><a href="/services/">Managed services ${arrow}</a><a href="/industries/">Industries we serve ${arrow}</a><a href="/locations/">Our service areas ${arrow}</a></div></div>${atGlance()}</section>${customerProof()}${cta()}`;
}
export function schema(page, registry) {
  if (!isPublished(page) || page.type === "utility") return null;
  const id = `${b.url}/#business`,
    url = b.url + page.slug;
  const graph = [
    {
      "@type": "LocalBusiness",
      "@id": id,
      name: b.name,
      description: b.description,
      url: b.url + "/",
      telephone: b.telephone,
      address: { "@type": "PostalAddress", ...b.address },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: b.telephone,
        contactType: "customer service",
        url: b.url + b.contactRoute,
      },
      areaServed: b.areas.map((name) => ({ "@type": "City", name })),
      sameAs: b.profiles,
      parentOrganization: {
        "@type": "Organization",
        "@id": b.parent.url + "#organization",
        name: b.parent.name,
        url: b.parent.url,
      },
    },
    {
      "@type": "WebSite",
      "@id": b.url + "/#website",
      url: b.url + "/",
      name: b.shortName,
      publisher: { "@id": id },
    },
  ];
  const item = {
    "@type": page.type === "hub" ? "CollectionPage" : "WebPage",
    "@id": url + "#page",
    url,
    name: page.h1,
    description: page.summary || page.description,
    isPartOf: { "@id": b.url + "/#website" },
    about: { "@id": id },
  };
  if (["service", "location"].includes(page.type))
    graph.push({
      "@type": "Service",
      "@id": url + "#service",
      name: page.h1,
      serviceType:
        page.type === "service"
          ? page.label
          : "Commercial building maintenance management",
      description: page.summary || page.description,
      url,
      provider: { "@id": id },
      areaServed: (page.city ? [page.city] : b.areas).map((name) => ({
        "@type": "City",
        name,
      })),
    });
  if (["resource", "case-study"].includes(page.type))
    graph.push({
      "@type": "Article",
      "@id": url + "#article",
      headline: page.h1,
      author: { "@type": "Person", name: page.author },
      publisher: { "@id": id },
      datePublished: page.publishedAt,
      dateModified: page.updatedAt,
      mainEntityOfPage: { "@id": url + "#page" },
    });
  if (page.slug !== "/") {
    let crumbs = [{ name: "Home", item: b.url + "/" }];
    const parent = registry.find(
      (p) => p.slug === `/${page.slug.split("/")[1]}/`,
    );
    if (parent && parent.slug !== page.slug)
      crumbs.push({ name: parent.label, item: b.url + parent.slug });
    crumbs.push({ name: page.label, item: url });
    graph.push({
      "@type": "BreadcrumbList",
      "@id": url + "#breadcrumb",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        ...c,
      })),
    });
    item.breadcrumb = { "@id": url + "#breadcrumb" };
  }
  graph.push(item);
  return { "@context": "https://schema.org", "@graph": graph };
}
export function renderPage(
  page,
  {
    registry = pages,
    production = productionReady(),
    bodyOverride,
    receiptId = "",
    error = false,
  } = {},
) {
  const json = schema(page, registry);
  const index = isIndexable(page, production) && !error;
  const body =
    bodyOverride ??
    (page.type === "home"
      ? home(registry)
      : !isPublished(page)
        ? construction(page)
        : page.type === "hub"
          ? hub(page, registry)
          : page.type === "about"
            ? about(registry)
            : detail(page, registry));
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(page.title)}</title><meta name="description" content="${e(page.description)}"><meta name="robots" content="${index ? "index, follow" : "noindex, nofollow"}"><link rel="canonical" href="${b.url}${page.slug}"><meta property="og:type" content="website"><meta property="og:title" content="${e(page.title)}"><meta property="og:description" content="${e(page.description)}"><meta property="og:url" content="${b.url}${page.slug}"><meta property="og:image" content="${b.url}/assets/workplace.webp"><meta property="og:site_name" content="${e(b.shortName)}"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#c90000"><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/styles.css"><script src="/site.js" defer></script>${json ? `<script type="application/ld+json">${JSON.stringify(json).replaceAll("<", "\\u003c")}</script>` : ""}</head><body data-page="${e(page.slug)}"${receiptId ? ` data-receipt="${e(receiptId)}"` : ""}>${header(page, registry)}<main id="main">${breadcrumbs(page, registry)}${page.type === "home" ? "" : pageHero(page)}${body}</main>${footer(registry)}</body></html>`;
}
export function notFound() {
  const p = {
    slug: "/404/",
    type: "utility",
    label: "Page not found",
    h1: "That page isn’t here.",
    title: "Page not found | City Wide Southwest Los Angeles",
    description: "Find City Wide services or contact our local team.",
    plannedSections: [],
    relationships: [],
  };
  return renderPage(p, {
    bodyOverride: `<section class="container empty-state"><p>Check the address or explore our facility services.</p>${button("Explore Services", "/services/")}</section>`,
    error: true,
  });
}
