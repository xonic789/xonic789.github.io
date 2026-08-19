import {
  corsHeadersFor,
  isBotUserAgent,
  isCountablePath,
  normalizePath,
  parseAllowedOrigins
} from './pageviews.js';

/**
 * Pageview counter for the blog.
 *
 * GET  /views?path=/posts/foo   -> read the current count, no write
 * POST /views  {"path": "..."}  -> increment, then return the new count
 *
 * The read endpoint is intentionally public and unauthenticated: the blog is a
 * static site, so the browser has to be able to ask for the number itself.
 * Writes are constrained by the CORS origin allowlist, the path prefix, and a
 * user-agent bot filter rather than by a secret.
 */

function jsonResponse(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers
    }
  });
}

async function readCount(db, path) {
  const row = await db.prepare('SELECT count FROM pageviews WHERE path = ?1').bind(path).first();

  return row === null ? 0 : row.count;
}

async function incrementCount(db, path) {
  const row = await db
    .prepare(
      `INSERT INTO pageviews (path, count, updated_at)
       VALUES (?1, 1, ?2)
       ON CONFLICT(path) DO UPDATE SET count = count + 1, updated_at = ?2
       RETURNING count`
    )
    .bind(path, new Date().toISOString())
    .first();

  return row.count;
}

async function resolveRequestedPath(request) {
  if (request.method === 'GET') {
    return new URL(request.url).searchParams.get('path');
  }

  const contentType = request.headers.get('Content-Type') ?? '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    const body = await request.json();
    return typeof body?.path === 'string' ? body.path : null;
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    const cors = corsHeadersFor(request.headers.get('Origin'), allowedOrigins);

    if (cors === null) {
      return jsonResponse({ error: 'origin not allowed' }, { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname !== '/views') {
      return jsonResponse({ error: 'not found' }, { status: 404, headers: cors });
    }

    if (request.method !== 'GET' && request.method !== 'POST') {
      return jsonResponse(
        { error: 'method not allowed' },
        { status: 405, headers: { ...cors, Allow: 'GET, POST, OPTIONS' } }
      );
    }

    const path = normalizePath(await resolveRequestedPath(request));

    if (!isCountablePath(path, env.PATH_PREFIX)) {
      return jsonResponse({ error: 'invalid path' }, { status: 400, headers: cors });
    }

    // Bots still get a real number back; they just do not inflate it.
    const shouldIncrement =
      request.method === 'POST' && !isBotUserAgent(request.headers.get('User-Agent'));

    const count = shouldIncrement
      ? await incrementCount(env.DB, path)
      : await readCount(env.DB, path);

    return jsonResponse({ path, count }, { headers: cors });
  }
};
