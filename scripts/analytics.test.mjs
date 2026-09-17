import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
const script = await readFile(
  new URL("../public/site.js", import.meta.url),
  "utf8",
);
function browser({
  consent = false,
  receipt = "",
  error = false,
  form = false,
} = {}) {
  const listeners = {},
    events = {},
    storage = new Map();
  const window = {
    cityWideAnalyticsConsent: consent,
    addEventListener: (name, fn) => (listeners[name] = fn),
  };
  const menu = {
    open: true,
    addEventListener() {},
    querySelector() {
      return { focus() {} };
    },
  };
  const formElement = { addEventListener: (name, fn) => (events[name] = fn) };
  const document = {
    body: {
      dataset: { page: "/request-received/", ...(receipt ? { receipt } : {}) },
    },
    querySelector: (s) =>
      s === ".navigation"
        ? menu
        : s === "#walkthrough-form" && form
          ? formElement
          : s === ".error-summary" && error
            ? { focus() {} }
            : null,
    querySelectorAll: () => [],
    addEventListener: (name, fn) => (events[name] = fn),
  };
  const sessionStorage = {
    getItem: (k) => storage.get(k),
    setItem: (k, v) => storage.set(k, v),
  };
  runInNewContext(script, {
    window,
    document,
    sessionStorage,
    matchMedia: () => ({ matches: true, addEventListener() {} }),
  });
  return { window, listeners, events, storage };
}
test("analytics never activates without explicit consent", () => {
  const b = browser({
    receipt: "real-test-reference",
    error: true,
    form: true,
  });
  assert.equal(b.window.dataLayer, undefined);
  b.events.focusin();
  assert.equal(b.window.dataLayer, undefined);
});
test("receipt conversion requires a server receipt, deduplicates, and excludes identifiers", () => {
  const b = browser({ consent: true, receipt: "real-test-reference" });
  assert.equal(b.window.dataLayer.length, 1);
  assert.equal(b.window.dataLayer[0].event, "walkthrough_form_submit_success");
  b.listeners["citywide:analytics-consent"]();
  assert.equal(b.window.dataLayer.length, 1);
  assert.deepEqual(Object.keys(b.window.dataLayer[0]).sort(), [
    "event",
    "page_path",
  ]);
  assert.ok(
    !JSON.stringify(b.window.dataLayer).includes("real-test-reference"),
  );
  assert.equal(browser({ consent: true }).window.dataLayer, undefined);
});
test("form and contact events contain page context only and stop after consent withdrawal", () => {
  const b = browser({ consent: true, form: true, error: true });
  b.events.focusin();
  b.events.click({
    target: { closest: () => ({ getAttribute: () => "tel:+15555550100" }) },
  });
  assert.deepEqual(
    Array.from(b.window.dataLayer, (e) => e.event),
    [
      "walkthrough_form_view",
      "walkthrough_form_submit_error",
      "walkthrough_form_start",
      "phone_click",
    ],
  );
  assert.ok(!JSON.stringify(b.window.dataLayer).includes("555"));
  b.window.cityWideAnalyticsConsent = false;
  b.events.focusin();
  assert.equal(b.window.dataLayer.length, 4);
});

test("service interest uses approved categories only and measurement errors do not break actions", () => {
  const b = browser({ consent: true });
  const sent = [];
  b.window.cityWideAnalyticsSend = (payload) => sent.push(payload);
  const click = (href) =>
    b.events.click({
      target: {
        closest: () => ({
          getAttribute: () => href,
          dataset: { event: "service_cta_click" },
        }),
      },
    });
  click("/request-walkthrough/?service=carpet-care");
  assert.equal(sent[0].service_interest, "carpet-care");
  click("/request-walkthrough/?service=private-email@example.com");
  assert.equal(sent[1].service_interest, undefined);
  assert.ok(!JSON.stringify(sent).includes("private-email"));
  b.window.cityWideAnalyticsSend = () => {
    throw new Error("vendor unavailable");
  };
  assert.doesNotThrow(() => click("/services/commercial-cleaning/"));
  b.window.cityWideAnalyticsConsent = false;
  click("/services/carpet-care/");
  assert.equal(b.window.dataLayer.length, 3);
});
