const NEWSAPI_URL = "https://newsapi.org/v2/top-headlines";

function sanitize(str: string) {
  return String(str || "").replace(/[\n\r\t]+/g, " ").slice(0, 500);
}

export default async function handler(req: any, res: any) {
  try {
    const raw = (process.env.NEWSAPI_KEYS || process.env.NEWSAPI_KEY || '').trim();
    const keys = raw ? raw.split(/[\s,]+/).map((k) => k.trim()).filter(Boolean) : [];
    const { q = "fitness", category = "health", language = "en", pageSize = "12", page = "1", country = "", sources = "" } = req.query as any;

    if (!keys.length) {
      // Graceful degradation: when no API key is configured, return an empty
      // list with 200 OK so the UI can render without surfacing a 503.
      return res.status(200).json({
        ok: true,
        message: "News service disabled (no API key configured)",
        totalResults: 0,
        articles: [],
      });
    }

    const baseParams = new URLSearchParams({
      language: String(language),
      pageSize: String(pageSize),
      page: String(page),
    });
    if (q) baseParams.set("q", String(q));
    if (sources) {
      // When sources are specified, do not include country or category to comply with API constraints
      baseParams.set("sources", String(sources));
    } else {
      if (country) {
        baseParams.set("country", String(country));
      } else {
        baseParams.set("category", String(category));
      }
    }

    let result: any = null;
    let lastResp: Response | null = null;
    for (const key of keys) {
      const params = new URLSearchParams(baseParams);
      params.set("apiKey", key);
      const url = `${NEWSAPI_URL}?${params.toString()}`;
      const resp = await fetch(url);
      lastResp = resp;
      const data = await resp.json().catch(() => null);
      const msg = (data as any)?.message || '';
      if (resp.ok && data) { result = data; break; }
      if (resp.status === 429 || /exceeded|rate|limit/i.test(msg)) { continue; }
      result = data; break;
    }

    if (!result || !lastResp?.ok) {
      const status = lastResp?.status || 500;
      return res.status(status).json({ ok: false, message: sanitize((result as any)?.message || "NewsAPI error"), articles: [] });
    }

    const articles = Array.isArray(result?.articles) ? result.articles.map((a: any) => ({
      title: sanitize(a.title),
      description: sanitize(a.description || a.content || ""),
      url: String(a.url || ""),
      urlToImage: String(a.urlToImage || ""),
      source: sanitize(a?.source?.name || "Unknown"),
      publishedAt: String(a.publishedAt || ""),
    })) : [];

    return res.status(200).json({ ok: true, totalResults: result.totalResults || articles.length, articles });
  } catch (err: any) {
    return res.status(500).json({ ok: false, message: "Unexpected error fetching news" });
  }
}