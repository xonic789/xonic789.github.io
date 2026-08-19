/**
 * Pure helpers for the pageview counter.
 * Kept free of Workers runtime bindings so they can be unit-tested directly.
 */

const MAX_PATH_LENGTH = 300;

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

const BOT_PATTERN =
  /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|preview|headless|monitor|curl|wget|python-requests/i;

/**
 * Normalizes a request path into the canonical key used as the D1 primary key.
 * Returns null when the path is unusable, which the caller treats as a 400.
 *
 * Canonical form: percent-decoded, leading slash, no trailing slash.
 * Browsers report `location.pathname` percent-encoded for non-ASCII slugs,
 * so decoding here keeps `/posts/한글` and `/posts/%ED%95%9C%EA%B8%80`
 * from becoming two separate rows.
 */
export function normalizePath(raw) {
  if (typeof raw !== 'string') {
    return null;
  }

  const trimmed = raw.trim();

  if (trimmed === '' || trimmed.length > MAX_PATH_LENGTH) {
    return null;
  }

  let decoded;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return null;
  }

  if (!decoded.startsWith('/')) {
    return null;
  }

  if (decoded.includes('..') || decoded.includes('\\') || CONTROL_CHARS.test(decoded)) {
    return null;
  }

  const withoutTrailingSlash = decoded.replace(/\/+$/, '');

  return withoutTrailingSlash === '' ? '/' : withoutTrailingSlash;
}

/**
 * Only paths under the configured prefix are counted, so a hostile client
 * cannot fill the table with arbitrary keys.
 */
export function isCountablePath(path, prefix) {
  if (path === null) {
    return false;
  }

  if (!prefix) {
    return true;
  }

  const normalizedPrefix = prefix.replace(/\/+$/, '');

  return path === normalizedPrefix || path.startsWith(`${normalizedPrefix}/`);
}

export function isBotUserAgent(userAgent) {
  return typeof userAgent === 'string' && BOT_PATTERN.test(userAgent);
}

export function parseAllowedOrigins(raw) {
  if (typeof raw !== 'string') {
    return [];
  }

  return raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter((origin) => origin !== '');
}

/**
 * Returns the CORS headers for this request, or null when the origin is present
 * but not allowed. A missing Origin header (curl, same-origin) needs no CORS
 * headers and is not rejected here.
 */
export function corsHeadersFor(origin, allowedOrigins) {
  if (!origin) {
    return {};
  }

  if (!allowedOrigins.includes(origin.replace(/\/+$/, ''))) {
    return null;
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}
