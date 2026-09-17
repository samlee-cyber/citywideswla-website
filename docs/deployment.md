# Verified design preview

- URL: https://city-wide-swla-concept-bchm65s3d-citywideswla.vercel.app/
- Vercel project: city-wide-swla-concept
- Scope: citywideswla
- Deployment ID: dpl_71KdioAh6MpwRTa67QVwCkM8aEMp
- Inspector: https://vercel.com/citywideswla/city-wide-swla-concept/71KdioAh6MpwRTa67QVwCkM8aEMp
- Target requested: preview
- Browser verification: homepage renders; official logo and both WebP images load; no desktop horizontal overflow; noindex,nofollow metadata is present.
- Access: Vercel sign-in protection is enabled. The signed-in Edge session successfully displayed the site. The in-app browser without Vercel login was redirected to sign-in.
- Live lead delivery: not connected. No recipient or credentials have been supplied. Direct browser navigation to the configuration API was blocked by the browser client; hosted API behavior is not independently verified. Local mocked handler tests pass.
- Production domain: not connected by this task. Cloudflare DNS was not modified.

## Workspace separation

During this work, another project was written to the parent workspace and replaced the package and Vercel configuration with a Next.js setup. The initial upload mixed those files with this concept and failed. The final concept is isolated in `design-preview/`, with its own configuration and deployment. Parent project files were not reverted.

The earlier city-wide-swla deployment (dpl_77qFYyrGDGA3u223TKTx4yUZCDya) failed and is superseded by the concept deployment above. Do not use the earlier URL as the deliverable.
