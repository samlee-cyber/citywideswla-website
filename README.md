# City Wide SWLA design preview

This website uses the current City Wide identity and the City Wide Boston reference. It includes a responsive homepage, local service information, and a custom walkthrough request form.

## Run locally

Requires Node.js 24. No dependencies need to be installed.

```sh
node scripts/build.mjs
node scripts/check.mjs
node --test scripts/lead.test.mjs
node scripts/serve.mjs
```

Open http://127.0.0.1:4173. Stop any other server on this port first. Edit files in `public/`, rebuild, and reload. Vercel builds to `dist/` using `vercel.json`; `/api` contains the form functions.

## Import this repository into Vercel

Import `samlee-cyber/citywideswla-website` and select the `main` branch. Use the repository root (`./`) as the Root Directory and **Other** as the Framework Preset. The included `vercel.json` supplies the Build Command (`node scripts/build.mjs`) and Output Directory (`dist`). Use Node.js 24.x. No dependency installation or framework setup is needed.

Deploying creates a reviewable website immediately. Leave `SITE_LAUNCH` unset until the site is ready for search indexing. The walkthrough form requires the destination and provider credentials below before it can send requests. Connect `www.citywideswla.com` only when ready to switch the live site.

## Preview versus launch

All builds are noindex unless BOTH `VERCEL_ENV=production` and `SITE_LAUNCH=production` are set. Leave `SITE_LAUNCH` unset for concept previews. The intended production domain is www.citywideswla.com, but no production DNS records have been changed.

## Lead routing

The business owner requested a separate local inbox or CRM, not the franchise HubSpot form. The exact destination is pending. The included email adapter uses Resend and Cloudflare Turnstile. Set the variables in `.env.example` securely in Vercel after confirming the destination and sending provider. The UI does not report success when the endpoint is unconfigured. API keys never enter browser code. Mocked tests send no email.

See `docs/launch-plan.md`, `docs/sources.md`, and `docs/verification.md` for handoff details.
