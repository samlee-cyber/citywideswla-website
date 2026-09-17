# Website refinement — September 16, 2026

## Review result

Implemented the supplied Website Refinement brief in the existing static Node/Vercel application. Production promotion is pending; this revision is for protected preview review. Real inbox delivery and measurement-provider receipt are not verified.

- Homepage now follows the compact management/program/services/janitorial/local-team/questions sequence. Customer evidence is omitted because none is approved. The large red statistics band and full owner biography/portrait/quotation are removed from Home; regional detail and owner history remain on About.
- All 13 services remain on Services. Unfinished service, industry and location detail destinations become contextual inquiry links. Empty Case Studies and Resources hubs leave navigation, schema and sitemap; existing draft URLs retain noindex.
- Completed practical Hard Floor Care and Commercial Office content using approved service scope and management messaging; no invented outcomes, prices or customer claims.
- Intake is call-first whenever configuration is missing, with no editable form or inactive submit button. Older failed submissions retain escaped read-only details. Configured HTML/API behavior, five required fields, signed receipts and duplicate protection remain shared.
- Added truthful Inquiry API instructions and specification/configuration links. The configuration endpoint reports configuration presence, not a guarantee of successful delivery.
- Added allowlisted service-interest analytics and a guarded provider hook. No measurement vendor is installed without a selected platform/property and consent integration.

## Verification evidence

- `node --test scripts/*.test.mjs`: 27 passing tests. Coverage includes native/API validation, CSRF/origin, missing configuration, failed provider/Redis, idempotency/concurrent retry/rate limits, receipts, consent and conversion deduplication, hub publication/reversal, owner-preview exclusion and direct 301 routing.
- `tsc -p jsconfig.json`: passed.
- Production-mode build/check: 44 routes and 1,177 internal references validated, with unique titles/descriptions, H1s, schema parsing, image semantics, canonical/indexing policy and sitemap gates. Static preview rebuilt afterward with noindex.
- Real build publish → unpublish fixtures changed HTML, schema, related links and sitemap. Empty-resource-hub lifecycle checked against approved child publication and reversal. No test fixture is deployed.
- CUA visual checks: homepage at 390 × 844 and 1280 × 900, Services at 390px, Hard Floor Care at 640px. No horizontal overflow in those views. Body paragraphs are 16px; mobile fixed actions have 44px targets and bottom spacing. Keyboard Enter opens the native menu; Escape closes it and returns focus. Native details supports JavaScript-free navigation. Call-first inquiry with service preselection verified with scripts blocked by local CSP.
- Mobile homepage length, same 390px width: **14,987px before → 5,540px after (63.0% shorter)**. Construction labels: **28 → 0**. These are closed-menu/closed-FAQ full-document measurements.
- Narrow 640px reflow passed. Actual browser zoom, full screen-reader audit and all-device testing are not claimed complete. Existing visible focus styling and semantic labels were retained. Primary contrast remains dark text on white/light gray and white on brand red.

## Lab performance, not field Core Web Vitals

Development-only `?lab=1` on the loopback preview uses PerformanceObserver and a visible output. It is never included in Vercel output. Single unthrottled local loads, not mobile-network simulations:

| Viewport | Observed LCP | Sum of observed non-input layout shifts | Local TTFB | Load |
| --- | ---: | ---: | ---: | ---: |
| 1280px | 96ms | 0.0124 | 4.6ms | 27.2ms |
| 390px | 60ms | 0.0371 | 0.9ms | 20.7ms |

One desktop FAQ interaction had a 56ms observed event duration. This is not field INP. The observer reports a simple shift sum and max observed interaction duration, not a complete Core Web Vitals implementation. No 75th-percentile field LCP/INP/CLS data is available. Validate through the chosen production measurement provider after activation; target LCP ≤2.5s, INP ≤200ms and CLS ≤0.1. The homepage references about 197KB of uncompressed HTML/assets (including the lazy janitorial image); WebP assets, explicit image dimensions, a small deferred script and system fonts are retained.

## Search and preview access

- Current production robots permits public crawling and excludes API/admin. Requests to the live homepage with Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot and Claude-User user agents each returned HTTP 200. This proves these test requests pass the current edge, not that verified crawler IPs have no WAF restrictions. Full CDN/WAF bot-log verification remains an owner-access task. Training policy was not changed.
- Search Console domain property reports no access for the signed-in account. Bing Webmaster Tools requires sign-in. Sitemap submission, indexing reports, AI inclusion settings and IndexNow cannot be verified without the correct owner access/key. No DNS ownership records or external profiles were altered.
- Vercel Authentication/Standard Protection was verified enabled in the actual project settings. Preview builds include `/owner-preview/` with all routes; production builds exclude it and reject `OWNER_PREVIEW=1`. Never disable preview protection or treat robots as authentication.

## Remaining configuration — owner decisions/access

| Dependency | Needed before claiming completion |
| --- | --- |
| Lead destination | Owner-approved inbox or CRM choice. Current adapter supports Resend inbox delivery. |
| Server credentials | `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `INTAKE_SIGNING_KEY`; configure securely in Vercel, never chat or source. |
| Real delivery test | Dedicated labeled staging destination, confirmed email receipt, native JS-off and JSON submissions, retries, one accepted-lead event. Current automated tests use explicit test doubles; no unlabeled production lead was sent. |
| Analytics | Chosen platform/property and consent manager; provider mapping contract in publishing-guide.md. Actual provider event receipt remains untested. |
| Search | Owner account access to Search Console/Bing; sitemap submission, relevant AI settings and optional IndexNow key. Review external business listings before corrections. |
| Evidence | Approved case study/testimonial and genuine team/walkthrough images when available. Existing customer disclosure controls stay in force. |

## Files and release steps

Main changes: `content/pages.mjs`, `content/types.d.ts`, `lib/render.mjs`, `lib/publication.mjs`, `lib/form.mjs`, `api/walkthrough.mjs`, `api/form-config.mjs`, `public/styles.css`, `public/site.js`; build/check/test/preview scripts and `vercel.json`; publishing, intake, search and this handoff documentation.

Local review: `OWNER_PREVIEW=1 npm run build`, then `npm run preview`; homepage at http://127.0.0.1:4174/ and full architecture at http://127.0.0.1:4174/owner-preview/. The server binds only to loopback.

Hosted review: push the feature branch to the existing GitHub-connected Vercel project and inspect the protected preview. Check that an anonymous request is denied, signed-in review works, and the owner index is absent from production. Keep this revision in review until the requested delivery checks can be completed. To release, merge the reviewed commit to main and let Vercel build with `SITE_LAUNCH=production` in its production environment. Do not promote a noindex preview artifact directly.

Rollback: revert the refinement merge on main and allow the Git integration to rebuild, or use Vercel's previous production deployment rollback. Baseline main is `b9831aa42f7b7f0b560ae08da37f539078a2f8c1`. No DNS, email records, stored leads or database migrations are changed by this revision.
