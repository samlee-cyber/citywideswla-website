// Retire the original JSON-only action explicitly; old cached clients must not see false success.
export default function handler(req, res) {
  res.statusCode = 410;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Robots-Tag", "noindex");
  res.end(
    JSON.stringify({
      status: "error",
      code: "form_updated",
      error:
        "The walkthrough form has moved. Please open /request-walkthrough/ and submit your request there.",
    }),
  );
}
