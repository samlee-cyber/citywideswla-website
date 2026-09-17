# Deployment status

## Current revision

The current source is in the `citywideswla-website` repository directory, isolated from the unrelated application in the parent workspace. The revised site is verified locally at http://127.0.0.1:4174/ while its preview process is running.

A preview upload to the existing `city-wide-swla-concept` Vercel project was attempted on September 16, 2026. Automatic approval review rejected the upload because it exceeded the 200,000-byte review limit. No new Vercel preview was created by that attempt. Deployment remains pending an approved release path; no alternative deployment was used to bypass the rejection.

The revision targets a protected preview. Production launch and the www.gocitywideswla.com domain require the setup and checks in search-launch.md. Intake credentials and a real delivery test are also outstanding. Do not promote a preview noindex build directly to production: rebuild with production settings after launch approval.

## Historical concept preview (not the revision)

- URL: https://city-wide-swla-concept-bchm65s3d-citywideswla.vercel.app/
- Project: city-wide-swla-concept; scope citywideswla
- Deployment: dpl_71KdioAh6MpwRTa67QVwCkM8aEMp
- Vercel sign-in protection was enabled and the original homepage was verified in signed-in Edge.

This older URL does not contain the multi-page implementation described in the current verification report. No Cloudflare DNS records were modified by this work.
