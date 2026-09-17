# Editing and publishing

## Where to edit

- `content/business.mjs`: canonical domain, verified contact, services, owner profile, service areas, and three operational metrics.
- `content/pages.mjs`: route registry, titles, descriptions, sections, relationships, editorial approval and status.
- `content/types.d.ts`: typed Page, Section, Customer, and case-study record contracts.
- `content/customers.mjs`: website-approved relationships only. This is a public repository; keep unapproved candidate lists and evidence documents in private business storage.
- `lib/render.mjs` and `public/styles.css`: shared templates and visual design.
- `lib/fields.mjs`: one form/API field contract. It also generates OpenAPI.

Do not edit `dist/`; each build replaces it. Changes to a shared template affect every route.

## Publish an existing page

1. Fill all planned sections with substantive, verified copy. Review it against the page template described below. Add contextual related routes.
2. Record `approval.facts: true`, `approval.content: true`, and a source/approval reference in `approval.evidence`. Evidence should be a non-sensitive reference, not a copied private document.
3. Set genuine `publishedAt` and `updatedAt` dates. Update dates only for meaningful changes. Resources and case studies require a real author, dates and sources. Do not invent a reviewer.
4. Change `status` from `construction` to `published`. This is the final editorial switch. A missing or invalid status, or missing approval, stays in construction.
5. Run `npm run build`, `npm run check`, and `npm test`. For a production-indexing check run `VERCEL_ENV=production SITE_LAUNCH=production npm run build` and the same environment for `npm run check`.
6. Inspect the protected Vercel preview on desktop/mobile. Redeploy production after approval. A static rebuild is required: it changes page HTML, meta robots, JSON-LD, hub badges, contextual related links, and sitemap together.

To unpublish, change status to `construction`, rebuild and redeploy. The page stays available with its correct headings, layout, development notices and contact CTA, while schema claims disappear and the sitemap excludes it. Crawlers must be able to fetch it to read noindex. Do not block it in robots.txt.

Preview builds stay noindex, even for approved pages. Production indexing requires both Vercel's production environment and `SITE_LAUNCH=production`. Do not promote a noindex preview artifact directly as the launch; rebuild in the intended production environment.

## Adding a route

Add a Page record with a unique slash-terminated slug. Link it from its hub and appropriate related pages. Add a direct 301 rule for its no-slash and `/index.html` variants in `vercel.json`; the current 43 route rules are explicit and reviewed. Use a real 404 for missing content records. Do not use a catch-all route or invent projects to fill the site.

All specified service, industry, location, and resource routes are already registered. Case-study detail routes are created when a genuine project record is added under `/case-studies/{slug}/`. The reusable construction and published templates support this family; arbitrary unregistered slugs return 404. No invented sample case study is deployed.

## Detail-page checklist

- Service: direct answer, scope, facility needs/types, management delivery, walkthrough process, related services/industries/locations/case studies, factual FAQs and CTA. Day porter stays within Commercial Cleaning.
- Industry: answer, operational challenges, relevant services, management, separately approved organizations, projects, service areas, FAQs and CTA.
- Location: substantive city-specific context, services, facility types, management, industries, supported local context/project, nearby areas, FAQs and CTA. A service area is not a new office.
- Resource: direct answer, useful guidance/checklist, author, genuine dates, supporting sources, related pages and CTA.
- Case study: complete `caseStudy` fields from types.d.ts, `disclosureApproved: true`, verified results and publication approvals. Put the corresponding full narratives in the page's `content` sections. Category must match a hub filter. Cards use actual challenge/results/facility type/region/services. No client name or logo without its own approval.

Priority content queue: Logistics & Distribution operational details (access, shifts, traffic separation, agreed support areas); Long Beach local context and an approved local project; remaining service scopes; remaining locations; resource articles. Those details remain construction until supplied and reviewed. Do not infer regulated capabilities from customer names.

## Customer permissions

Add a record only with the owner's approval to disclose the relationship on the website and in this repository. Record name, industry, relationshipStatus, a precise relationshipLabel, an approval reference, optional approved case-study slug, and a permitted logo path.

`nameApproved` controls disclosure of the name. `displayApproved` separately controls the logo; both default false. An evidence reference and relationship label are required. No records are currently approved. An empty proof block is omitted rather than presenting placeholder logos as endorsements. Case-study approval is separate.

## Analytics

No platform was present, so no new vendor, account, tracking ID, or cookie banner was invented. `public/site.js` exposes a consent-gated dataLayer adapter. Your actual consent manager must set `window.cityWideAnalyticsConsent = true` after consent and dispatch `citywide:analytics-consent`; set it false on withdrawal. Integrate and test your selected analytics platform before counting this as active measurement.

Events: walkthrough_form_view, walkthrough_form_start, walkthrough_form_submit_success, walkthrough_form_submit_error, phone_click, email_click, service_cta_click, case_study_cta_click. Payloads contain only event and canonical page path. Form values, telephone numbers, email addresses, and receipt IDs are never sent to analytics. Receipt conversion uses a signed server receipt and sessionStorage deduplication; direct visits never count. When browser storage is blocked, success tracking is skipped rather than duplicated. With JavaScript disabled intake works, but browser analytics cannot run.
