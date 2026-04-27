export default async function handler(req, res) {
  // Allow preflight requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 'endpoint' is passed by the rewrite rule in vercel.json, e.g. "competitions/PL/standings"
  const endpoint = req.query.endpoint || '';

  // Forward any other query params (status, limit, etc.)
  const url = new URL(req.url, 'http://localhost');
  url.searchParams.delete('endpoint');
  const search = url.search;

  const apiUrl = `https://api.football-data.org/v4/${endpoint}${search}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Auth-Token': process.env.VITE_API_KEY,
      },
    });

    const data = await response.json();

    res.setHeader('Content-Type', 'application/json');
    // Cache at Vercel's CDN edge for 1 hour, stale-while-revalidate for 1 day
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch from football-data.org' });
  }
}
