# Revision verification — September 16, 2026

## Completed locally

- Preview and production-mode builds pass. The production-mode test is a local build, not a production deployment. Restored the local preview to noindex after the check.
- 43 registered routes: 10 published-content pages, 32 construction pages, and one permanently noindex receipt utility. Case-study detail templates are available for real project records; no fictional project route ships.
- Static crawl: 1,222 internal references resolve; one H1 per page, unique indexable titles/descriptions, canonical URLs, valid JSON-LD parsing, image dimensions/alt text, no orphaned published pages, and expected sitemap membership.
- HTTP crawl: all 43 pages return 200; 93 configured path redirects return direct 301s to live targets. Unknown paths and unknown case-study slugs return genuine 404s.
- Construction → published → construction was exercised through three real temporary builds. Initial HTML robots directives, placeholders, sitemap, Service schema and contextual related links all follow the one status change.
- Typed registry passes TypeScript 5.9.3 with `jsconfig.json`. All JavaScript files pass Node syntax checks. Prettier 3.6.2 formatted the source.
- 19 automated tests pass: consent and conversion deduplication; field validation; missing configuration; origin/CSRF; honeypot/body limits; duplicate requests and concurrency; throttling; storage/email failure; HTML 303 receipt; forged/direct receipts; API response contract; provider adapter arguments; customer gates; content lifecycle; case-study publication requirements.
- HTTP API invalid input returns 422 with stable field errors. OpenAPI exposes exactly one public action. Robots permits fetching public construction pages. Local requests from Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot and Claude-User user agents receive 200. These tests do not validate production CDN/WAF behavior.
- Browser: reviewed desktop homepage, Commercial Cleaning detail, About/portrait, and case-study empty state/filter; reviewed mobile homepage, service hub, construction template and form at 390 × 844. No horizontal overflow in measured views. Native mobile menu opens, follows links and closes with JavaScript enabled.
- Browser native POST with JavaScript enabled and with scripts blocked by a local-only CSP returns an honest unavailable-delivery error and preserves fictional test input. Error summary receives focus. No conversion receipt is generated. No real message was sent.
- Image audit: only official logo, official cleaning photo, illustrative workplace photo, official standalone Sam Lee portrait and favicon are public. The original proposal proof image and candidate customer logos are not included.

## Performance budget

Same-file byte comparison against baseline fdb2c52, gzip generated locally for a consistent comparison (not a measured network transfer):

| Asset | Original bytes | Revised bytes | Original gzip | Revised gzip |
| --- | ---: | ---: | ---: | ---: |
| Homepage HTML | 21,146 | 22,532 | 6,288 | 5,214 |
| CSS | 21,472 | 26,124 | 5,235 | 5,240 |
| JavaScript | 4,570 | 3,061 | 1,715 | 1,155 |

Combined compressed HTML/CSS/JS decreases from 13,238 to 11,609 bytes (about 12%). Homepage raster assets are unchanged. The owner portrait adds 23,873 bytes only on About and is lazy-loaded. System fonts, deferred script, explicit image dimensions and below-fold lazy loading are retained. No new third-party frontend script is loaded. More catalogue cards increase homepage length intentionally.

No Lighthouse score, field Core Web Vitals, screen-reader session, or production latency claim is made. Inspect field performance after real domain launch and collect a repeatable Lighthouse baseline on the deployed revision.

## Explicit remaining dependencies

1. The revised Vercel preview upload was blocked by automatic approval review because its inline upload exceeded the 200,000-byte review limit. The previous concept URL is not this revision. Hosted function rewrites and headers still need verification on the new deployment.
2. Receiving local inbox or CRM, verified sender, Resend credential, durable Redis endpoint/token and signing secret. Exact setup is in intake-setup.md. Real Redis Lua execution and one live inbox receipt/retry test remain pending.
3. Domain ownership, Vercel connection and Cloudflare DNS/WAF checks for www.gocitywideswla.com. No production DNS or account security settings changed.
4. Approved substantive content for 32 construction pages, real case studies, separate client-name/logo disclosure permissions, and optional owner-reviewed operating facts.
5. Analytics/consent integration, search-account verification, listing audit and training-crawler choices. No rankings or AI citations promised.
