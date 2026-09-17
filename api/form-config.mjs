export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const ready = Boolean(process.env.LEAD_TO_EMAIL && process.env.LEAD_FROM_EMAIL && process.env.RESEND_API_KEY && process.env.TURNSTILE_SECRET_KEY && process.env.TURNSTILE_SITE_KEY);
  return res.status(200).json({ ready, siteKey: ready ? process.env.TURNSTILE_SITE_KEY : null });
}
