addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

// I'm vibing as hard as I possibly can

const DUMP_URL = "https://hugesuccess.org/gcve/dumps/gna-1337.ndjson";

function getAhaDate(obj) {
  try {
    const pm = obj?.containers?.cna?.providerMetadata;
    if (pm?.shortName === "AHA" && pm?.dateUpdated) {
      const d = new Date(pm.dateUpdated);
      if (!isNaN(d.getTime())) return d;
    }
  } catch (e) {}
  return null;
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const params = url.searchParams;

  // Fetch and parse NDJSON once per request
  const ndjsonResp = await fetch(DUMP_URL);
  const text = await ndjsonResp.text();
  let objects = text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    })
    .filter((obj) => getAhaDate(obj) !== null);

  objects.sort((a, b) => getAhaDate(b) - getAhaDate(a));
  let result = [];

  // /api/vulnerability/recent
  if (pathname.startsWith("/api/vulnerability/recent")) {
    // Return vulnerabilities after a given date (default: last 24h)
    const sinceParam = params.get("since"); // ISO 8601 string or YYYY-MM-DD
    const limit = parseInt(params.get("limit") || "10", 10);

    let sinceDate;
    if (sinceParam) {
      const parsed = new Date(sinceParam);
      sinceDate = isNaN(parsed.getTime())
        ? new Date(Date.now() - 24 * 60 * 60 * 1000)
        : parsed;
    } else {
      sinceDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    result = objects.filter((obj) => getAhaDate(obj) >= sinceDate);
    result = result.slice(0, limit);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // /api/vulnerability/last
  if (pathname.startsWith("/api/vulnerability/last")) {
    // Return latest N vulnerabilities
    const limit = parseInt(params.get("limit") || "10", 10);
    result = objects.slice(0, limit);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // /dumps/gna-1337.ndjson
  if (pathname === "/dumps/gna-1337.ndjson") {
    // Serve the raw NDJSON dump
    return new Response(text, {
      headers: { "Content-Type": "application/x-ndjson" },
    });
  }

  // Wrong extension for the dumps
  if (pathname === "/dumps/gna-1337.json") {
    return new Response(
      JSON.stringify({
        error: "Dangit Bobby, use /dumps/gna-1337.ndjson instead",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "X-GCVE-AHA-Error": "Wrong filetype extension!",
        },
      },
    );
  }

  // Fallback
  return new Response(JSON.stringify({ error: "Dangit Bobby!" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
