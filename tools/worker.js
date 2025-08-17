addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

// I'm vibing as hard as I possibly can.

const DUMP_URL = "https://hugesuccess.org/gcve/dumps/gna-1337.ndjson";

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const params = url.searchParams;

  // Fetch and parse NDJSON once per request
  const ndjsonResp = await fetch(DUMP_URL);
  const text = await ndjsonResp.text();
  const objects = text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));

  let result = [];

  if (pathname.startsWith("/api/vulnerability/recent")) {
    // Return vulnerabilities after a given date
    const sinceDate = params.get("since"); // ISO 8601 string or YYYY-MM-DD
    const limit = parseInt(params.get("limit") || "10", 10);

    result = objects.filter((obj) => {
      if (!sinceDate) return true;
      return new Date(obj.datePublic) >= new Date(sinceDate);
    });

    result = result.slice(0, limit);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.startsWith("/api/vulnerability/last")) {
    // Return latest N vulnerabilities
    const limit = parseInt(params.get("limit") || "10", 10);
    result = objects.slice(-limit);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname === "/dumps/gna-1337.ndjson") {
    // Serve the raw NDJSON dump
    return new Response(text, {
      headers: { "Content-Type": "application/x-ndjson" },
    });
  }

  // Fallback for unknown routes
  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
