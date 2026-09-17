import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/lead.mjs';
import configHandler from '../api/form-config.mjs';

const valid = { name: 'Test Person', email: 'test@example.com', company: 'Test Company', city: 'Long Beach', service: 'Building maintenance', message: 'Test only', requestId: '12345678-1234-4234-8234-123456789abc', token: 'test-token' };
const req = (body = valid, origin = 'https://www.citywideswla.com') => ({ method: 'POST', headers: { origin, 'content-type': 'application/json' }, body });
function response() { return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } }; }
test('contact flow validation and delivery boundaries', async (t) => {
  const names = ['RESEND_API_KEY', 'LEAD_TO_EMAIL', 'LEAD_FROM_EMAIL', 'TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY'];
  const original = Object.fromEntries(names.map(k => [k, process.env[k]]));
  const originalFetch = globalThis.fetch;
  try {
    names.forEach(k => delete process.env[k]);
    await t.test('unconfigured delivery cannot report success', async () => { const res = response(); await handler(req(), res); assert.equal(res.code, 503); assert.ok(res.body.error); const config = response(); configHandler({ method: 'GET' }, config); assert.deepEqual(config.body, { ready: false, siteKey: null }); });
    names.forEach(k => { process.env[k] = 'test-only'; });
    await t.test('rejects invalid data and unexpected origin', async () => { for (const request of [req({ ...valid, email: 'bad' }), req({ ...valid, company: '' }), req({ ...valid, service: 'unknown' }), req({ ...valid, website: 'bot' }), req({ ...valid, name: 'Name\r\nBcc: x' })]) { const res = response(); await handler(request, res); assert.equal(res.code, 400); } const res = response(); await handler(req(valid, 'https://other.example'), res); assert.equal(res.code, 403); });
    await t.test('failed anti-spam verification never calls the mail service', async () => { let calls = 0; globalThis.fetch = async () => { calls++; return { ok: true, json: async () => ({ success: false }) }; }; const res = response(); await handler(req(), res); assert.equal(res.code, 400); assert.equal(calls, 1); });
    await t.test('wrong hostname or action never sends mail', async () => { for (const challenge of [{ hostname: 'other.example', action: 'walkthrough' }, { hostname: 'www.citywideswla.com', action: 'other' }]) { let calls = 0; globalThis.fetch = async () => { calls++; return { ok: true, json: async () => ({ success: true, ...challenge }) }; }; const res = response(); await handler(req(), res); assert.equal(res.code, 400); assert.equal(calls, 1); } });
    const verified = { ok: true, json: async () => ({ success: true, hostname: 'www.citywideswla.com', action: 'walkthrough' }) };
    await t.test('mail service failure cannot become a successful form response', async () => { globalThis.fetch = async url => url.includes('siteverify') ? verified : { ok: false, json: async () => ({ message: 'Rejected' }) }; const res = response(); await handler(req(), res); assert.equal(res.code, 502); });
    await t.test('successful send uses fixed recipient, reply-to, and idempotency key', async () => { let sent; globalThis.fetch = async (url, options) => { if (url.includes('siteverify')) return verified; sent = options; return { ok: true, json: async () => ({ id: 'test-message' }) }; }; const res = response(); await handler(req(), res); assert.equal(res.code, 200); assert.deepEqual(res.body, { ok: true }); const payload = JSON.parse(sent.body); assert.deepEqual(payload.to, ['test-only']); assert.equal(payload.reply_to, valid.email); assert.equal(sent.headers['Idempotency-Key'], `walkthrough/${valid.requestId}`); });
  } finally { globalThis.fetch = originalFetch; names.forEach(k => original[k] === undefined ? delete process.env[k] : process.env[k] = original[k]); }
});
