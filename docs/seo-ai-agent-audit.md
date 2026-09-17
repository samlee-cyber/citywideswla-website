# Baseline and implementation audit

Inspected 2026-09-16, baseline commit fdb2c52. Canonical repository: citywideswla-website. The separate application in the parent directory is outside this change.

## Existing implementation

- Static HTML/CSS/browser JavaScript; zero runtime packages; Node 24 custom build and Vercel Node Functions. Retained.
- One homepage, fragment navigation, a 404 page, manually maintained sitemap/robots. No service, industry, location or article pages.
- Preview used noindex but blocked all crawling. This prevents crawlers reading the directive; revised previews remain noindex with Vercel access protection, public construction pages remain crawlable.
- Lead intake: JSON-only email handoff and mandatory Turnstile; no native HTML submission, durable duplicate/rate control, or signed receipt. Missing delivery configuration. No live delivery claimed.
- No analytics platform, consent manager, Search Console or Bing verification found. Do not invent platform IDs.
- Baseline Node build/check and seven test results pass. Asset budget: HTML 21,146 bytes, CSS 21,472, JS 4,570; primary images 145,326 bytes including logo. Total listed frontend assets 192,797 bytes. No prior field Core Web Vitals or comparable Lighthouse measurement available.

## Evidence and editorial boundaries

Owner supplied implementation brief and two proposal pages. Only three operational metrics enter the website; the complete proposal proof image is never copied into the repository. Service summaries follow the supplied catalogue. Customer records are private source candidates, with separate name and logo gates defaulting false. No customer data is serialized to the browser until approved. Case studies have no approved projects yet.

Phone and current office verified against https://gocitywide.com/southwestlosangeles/contact/ and /our-team/ on 2026-09-16. Owner portrait uses the official team image. National and local entities remain distinct. No hours, prices, certifications, reviews, service guarantees or project outcomes added.

## URL decisions

Owner explicitly selected https://www.gocitywideswla.com on 2026-09-16. HTML routes use trailing slashes; assets and API routes do not. The old hostname requires DNS/Vercel domain ownership before an external redirect can take effect. Keep original homepage fragments as section IDs. Explicit equivalent redirects: /index.html → /; /contact/ → /request-walkthrough/; /services-we-manage/ → /services/; /areas-we-serve/ → /locations/; /our-team/ → /about/. Unknown routes return 404, never the homepage.

## Remaining external checks

Vercel project/domain permissions and Cloudflare WAF settings must be checked in the owner account before domain launch. Do not bypass preview protection or weaken firewall controls by trusting user-agent alone. Preserve training-crawler policy: baseline had no explicit GPTBot, ClaudeBot or Google-Extended decisions; record an owner decision before changing these. General production crawling remains allowed as before.
