import { configured, acceptRequest } from "../lib/intake.mjs";
import { productionReady } from "../lib/publication.mjs";
import { fields } from "../lib/fields.mjs";
import {
  commonHeaders,
  html,
  readBody,
  freshForm,
  checkOrigin,
  checkFormToken,
  clientIp,
  failure,
  sign,
  setCookie,
} from "../lib/http.mjs";
import { renderForm } from "../lib/form.mjs";
export function createHandler({
  env = process.env,
  accept = acceptRequest,
} = {}) {
  return async (req, res) => {
    commonHeaders(res);
    if (req.method === "GET" || req.method === "HEAD") {
      const token = freshForm(req, res, env);
      if (
        new URL(req.url, "https://local").pathname ===
          "/request-walkthrough/" &&
        productionReady(env)
      )
        res.setHeader("X-Robots-Tag", "index, follow");
      return html(
        res,
        200,
        req.method === "HEAD"
          ? ""
          : renderForm({ token, available: configured(env) }),
      );
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, HEAD, POST");
      return html(
        res,
        405,
        renderForm({
          message: "Use the walkthrough form to submit a request.",
          code: 405,
        }),
      );
    }
    let body = {};
    try {
      body = await readBody(req, "application/x-www-form-urlencoded");
      checkOrigin(req, { required: true, env });
      // Missing delivery setup must produce a truthful 503, not an expired-form loop.
      const key = configured(env)
        ? checkFormToken(req, body.form_token, env)
        : undefined;
      const result = await accept(body, {
        idempotencyKey: key,
        ip: clientIp(req, env),
        env,
      });
      setCookie(
        res,
        "cw_receipt",
        sign(
          {
            request_id: result.request_id,
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
          env.INTAKE_SIGNING_KEY,
        ),
        3600,
        env,
      );
      res.statusCode = 303;
      res.setHeader("Location", "/request-received/");
      res.end();
    } catch (error) {
      const err = failure(error);
      if (err.retryAfter) res.setHeader("Retry-After", String(err.retryAfter));
      const values = Object.fromEntries(
        Object.keys(fields).map((k) => [
          k,
          typeof body[k] === "string" ? body[k].slice(0, fields[k].max) : "",
        ]),
      );
      // Keep the original valid token to make delivery retries use the same request key.
      let token;
      try {
        checkFormToken(req, body.form_token, env);
        token = body.form_token;
      } catch {
        token = freshForm(req, res, env);
      }
      return html(
        res,
        err.status,
        renderForm({
          values,
          errors: err.fields,
          message: err.message,
          token,
          available: configured(env),
          code: err.status,
        }),
      );
    }
  };
}
export default createHandler();
