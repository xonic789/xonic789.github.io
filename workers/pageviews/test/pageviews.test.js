import { describe, expect, it } from 'vitest';

import { corsHeadersFor, isBotUserAgent, isCountablePath, normalizePath } from '../src/pageviews.js';

describe('normalizePath', () => {
  it('strips trailing slashes so /posts/a and /posts/a/ share one row', () => {
    expect(normalizePath('/posts/a/')).toBe('/posts/a');
    expect(normalizePath('/posts/a')).toBe('/posts/a');
    expect(normalizePath('/posts/a///')).toBe('/posts/a');
  });

  it('decodes percent-encoded Korean slugs to the same key as the raw form', () => {
    const encoded = '/posts/%ED%95%9C%EA%B8%80/';

    expect(normalizePath(encoded)).toBe('/posts/한글');
    expect(normalizePath(encoded)).toBe(normalizePath('/posts/한글/'));
  });

  it('keeps the root path as /', () => {
    expect(normalizePath('/')).toBe('/');
  });

  it('rejects unusable input', () => {
    expect(normalizePath(undefined)).toBeNull();
    expect(normalizePath('')).toBeNull();
    expect(normalizePath('posts/a')).toBeNull();
    expect(normalizePath('/posts/../secret')).toBeNull();
    expect(normalizePath('/posts/a\\b')).toBeNull();
    expect(normalizePath('%E0%A4%A')).toBeNull();
    expect(normalizePath(`/posts/${'a'.repeat(400)}`)).toBeNull();
  });
});

describe('isCountablePath', () => {
  it('accepts paths under the prefix', () => {
    expect(isCountablePath('/posts/a', '/posts')).toBe(true);
    expect(isCountablePath('/posts', '/posts/')).toBe(true);
  });

  it('rejects paths outside the prefix, including prefix look-alikes', () => {
    expect(isCountablePath('/about', '/posts')).toBe(false);
    expect(isCountablePath('/postsfake/a', '/posts')).toBe(false);
    expect(isCountablePath(null, '/posts')).toBe(false);
  });

  it('accepts anything when no prefix is configured', () => {
    expect(isCountablePath('/about', undefined)).toBe(true);
  });
});

describe('isBotUserAgent', () => {
  it('flags common crawlers', () => {
    expect(isBotUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true);
    expect(isBotUserAgent('curl/8.4.0')).toBe(true);
  });

  it('leaves real browsers alone', () => {
    expect(
      isBotUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
      )
    ).toBe(false);
    expect(isBotUserAgent(null)).toBe(false);
  });
});

describe('corsHeadersFor', () => {
  const allowed = ['https://xonic789.github.io'];

  it('echoes an allowed origin', () => {
    expect(corsHeadersFor('https://xonic789.github.io', allowed)).toMatchObject({
      'Access-Control-Allow-Origin': 'https://xonic789.github.io',
      Vary: 'Origin'
    });
  });

  it('returns null for a disallowed origin', () => {
    expect(corsHeadersFor('https://evil.example', allowed)).toBeNull();
  });

  it('returns no headers when there is no Origin at all', () => {
    expect(corsHeadersFor(null, allowed)).toEqual({});
  });
});
