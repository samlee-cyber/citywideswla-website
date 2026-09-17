# Launch plan: www.citywideswla.com

## Recommended architecture

| Hostname | Purpose | Hosting | DNS |
| --- | --- | --- | --- |
| www.citywideswla.com | Lead generation and local service website | Vercel | Cloudflare |
| citywideswla.com | Redirect to www.citywideswla.com | Vercel domain redirect | Cloudflare |
| app.citywideswla.com | Future customer-facing app, when built | Separate Vercel project | Cloudflare |
| Other named subdomains | Future tools as needed | Separate projects | Cloudflare |

App subdomains are proposed, not currently created or advertised. Existing Cloudflare workloads can remain on Cloudflare; there is no requirement to migrate them to host the marketing site or future apps on Vercel. If the root marketing site already runs on Cloudflare, it can also stay there while apps run on Vercel.

Keep nameservers at Cloudflare. Add the exact A/CNAME values Vercel shows for this project. Vercel recommends DNS-only records for traffic to its deployments. Use the project's actual records, not generic IPs copied from a tutorial. Preserve existing MX, SPF, DKIM, DMARC, verification, and unrelated service records.

## Domain cutover sequence

1. Review the desktop and mobile preview with the business owner.
2. Connect and verify the chosen local lead destination. Confirm request delivery in the inbox/CRM, not merely an on-screen success state.
3. Confirm independent website branding, asset usage, and privacy content for the actual lead data flow.
4. Deploy a production build to the selected Vercel account/team. Confirm its plan permits the intended commercial use.
5. Add www.citywideswla.com and citywideswla.com to the project. Set the apex domain to redirect to www.
6. Record existing DNS values for rollback. Inspect domain requirements in Vercel and pre-verify ownership/certificates as available before cutover.
7. Apply only the required website records in Cloudflare; leave mail and unrelated apps intact.
8. Verify HTTPS, apex-to-www redirect, form delivery, phone links, 404 behavior, canonical, sitemap, and production indexing.
9. Add the production property to Search Console and submit the sitemap when the owner's account is available. Add analytics only after choosing the desired measurement and privacy setup.

## Design choices

- Official logo, familiar black/white/red palette, service-management positioning.
- More readable homepage hierarchy and one main conversion: request a walkthrough.
- Six expandable service categories with quick filters.
- Visible local office, verified service area, and direct call options.
- Mobile navigation and persistent call/request actions.
- Lightweight first-party site, with no tracking scripts loaded by default.
- No fake portal links: add the app navigation when apps exist.

## Current dependencies

- The owner chose a separate local inbox or CRM. The exact destination is pending. A custom form and optional Resend email-delivery endpoint are implemented; no franchise HubSpot form is used.
- Email delivery requires `LEAD_TO_EMAIL`, a verified `LEAD_FROM_EMAIL`, `RESEND_API_KEY`, `TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY` in Vercel. This is an implementation option, not an account or subscription already created. A CRM connector can replace the email adapter once the CRM is specified.
- Configure the Turnstile widget for the production domains and approved preview hostnames. The endpoint verifies challenge success, action, and hostname before sending. Add a Vercel firewall rate limit for POST /api/lead when the project exists. No secrets are exposed in the public form config.
- Mocked tests cover unavailable delivery, validation, origin checks, bot-verification failures, provider failures, and accepted sends. Real inbox delivery has not been tested.
- The verified preview is https://city-wide-swla-concept-bchm65s3d-citywideswla.vercel.app/. It requires Vercel sign-in. See `deployment.md` for deployment identity, verification, and workspace separation details.
- Cloudflare DNS has not been changed.
- Internal franchise brand standards and independent-site rules have not been supplied.

## Growth after the initial launch

The owner supplied City Wide Boston as a model. The next content expansion should include dedicated How We Work, Services, Industries, About/Leadership, and Contact pages, followed by authentic Before & After projects and local testimonials. The current deliverable is the working homepage and lead-form foundation. No placeholder case studies are presented as real work.

Create dedicated service pages and local case studies using verified projects and permissioned photography. Add a customer app as a separate Vercel project when its purpose and access requirements are defined. Avoid thin, duplicated city pages; write pages around actual local work and useful service information.
