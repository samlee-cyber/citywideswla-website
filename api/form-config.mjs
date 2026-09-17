import { configured } from "../lib/intake.mjs";
export default function handler(req, res, { env = process.env } = {}) {
  res.statusCode = 200;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      ready: configured(env),
      note: "Configuration status only; end-to-end delivery requires separate verification.",
      siteKey: null,
      form_url: "/request-walkthrough/",
    }),
  );
}
