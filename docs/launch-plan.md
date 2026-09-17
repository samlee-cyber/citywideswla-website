# Current launch plan

The September 16 revision supersedes the original single-page concept.

Use publishing-guide.md for content, intake-setup.md for real delivery, and search-launch.md for the canonical domain and search configuration. The owner selected www.gocitywideswla.com. The previously discussed hostname is not the current canonical target.

Remaining owner inputs: receiving inbox or CRM; approved customer disclosures and case studies; substantive detailed service/industry/location content; analytics and consent provider; explicit training-crawler preferences. Production launch also needs Vercel/Cloudflare account configuration and a verified live inquiry.

Rollback: redeploy the last verified Git commit in Vercel and verify the same routes, intake and indexing environment. Reverting a page to construction requires a new build. Do not delete intake state or rotate the signing secret when rolling back a template; that would invalidate receipts and retry controls. Keep domain and email DNS changes documented separately so they can be reversed without affecting unrelated records.
