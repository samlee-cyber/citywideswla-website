# Management-first messaging revision

Source: owner-supplied `City_Wide_SWLA_Management_First_Website_Messaging.docx`, received September 16, 2026. It replaces the earlier cleaning-led copy and homepage hierarchy; the technical and publication safeguards remain in effect.

## Implemented

- Homepage: commercial building maintenance management hero; conditional managed-janitorial program and three benefits; approved metrics; all 13 services; janitorial buyer section; four-step program; industries; honest case-study empty state and gated customer proof; local owner and service areas; resources; final CTA.
- All service URLs remain intact. Managed Janitorial Services is the display name for `/services/commercial-cleaning/`; the remaining 12 services are grouped into interior care, exterior care, and repairs and improvements on the homepage and services hub.
- Janitorial page: management value, contract benefits, scope and schedule, quality oversight, separately priced related services, five buyer FAQs and dedicated walkthrough links.
- Navigation adds How We Work and renames Services to Managed Services. About, location introductions, walkthrough introduction, footer, resources, page metadata and LocalBusiness/Service descriptions use the new positioning.
- Fractional management benefits are tied to managed janitorial contracts. Additional services are separately scoped and priced; no lowest-price, savings, response-time or full-time onsite staffing promises were added.
- The top image shows a commercial facility. Cleaning-worker imagery is confined to the janitorial buyer section. No new stock image is represented as the local City Wide team.
- Janitorial CTA links use `?service=commercial-cleaning`. The server accepts only known service slugs for preselection, including with JavaScript disabled. The existing `Commercial Cleaning & Janitorial` form/API value is preserved for compatibility while the visible select label says Managed Janitorial Services (commercial cleaning).

## Verification

- 43-route build; 1,313 internal references, including query-string links and cross-page anchors; metadata, schema, image semantics, publication gates, syntax and sitemap checks pass.
- Content TypeScript check and source formatting checks pass.
- 20 automated tests pass, including native GET preselection for janitorial, another service, absent input and unknown/malicious query input; existing delivery, retry, analytics and publication tests remain passing.
- Local HTTP checks pass for all 43 routes, 93 direct redirects, real 404s, crawler access, API validation and no-JavaScript mode.
- Browser inspection: desktop homepage; 390 × 844 homepage, management program, services hub, janitorial page and preselected walkthrough. Homepage and form have no horizontal overflow. Native mobile menu opens and links to the homepage program. Preselection also verified with scripts blocked.

The receiving inbox and production intake credentials are still required for live inquiry delivery. This copy revision does not change DNS, Vercel environment variables or production indexing settings.
