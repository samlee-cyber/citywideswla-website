const allowedServices = new Set(['Janitorial & commercial cleaning', 'Floor, carpet & upholstery care', 'Building maintenance', 'Windows & pressure washing', 'Parking lot services', 'Disinfecting & supplies', 'Multiple services / not sure yet']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const fail = (code, error) => res.status(code).json({ error });
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return fail(405, 'Method not allowed.'); }
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return fail(415, 'Please use the website request form.');
  const allowedHosts = new Set(['www.citywideswla.com', 'citywideswla.com', process.env.VERCEL_URL].filter(Boolean));
  try { const origin = new URL(req.headers.origin); if (origin.protocol !== 'https:' || !allowedHosts.has(origin.hostname)) return fail(403, 'Please send your request from our website.'); } catch { return fail(403, 'Please send your request from our website.'); }
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(400, 'Please check your form details.');
  if (JSON.stringify(body).length > 12000) return fail(413, 'Your request is too long. Please shorten your message.');
  if (body.website) return fail(400, 'Your request could not be accepted. Please call our team.');
  const fields = { name: 100, email: 254, company: 150, phone: 30, city: 100, service: 100, message: 3000 };
  const data = {};
  for (const [field, max] of Object.entries(fields)) {
    if (body[field] !== undefined && typeof body[field] !== 'string') return fail(400, 'Please check your form details.');
    data[field] = (body[field] || '').trim();
    if (data[field].length > max || (field !== 'message' && /[\r\n]/.test(data[field]))) return fail(400, 'Please check your form details.');
  }
  if (!data.name || !data.company || !data.city || !emailPattern.test(data.email) || !allowedServices.has(data.service) || !uuidPattern.test(body.requestId || '')) return fail(400, 'Please complete your name, work email, company, city, and service.');
  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL, TURNSTILE_SECRET_KEY } = process.env;
  if (!RESEND_API_KEY || !LEAD_TO_EMAIL || !LEAD_FROM_EMAIL || !TURNSTILE_SECRET_KEY) return fail(503, 'Online requests are not available yet. Please call (562) 473-3136.');
  if (typeof body.token !== 'string' || !body.token || body.token.length > 2048) return fail(400, 'Please complete the security check.');
  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: body.token }), signal: AbortSignal.timeout(8000) });
    const challenge = await verification.json();
    if (!verification.ok || !challenge.success || challenge.action !== 'walkthrough' || !allowedHosts.has(challenge.hostname)) return fail(400, 'The security check expired or failed. Please try again.');
    const lines = ['New facility walkthrough request', '', ...Object.entries(data).map(([key, value]) => `${key}: ${value || '(not provided)'}`), '', `Request ID: ${body.requestId}`, 'Source: www.citywideswla.com'];
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `walkthrough/${body.requestId}` }, body: JSON.stringify({ from: LEAD_FROM_EMAIL, to: [LEAD_TO_EMAIL], reply_to: data.email, subject: 'New City Wide SWLA walkthrough request', text: lines.join('\n') }), signal: AbortSignal.timeout(10000) });
    const result = await response.json();
    if (!response.ok || !result.id) return fail(502, 'We couldn’t send your request. Please try again or call (562) 473-3136.');
    return res.status(200).json({ ok: true });
  } catch { return fail(502, 'We couldn’t confirm delivery. Please call (562) 473-3136 or try again.'); }
}
