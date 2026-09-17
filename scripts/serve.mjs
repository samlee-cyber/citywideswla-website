import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { pages } from "../content/pages.mjs";
import walkthrough from "../api/walkthrough.mjs";
import receipt from "../api/receipt.mjs";
import api from "../api/v1/walkthrough-request.mjs";
import legacy from "../api/lead.mjs";
import formConfig from "../api/form-config.mjs";
import { redirects } from "../lib/redirects.mjs";
const root = resolve("dist"),
  routes = new Set(pages.map((p) => p.slug));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".json": "application/json",
  ".txt": "text/plain",
};
createServer(async (req, res) => {
  try {
    if (new URL(req.url, "http://localhost").searchParams.has("nojs"))
      res.setHeader("Content-Security-Policy", "script-src 'none'");
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const indexRoute = pathname.endsWith("/index.html")
      ? pathname.slice(0, -10)
      : null;
    const redirect =
      redirects.find((r) => r.source === pathname) ||
      (routes.has(indexRoute) ? { destination: indexRoute } : null);
    if (redirect) {
      res.writeHead(301, { Location: redirect.destination });
      res.end();
      return;
    }
    if (!pathname.endsWith("/") && routes.has(pathname + "/")) {
      res.writeHead(301, { Location: pathname + "/" });
      res.end();
      return;
    }
    const handlers = {
      "/request-walkthrough/": walkthrough,
      "/request-received/": receipt,
      "/api/walkthrough": walkthrough,
      "/api/receipt": receipt,
      "/api/v1/walkthrough-request": api,
      "/api/lead": legacy,
      "/api/form-config": formConfig,
    };
    if (handlers[pathname]) return await handlers[pathname](req, res);
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end();
      return;
    }
    const file = resolve(
      root,
      "." + (pathname.endsWith("/") ? pathname + "index.html" : pathname),
    );
    if (!file.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let content;
    try {
      content = await readFile(file);
    } catch {
      res.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex",
      });
      res.end(
        req.method === "HEAD" ? "" : await readFile(resolve(root, "404.html")),
      );
      return;
    }
    // Opt-in local lab instrumentation, never included in the deployment output.
    if (
      extname(file) === ".html" &&
      new URL(req.url, "http://localhost").searchParams.has("lab")
    ) {
      content = content.toString().replace(
        "</body>",
        `<output id="lab-metrics" style="position:fixed;top:0;right:0;z-index:999;background:white;color:black;font:12px monospace;padding:8px"></output><script>
        const lab = { viewport: innerWidth, lcp: null, cls: 0, inp: null };
        try { new PerformanceObserver(list => { for(const e of list.getEntries()) lab.lcp=e.startTime; }).observe({type:'largest-contentful-paint',buffered:true}); } catch {}
        try { new PerformanceObserver(list => { for(const e of list.getEntries()) if(!e.hadRecentInput) lab.cls+=e.value; }).observe({type:'layout-shift',buffered:true}); } catch {}
        try { new PerformanceObserver(list => { for(const e of list.getEntries()) if(e.interactionId) lab.inp=Math.max(lab.inp||0,e.duration); }).observe({type:'event',buffered:true,durationThreshold:16}); } catch {}
        setInterval(() => { const n=performance.getEntriesByType('navigation')[0]; document.getElementById('lab-metrics').textContent=JSON.stringify({...lab,ttfb:n?.responseStart-n?.requestStart,load:n?.loadEventEnd}); },500);
      </script></body>`,
      );
    }
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? "" : content);
  } catch {
    res.writeHead(400);
    res.end("Bad request");
  }
}).listen(4174, "127.0.0.1", () =>
  console.log("City Wide preview: http://127.0.0.1:4174"),
);
