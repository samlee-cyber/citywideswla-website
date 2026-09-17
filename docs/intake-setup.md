# Walkthrough intake setup and operation

## Real delivery requirements

The owner still needs to identify the receiving local inbox or CRM. Current implementation uses a Resend email handoff to a fixed local inbox. No CRM has been selected or connected. Success means Resend acknowledged the handoff and the durable retry record was updated; it does not mean a person has read the email or that an appointment is booked.

Configure these server-only environment variables in Vercel, separately for preview and production:

| Name | Purpose |
| --- | --- |
| LEAD_TO_EMAIL | Owner-approved destination inbox; never taken from visitor input |
| LEAD_FROM_EMAIL | Sender on a domain verified in Resend |
| RESEND_API_KEY | Restricted sending credential for that sender |
| UPSTASH_REDIS_REST_URL | Dedicated durable Redis HTTPS endpoint |
| UPSTASH_REDIS_REST_TOKEN | Server write credential for that database |
| INTAKE_SIGNING_KEY | Random secret, at least 32 characters, for signed cookies and keyed fingerprints |

Keep credentials out of code, chat, screenshots, public logs and browser JavaScript. No sample credential enables production. With configuration absent, the site renders only a call-first message and the phone number, without editable fields or a submit button. Older/native POSTs and JSON submissions fail closed with 503; older entered values are preserved as escaped read-only details. No mock-success path is shipped.

Redis must have persistence enabled and key eviction disabled; use a dedicated database. It stores only keyed IP/content/request fingerprints and receipt metadata, not the form's contact text. IP throttles expire after 15 minutes; duplicate records after 24 hours. The actual form details are sent to Resend and the destination inbox. Confirm their retention/access policy with the owner and update the privacy notice if providers change. Do not rotate the signing key mid-retry window without coordinating duplicate prevention and cookie invalidation.

## Behavior

- HTML: GET `/request-walkthrough/` issues a signed session/form token. Native POST uses explicit labels and standard controls, no JavaScript or visual CAPTCHA required. Required fields: name, work email, company, city and service. Phone, facility type, size, frequency and details optional. Size is a positive integer encoded as text, if provided. These are the brief's default rules, not business eligibility limits.
- Validation errors render 422 with retained values and field associations. The error summary receives focus. A verified email handoff produces 303 to `/request-received/` and a signed, HttpOnly, SameSite=Lax receipt cookie (Secure on Vercel). A direct visit remains neutral.
- POST `/api/v1/walkthrough-request` shares the same intake logic and returns 201 with a genuine request reference. Contract: `/openapi.json`. No CORS permission is granted to arbitrary browser sites; non-browser clients may omit Origin.
- Native forms enforce origin and a signed form token bound to the session cookie. Foreign browser origins fail 403. JSON fields and body types are validated. Body limit 16 KB. Honeypot filled requests are rejected without sending.
- 10 attempts per trusted Vercel source IP per 15 minutes; 429 includes Retry-After. If no trusted IP is available, requests share the conservative unknown bucket. The deployment must verify the trusted forwarding header; never trust a caller-controlled X-Forwarded-For on a different host.
- Atomic Redis reservation checks both Idempotency-Key and a keyed normalized-content fingerprint. Concurrent submission gets 429. Same key with different content gets 409. Equivalent content with a different key reuses the reference during the 24-hour window.
- Resend's Idempotency-Key stays bound to the generated reference. A timeout is ambiguous: retry the same request/key, not a new inquiry. Retry attempts stop at 23 hours, within the provider's 24-hour idempotency window. For older uncertain requests call the office before resubmitting.
- Infrastructure errors fail closed. If Redis finalization fails after the email provider accepted, the page reports unconfirmed delivery; a retry uses the same provider key, avoiding a second handoff. No personal data is printed in server errors.

## Activation verification

1. Configure a dedicated preview inbox and the six variables securely. Confirm the sender domain with Resend, using the exact DNS records it provides. Leave existing email DNS intact.
2. Submit one clearly labeled fictional test via the browser with JS enabled. Confirm exactly one real inbox receipt with the same reference.
3. Retry the same logical request and verify the original reference and one inbox message. Repeat with browser JS disabled and a new fictional request.
4. Exercise invalid form input, API validation, 429, unavailable Redis/email and malformed origin. Confirm no false success and preserved form input. Use test environments for forced outages.
5. Review bounce/delivery events and the receiving inbox. Configure provider monitoring or a notification destination approved by the owner. Provider acceptance alone cannot prove final inbox delivery.
6. Set production variables, redeploy, and repeat one owner-approved end-to-end test. Remove only clearly designated disposable test messages through normal recovery workflows.

Automated tests use an injected in-memory store and stub provider at test boundaries only. They verify validation, retries, concurrency, receipts and adapter request construction. Production Redis Lua execution and actual inbox delivery still require the credentials above; they have not been represented as live-tested.
