export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      ready: false,
      siteKey: null,
      form_url: "/request-walkthrough/",
    }),
  );
}
