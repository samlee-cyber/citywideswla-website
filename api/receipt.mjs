import { commonHeaders, html, cookies, verify } from "../lib/http.mjs";
import { renderReceipt } from "../lib/form.mjs";
export default function handler(req, res) {
  commonHeaders(res);
  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return html(res, 405, renderReceipt());
  }
  const receipt = verify(
    cookies(req).cw_receipt,
    process.env.INTAKE_SIGNING_KEY,
  );
  const valid =
    receipt && /^[a-f0-9-]{36}$/.test(receipt.request_id || "")
      ? receipt
      : null;
  return html(res, 200, req.method === "HEAD" ? "" : renderReceipt(valid));
}
