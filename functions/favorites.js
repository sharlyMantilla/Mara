// Netlify Function: favorites (global counter per product id)
// Methods:
// - GET  /.netlify/functions/favorites?id=<id>   -> { id, count }
// - POST /.netlify/functions/favorites?id=<id>   -> increments and returns { id, count }
// Storage: Upstash Redis REST (recommended). Set env vars:
//   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
// If not configured, returns 501 so frontend falls back to local-only.

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Content-Type': 'application/json; charset=utf-8',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: HEADERS, body: '' };
  }
  const id = (event.queryStringParameters && event.queryStringParameters.id) || '';
  if (!id) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'missing id' }) };
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return { statusCode: 501, headers: HEADERS, body: JSON.stringify({ error: 'storage not configured', id, count: null }) };
  }

  const key = `mara:fav:${id}`;

  async function upstash(path, opts = {}) {
    const res = await fetch(`${url}${path}`, {
      ...opts,
      headers: { ...(opts.headers || {}), Authorization: `Bearer ${token}` },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `Upstash error: ${res.status}`);
    return json;
  }

  try {
    if (event.httpMethod === 'GET') {
      const j = await upstash(`/get/${encodeURIComponent(key)}`);
      const n = j && typeof j.result !== 'undefined' ? parseInt(j.result, 10) || 0 : 0;
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ id, count: n }) };
    }
    if (event.httpMethod === 'POST') {
      const j = await upstash(`/incr/${encodeURIComponent(key)}`);
      const n = j && typeof j.result !== 'undefined' ? parseInt(j.result, 10) || 0 : 0;
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ id, count: n }) };
    }
    if (event.httpMethod === 'DELETE') {
      const j = await upstash(`/decr/${encodeURIComponent(key)}`);
      let n = j && typeof j.result !== 'undefined' ? parseInt(j.result, 10) || 0 : 0;
      if (n < 0) {
        await upstash(`/set/${encodeURIComponent(key)}/${encodeURIComponent('0')}`);
        n = 0;
      }
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ id, count: n }) };
    }
    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'method not allowed' }) };
  } catch (err) {
    return { statusCode: 502, headers: HEADERS, body: JSON.stringify({ error: String(err && err.message || err), id, count: null }) };
  }
};
