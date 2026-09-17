import formConfig from "../api/form-config.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  acceptRequest,
  configured,
  IntakeError,
  emailSender,
  redisStore,
} from "../lib/intake.mjs";
import { createHandler as htmlHandler } from "../api/walkthrough.mjs";
import { createHandler as jsonHandler } from "../api/v1/walkthrough-request.mjs";
import { renderReceipt } from "../lib/form.mjs";
import { sign, verify, readBody } from "../lib/http.mjs";
import { fields } from "../lib/fields.mjs";
import { openapi } from "../lib/openapi.mjs";
const env = {
  INTAKE_SIGNING_KEY: "fictional-test-secret-with-at-least-32-characters",
  UPSTASH_REDIS_REST_URL: "https://example.test",
  UPSTASH_REDIS_REST_TOKEN: "test-only",
  RESEND_API_KEY: "test-only",
  LEAD_TO_EMAIL: "intake@example.com",
  LEAD_FROM_EMAIL: "website@example.com",
};
const payload = {
  contact_name: "Jordan Example",
  work_email: "jordan@example.com",
  company: "Fictional Test Company",
  phone: "",
  facility_city: "Long Beach",
  facility_type: "Commercial Office",
  service_needed: "Commercial Cleaning & Janitorial",
  facility_size_sqft: "",
  service_frequency: "",
  facility_details: "Fictional test only.",
};
function harness() {
  const records = new Map();
  let attempts = 0,
    sends = 0;
  return {
    records,
    get sends() {
      return sends;
    },
    store: {
      async rate() {
        return ++attempts;
      },
      async reserve(keys, hash, id, now, lease) {
        let r = records.get(keys[0]);
        if (r && r.fingerprint !== hash) return { state: "conflict" };
        r ||= records.get(keys[1]);
        if (r?.status === "received") return { state: "received", record: r };
        if (r?.status === "pending") return { state: "pending" };
        r = {
          request_id: r?.request_id || id,
          fingerprint: hash,
          status: "pending",
          lease,
        };
        keys.forEach((k) => records.set(k, r));
        return { state: "reserved", record: r };
      },
      async finish(keys, lease, status) {
        const r = records.get(keys[1]);
        if (r?.lease !== lease) return 0;
        r.status = status;
        return 1;
      },
    },
    async send() {
      sends++;
      return "provider-test-receipt";
    },
  };
}
function res() {
  return {
    headers: {},
    statusCode: 200,
    body: "",
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    getHeader(k) {
      return this.headers[k.toLowerCase()];
    },
    end(v = "") {
      this.body = v;
    },
  };
}
function req(body, overrides = {}) {
  return {
    method: "POST",
    url: "/request-walkthrough/",
    headers: {
      origin: "http://127.0.0.1:4174",
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
    socket: { remoteAddress: "127.0.0.1" },
    ...overrides,
  };
}
test("unconfigured valid intake fails closed; invalid fields remain useful", async () => {
  assert.equal(configured({}), false);
  await assert.rejects(
    acceptRequest(payload, { env: {} }),
    (e) => e.status === 503,
  );
  await assert.rejects(
    acceptRequest({ ...payload, work_email: "bad" }, { env: {} }),
    (e) => e.status === 422 && Boolean(e.fields.work_email),
  );
});
test("one acknowledged handoff per logical request and matching-content retry", async () => {
  const h = harness(),
    key = randomUUID();
  const options = { env, ...h, idempotencyKey: key };
  const first = await acceptRequest(payload, options);
  const second = await acceptRequest(payload, options);
  const third = await acceptRequest(payload, {
    ...options,
    idempotencyKey: randomUUID(),
  });
  assert.equal(first.status, "received");
  assert.equal(first.request_id, second.request_id);
  assert.equal(first.request_id, third.request_id);
  assert.equal(h.sends, 1);
  assert.ok(
    [...h.records.values()].every(
      (r) => !JSON.stringify(r).includes(payload.work_email),
    ),
  );
  await assert.rejects(
    acceptRequest({ ...payload, company: "Changed" }, options),
    (e) => e.status === 409,
  );
});
test("rate limiting and pending concurrent submissions do not send extra mail", async () => {
  const h = harness(),
    key = randomUUID();
  let release;
  const pending = new Promise((resolve) => (release = resolve));
  const first = acceptRequest(payload, {
    env,
    ...h,
    idempotencyKey: key,
    send: async () => {
      await pending;
      return "receipt";
    },
  });
  await new Promise((resolve) => setImmediate(resolve));
  await assert.rejects(
    acceptRequest(payload, { env, ...h, idempotencyKey: key }),
    (e) => e.status === 429 && e.code === "request_in_progress",
  );
  release();
  await first;
  for (let i = 0; i < 8; i++)
    await acceptRequest(payload, { env, ...h, idempotencyKey: key });
  await assert.rejects(
    acceptRequest(payload, { env, ...h, idempotencyKey: key }),
    (e) => e.status === 429 && e.retryAfter === 900,
  );
});
test("backend and email failure never fabricate success; retry retains real logical ID", async () => {
  const h = harness(),
    key = randomUUID();
  let id;
  await assert.rejects(
    acceptRequest(payload, {
      env,
      ...h,
      idempotencyKey: key,
      send: async (data, requestId) => {
        id = requestId;
        throw Error("provider unavailable");
      },
    }),
    (e) => e.status === 502,
  );
  const retried = await acceptRequest(payload, {
    env,
    ...h,
    idempotencyKey: key,
  });
  assert.equal(retried.request_id, id);
  await assert.rejects(
    acceptRequest(payload, {
      env,
      idempotencyKey: key,
      store: {
        rate: async () => {
          throw Error("storage offline");
        },
      },
    }),
    (e) => e.status === 503,
  );
  const another = harness();
  await assert.rejects(
    acceptRequest(payload, {
      env,
      ...another,
      idempotencyKey: key,
      store: { ...another.store, finish: async () => 0 },
    }),
    (e) => e.status === 503,
  );
});
test("honeypot, body size, enums, types, and invalid idempotency keys", async () => {
  for (const [value, status] of [
    [{ ...payload, website: "filled" }, 422],
    [{ ...payload, service_needed: "Unknown" }, 422],
    [{ ...payload, facility_size_sqft: "-1" }, 422],
    [{ ...payload, contact_name: {} }, 422],
    [{ ...payload, facility_details: "x".repeat(17000) }, 413],
  ]) {
    const h = harness();
    await assert.rejects(
      acceptRequest(value, { env, ...h, idempotencyKey: randomUUID() }),
      (e) => e.status === status,
    );
    assert.equal(h.sends, 0);
  }
  await assert.rejects(
    acceptRequest(payload, { env, ...harness(), idempotencyKey: "short" }),
    (e) => e.status === 400,
  );
});
test("native HTML POST preserves values/errors; valid signed submission redirects with receipt", async () => {
  const h = harness();
  const handle = htmlHandler({
    env,
    accept: (data, opts) =>
      acceptRequest(data, { ...opts, store: h.store, send: h.send }),
  });
  const get = res();
  await handle(req(undefined, { method: "GET" }), get);
  assert.match(get.body, /method="POST"/);
  const cookie = get.headers["set-cookie"][0].split(";")[0];
  const token = get.body.match(/name="form_token" value="([^"]+)"/)[1];
  const bad = res();
  await handle(
    req(
      { ...payload, work_email: "bad", form_token: token },
      {
        headers: {
          cookie,
          origin: "http://127.0.0.1:4174",
          "content-type": "application/x-www-form-urlencoded",
        },
      },
    ),
    bad,
  );
  assert.equal(bad.statusCode, 422);
  assert.match(bad.body, /value="Jordan Example"/);
  assert.match(bad.body, /aria-describedby="work_email-error"/);
  assert.match(bad.body, /value="bad"/);
  const good = res();
  const posted = req(
    { ...payload, form_token: token },
    {
      headers: {
        cookie,
        origin: "http://127.0.0.1:4174",
        "content-type": "application/x-www-form-urlencoded",
      },
    },
  );
  await handle(posted, good);
  assert.equal(good.statusCode, 303);
  assert.equal(good.headers.location, "/request-received/");
  assert.equal(good.body, "");
  const signed = good.headers["set-cookie"]
    .find((c) => c.startsWith("cw_receipt="))
    .split(";")[0]
    .slice("cw_receipt=".length);
  const receipt = verify(signed, env.INTAKE_SIGNING_KEY);
  assert.ok(receipt.request_id);
  assert.match(renderReceipt(receipt), /Walkthrough request received/);
  assert.match(renderReceipt(receipt), /data-receipt=/);
  const retry = res();
  await handle(posted, retry);
  assert.equal(retry.statusCode, 303);
  assert.equal(h.sends, 1);
});
test("native HTML cannot be submitted cross-site or with forged form token", async () => {
  const handle = htmlHandler({ env });
  const invalid = res();
  await handle(req({ ...payload, form_token: "forged" }), invalid);
  assert.equal(invalid.statusCode, 403);
  assert.match(invalid.body, /value="Jordan Example"/);
  const foreign = res();
  await handle(
    req(payload, {
      headers: {
        origin: "https://evil.example",
        "content-type": "application/x-www-form-urlencoded",
      },
    }),
    foreign,
  );
  assert.equal(foreign.statusCode, 403);
  assert.equal(
    verify(sign({ exp: 1 }, env.INTAKE_SIGNING_KEY), env.INTAKE_SIGNING_KEY),
    null,
  );
  assert.equal(verify("forged", env.INTAKE_SIGNING_KEY), null);
});
test("direct receipt visit stays neutral and cannot emit a conversion", () => {
  const html = renderReceipt();
  assert.doesNotMatch(html, /data-receipt=/);
  assert.doesNotMatch(html, />Walkthrough request received</);
  assert.match(html, /noindex, nofollow/);
});
test("JSON interface shares intake contract, stable failures, and actual generated reference", async () => {
  const h = harness(),
    handle = jsonHandler({
      env,
      accept: (data, opts) =>
        acceptRequest(data, { ...opts, store: h.store, send: h.send }),
    });
  const headers = {
    "content-type": "application/json",
    "idempotency-key": randomUUID(),
  };
  const result = res();
  await handle(req(payload, { headers }), result);
  assert.equal(result.statusCode, 201);
  assert.equal(JSON.parse(result.body).status, "received");
  assert.ok(JSON.parse(result.body).request_id);
  const invalid = res();
  await handle(req({ ...payload, work_email: "" }, { headers }), invalid);
  assert.equal(invalid.statusCode, 422);
  assert.ok(JSON.parse(invalid.body).field_errors.work_email);
  const extra = res();
  await handle(req({ ...payload, private: "not allowed" }, { headers }), extra);
  assert.equal(extra.statusCode, 422);
  assert.doesNotMatch(extra.body, /not allowed/);
  const foreign = res();
  await handle(
    req(payload, { headers: { ...headers, origin: "https://evil.example" } }),
    foreign,
  );
  assert.equal(foreign.statusCode, 403);
});
test("HTTP parser rejects malformed JSON, duplicate HTML fields, and unsupported content types", async () => {
  await assert.rejects(
    readBody(
      req("{bad", { headers: { "content-type": "application/json" } }),
      "application/json",
    ),
    (e) => e.status === 400,
  );
  await assert.rejects(
    readBody(req("company=a&company=b"), "application/x-www-form-urlencoded"),
    (e) => e.status === 400,
  );
  await assert.rejects(
    readBody(req(payload), "application/json"),
    (e) => e.status === 415,
  );
  await assert.rejects(
    readBody(
      req("x", {
        headers: {
          "content-type": "application/json",
          "content-length": "20000",
        },
      }),
      "application/json",
    ),
    (e) => e.status === 413,
  );
});
test("production adapters use fixed recipient, safe provider retries, POST Redis commands and no credential URL", async () => {
  let captured;
  const send = emailSender(env, async (url, options) => {
    captured = { url, options };
    return { ok: true, json: async () => ({ id: "provider-confirmed" }) };
  });
  const id = randomUUID();
  assert.equal(await send(payload, id), "provider-confirmed");
  const sent = JSON.parse(captured.options.body);
  assert.deepEqual(sent.to, [env.LEAD_TO_EMAIL]);
  assert.equal(sent.reply_to, payload.work_email);
  assert.equal(
    captured.options.headers["Idempotency-Key"],
    "cw-walkthrough/" + id,
  );
  await assert.rejects(
    emailSender(env, async () => ({ ok: false }))(payload, id),
    (e) => e.status === 502,
  );
  const store = redisStore(env, async (url, options) => {
    captured = { url, options };
    return { ok: true, json: async () => ({ result: 1 }) };
  });
  assert.equal(await store.rate("hashed-ip"), 1);
  assert.equal(captured.url, env.UPSTASH_REDIS_REST_URL);
  assert.equal(JSON.parse(captured.options.body)[0], "EVAL");
  assert.equal(captured.options.method, "POST");
});
test("OpenAPI and server fields stay aligned; only one public action is described", () => {
  const spec = openapi();
  assert.deepEqual(Object.keys(spec.paths), ["/api/v1/walkthrough-request"]);
  const schema = spec.components.schemas.WalkthroughRequest;
  assert.deepEqual(
    schema.required,
    Object.keys(fields).filter((k) => fields[k].required),
  );
  for (const [name, f] of Object.entries(fields)) {
    assert.equal(schema.properties[name].maxLength, f.max);
    if (f.options)
      assert.ok(
        f.options.every((v) => schema.properties[name].enum.includes(v)),
      );
  }
});

test("native walkthrough GET prefills only known services and preserves the API option value", async () => {
  for (const [query, expected] of [
    ["?service=commercial-cleaning", "Commercial Cleaning & Janitorial"],
    ["?service=hvac", "HVAC"],
    ["?service=unknown", null],
    ["?service=%3Cscript%3E", null],
    ["", null],
  ]) {
    const r = res();
    await htmlHandler({ env })(
      req(null, { method: "GET", url: "/request-walkthrough/" + query }),
      r,
    );
    assert.equal(r.statusCode, 200);
    const selected =
      r.body
        .match(/<option value="([^"]+)" selected>/)?.[1]
        ?.replaceAll("&amp;", "&") || null;
    assert.equal(selected, expected);
    assert.match(r.body, /Managed Janitorial Services \(commercial cleaning\)/);
    assert.ok(!r.body.includes("<script>"));
  }
});

test("unconfigured HTML is call-first with no form or editable fields; failed older submissions retain details safely", async () => {
  const r = res();
  await htmlHandler({ env: {} })(
    req(null, { method: "GET", url: "/request-walkthrough/?service=hvac" }),
    r,
  );
  assert.match(r.body, /Online requests are not available yet/);
  assert.match(r.body, /Service interest: <strong>HVAC/);
  assert.ok(!/<form|<input|<select|type="submit"/.test(r.body));
  const failed = res();
  await htmlHandler({ env: {} })(req(payload), failed);
  assert.equal(failed.statusCode, 503);
  assert.match(failed.body, /Your request has not been sent/);
  assert.match(failed.body, /Jordan Example/);
  assert.ok(!failed.body.includes("<form"));
});

test("configuration discovery reflects server configuration without exposing credentials", () => {
  for (const configuredEnv of [{}, env]) {
    let body;
    formConfig(
      {},
      {
        setHeader() {},
        end(value) {
          body = JSON.parse(value);
        },
      },
      { env: configuredEnv },
    );
    assert.equal(body.ready, configured(configuredEnv));
    assert.match(body.note, /separate verification/);
    assert.ok(!JSON.stringify(body).includes("test-only"));
  }
});
