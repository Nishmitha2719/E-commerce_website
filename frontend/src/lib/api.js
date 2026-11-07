// Central place for the backend URL. Override with REACT_APP_API_URL in a .env file.
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Tiny in-memory cache so sections that ask for the same list (home page,
// category pages, coming back to a page) don't hit the server again during a visit.
const cache = new Map();

export function getJSON(path, { fresh = false } = {}) {
  if (!fresh && cache.has(path)) return cache.get(path);
  const p = fetch(API_BASE + path)
    .then((res) => {
      if (!res.ok) throw new Error(`${path} failed with ${res.status}`);
      return res.json();
    })
    .catch((err) => {
      cache.delete(path); // allow a retry next time
      throw err;
    });
  cache.set(path, p);
  return p;
}

export function clearApiCache() {
  cache.clear();
}
