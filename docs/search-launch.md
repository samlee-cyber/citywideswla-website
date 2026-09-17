# Search, crawler and domain launch checklist

Canonical: https://www.gocitywideswla.com/ (owner selected). HTML paths end in `/`. Service/city pages are not mass-generated combinations. Unknown paths return 404. Existing homepage section fragments remain present.

## Hosting and domain

1. Connect the GitHub repository to the existing Vercel project. Framework Other, root `./`, Node 24, build `node scripts/build-vercel.mjs`, output `dist`. Keep preview access protection enabled. Validate dynamic form/receipt rewrites on the hosted preview, not just static output.
2. Add www.gocitywideswla.com and its apex in Vercel. Copy the exact DNS instructions shown for that project into Cloudflare after checking existing records. Keep Cloudflare as the DNS provider; leave mail records unchanged. Prefer DNS-only for the Vercel web records unless a verified proxy configuration is required.
3. Set the apex and any owner-controlled former domains to permanent redirects to the chosen HTTPS hostname. Preserve paths, normalizing known slash variants directly to their canonical URL; avoid chains. The application includes explicit 301 path mappings in `vercel.json`. Cross-host HTTPS, ownership and DNS redirects require the actual domain connection and are not claimed complete here.
4. Do not silently replace another live website or redirect the franchise's gocitywide.com pages; those are separately owned.
5. Verify production pages, redirect status/targets, HTTPS, no redirect loops, schema and sitemap responses. Enable `SITE_LAUNCH=production` only in production and rebuild once content and intake are approved. Preview remains noindex. The build flag alone does not change domains or bypass access protection.

## Search owner setup

- Google Search Console: verify the canonical domain through the owner account using its exact DNS TXT record; submit `/sitemap.xml`. Inspect Home, Commercial Cleaning and About with URL Inspection, then review indexing coverage and Core Web Vitals. Do not delete unrelated DNS verification records.
- Bing Webmaster Tools: verify the same domain and submit the sitemap. Review crawl/indexing reports and any AI referral reporting actually available in the account.
- Google Business Profile and Bing Places: compare business name, (562) 473-3136, and 2750 N Bellflower Boulevard, Suite 206, Long Beach, CA 90815 against owner-managed records. Current franchise pages agree. Audit old Bellflower-address listings before correcting them; no third-party listings have been edited.
- IndexNow: optional after verification and launch. Configure an owner-controlled key file and submit only genuinely changed published canonical URLs. Do not send construction, utility, filter, preview or test URLs. No key or automatic submitter has been invented.

## Crawler policy

`robots.txt` permits public discovery while excluding `/api/` and `/admin/`. Construction pages are intentionally crawlable so initial-HTML noindex can be read. Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot and Claude-User inherit the public allow rule. Access-controlled previews stay private regardless of robots.

The baseline had no explicit GPTBot, ClaudeBot or Google-Extended rule. No new training-specific rule has been imposed. Record the owner's training/grounding decision before changing this. Google-Extended is separate from ordinary Google Search and is not a search-only control.

Check Cloudflare and Vercel bot/WAF logs using verified crawler identification and actual fetches after domain connection. Do not disable general security controls just because a client sends a search-bot user-agent. Local crawler-agent HTTP tests establish application behavior only; they do not prove production edge accessibility. llms.txt, MCP, service-area APIs and proposal-status APIs are intentionally deferred.

## Measurement

Select the analytics platform and consent integration; no platform existed in the baseline. Use the existing event adapter described in publishing-guide.md. Monitor organic traffic, referrals from AI products where a referrer is supplied, and qualified walkthrough inquiries. An absent AI referrer does not prove no AI influence. Search rankings and AI citations cannot be guaranteed.
