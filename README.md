# City Wide Southwest Los Angeles website

Brand-aligned commercial cleaning and facility services site for **https://www.gocitywideswla.com**. Static HTML/CSS/browser JavaScript, a typed content registry and Node 24 functions on Vercel. Cloudflare can remain the DNS provider. No runtime packages are required.

```sh
npm run build
npm run check
npm run typecheck
npm test
npm run preview
```

Local preview: http://127.0.0.1:4174. Optional local-only `?nojs=1` uses a CSP that blocks scripts for native form/navigation checks. Production does not expose this testing switch.

## Documentation

- [Baseline and decisions](docs/seo-ai-agent-audit.md)
- [Owner editing and publishing guide](docs/publishing-guide.md)
- [Intake setup and delivery tests](docs/intake-setup.md)
- [Domain, search and crawler setup](docs/search-launch.md)
- [Verification and remaining dependencies](docs/verification.md)
- [Source ledger](docs/sources.md)

## Vercel import

Import `samlee-cyber/citywideswla-website`. Use the repository root, framework **Other**, Node **24.x**; build/output/routing are in `vercel.json`. Keep deployment protection on for previews. Credentials go in Vercel, never in source. See `.env.example` for the names.

A normal build is noindex. Production indexing requires `VERCEL_ENV=production` and `SITE_LAUNCH=production`. Rebuild in that environment for launch; do not promote a preview's noindex HTML unchanged.

Online intake intentionally fails closed until the inbox, sender and durable duplicate/rate-control credentials are configured. It supports a native HTML form and a shared JSON endpoint documented at `/openapi.json`; successful receipt requires an acknowledged email handoff.
