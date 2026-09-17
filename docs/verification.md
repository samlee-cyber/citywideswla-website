# Verification — September 16, 2026

## Completed

- Static build passes, without package installation.
- Checks passed for unique element IDs, in-page anchor targets, asset references, one H1, canonical URL, phone number, and preview indexing.
- Desktop browser review completed for the homepage and local contact form.
- At 390 × 844: reviewed hero and contact form; no horizontal overflow; opened mobile navigation and verified it closes after following a link.
- Service filtering: Exterior services shows Windows & pressure washing and Parking lot services; All services restores the catalogue.
- All homepage images loaded successfully in the local browser.
- Submitted non-sensitive test values locally: unavailable delivery is reported explicitly; no success is fabricated and entered details remain available.
- Seven Node test results passed (six subtests plus suite) for the lead endpoint. Cases include unavailable delivery, invalid input, foreign origin, rejected anti-spam verification, incorrect challenge hostname/action, provider failure, and accepted email handoff with a fixed recipient and idempotency key.
- Raster website assets were converted to WebP for delivery; source JPGs remain available locally.

## Still required for production

- Confirm the destination inbox or CRM and securely connect the sending credentials.
- Verify a real test inquiry arrives at the intended destination, including failure monitoring and spam handling.
- Verify final privacy content against the configured providers and business practices.
- Connect the production domains and validate HTTPS, redirect, production indexing, and sitemap.
- Gather permissioned local project photography/testimonials for the Boston-inspired proof sections.

No production DNS records have been changed. The local server is a development preview; live form APIs run on Vercel, once configured.

The isolated Vercel concept was subsequently verified in the signed-in browser: homepage rendered, all four image elements loaded, and `noindex, nofollow` was present. See `deployment.md`. The hosted form API remains unverified and live delivery is not configured.
