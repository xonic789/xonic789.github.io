import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

const ORIGIN = 'https://xonic789.github.io';

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function view(path, { method = 'POST', origin = ORIGIN, userAgent = BROWSER_UA } = {}) {
  const headers = { Origin: origin, 'User-Agent': userAgent };

  if (method === 'GET') {
    return SELF.fetch(`https://counter.test/views?path=${encodeURIComponent(path)}`, { headers });
  }

  return SELF.fetch('https://counter.test/views', {
    method,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
}

describe('POST /views', () => {
  it('increments the count for a post', async () => {
    const first = await view('/posts/increments/');
    const second = await view('/posts/increments/');

    expect(first.status).toBe(200);
    await expect(first.json()).resolves.toEqual({ path: '/posts/increments', count: 1 });
    await expect(second.json()).resolves.toEqual({ path: '/posts/increments', count: 2 });
  });

  it('counts the encoded and decoded form of a Korean slug as one page', async () => {
    await view('/posts/한글-슬러그/');
    const response = await view(`/posts/${encodeURIComponent('한글-슬러그')}/`);

    await expect(response.json()).resolves.toEqual({ path: '/posts/한글-슬러그', count: 2 });
  });

  it('does not increment for bots, but still returns the real count', async () => {
    await view('/posts/bot-visit/');
    const response = await view('/posts/bot-visit/', { userAgent: 'Googlebot/2.1' });

    await expect(response.json()).resolves.toEqual({ path: '/posts/bot-visit', count: 1 });
  });

  it('rejects a path outside the configured prefix', async () => {
    const response = await view('/about/');

    expect(response.status).toBe(400);
  });

  it('rejects a request from an origin that is not allowlisted', async () => {
    const response = await view('/posts/whatever/', { origin: 'https://evil.example' });

    expect(response.status).toBe(403);
  });

  it('rejects a body that is not JSON', async () => {
    const response = await SELF.fetch('https://counter.test/views', {
      method: 'POST',
      headers: { Origin: ORIGIN, 'Content-Type': 'text/plain' },
      body: '/posts/sneaky'
    });

    expect(response.status).toBe(400);
  });
});

describe('GET /views', () => {
  it('reads without incrementing', async () => {
    await view('/posts/read-only/');

    const first = await view('/posts/read-only/', { method: 'GET' });
    const second = await view('/posts/read-only/', { method: 'GET' });

    await expect(first.json()).resolves.toEqual({ path: '/posts/read-only', count: 1 });
    await expect(second.json()).resolves.toEqual({ path: '/posts/read-only', count: 1 });
  });

  it('returns 0 for a page nobody has visited', async () => {
    const response = await view('/posts/never-visited/', { method: 'GET' });

    await expect(response.json()).resolves.toEqual({ path: '/posts/never-visited', count: 0 });
  });
});

describe('routing', () => {
  it('answers a CORS preflight', async () => {
    const response = await SELF.fetch('https://counter.test/views', {
      method: 'OPTIONS',
      headers: { Origin: ORIGIN }
    });

    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);
  });

  it('404s on an unknown route', async () => {
    const response = await SELF.fetch('https://counter.test/nope', { headers: { Origin: ORIGIN } });

    expect(response.status).toBe(404);
  });

  it('405s on an unsupported method', async () => {
    const response = await SELF.fetch('https://counter.test/views', {
      method: 'DELETE',
      headers: { Origin: ORIGIN }
    });

    expect(response.status).toBe(405);
  });
});
