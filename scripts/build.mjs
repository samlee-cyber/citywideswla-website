import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
// Preview and local builds must not compete with the production website in search.
if (process.env.VERCEL_ENV !== 'production' || process.env.SITE_LAUNCH !== 'production') {
  const html = await readFile('dist/index.html', 'utf8');
  await writeFile('dist/index.html', html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <meta name="robots" content="noindex, nofollow">'));
  await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
}
console.log(`Built static website for ${process.env.VERCEL_ENV || 'local preview'} in dist/`);
