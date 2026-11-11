// API address: public/config.js (editable after build) wins, then VITE_API_URL at build time, else same origin.
const RUNTIME = (typeof window !== 'undefined' && window.APP_CONFIG) || {};
const BASE = (RUNTIME.API_URL || import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/** Socket.IO URL: undefined = same origin (dev proxy / same-domain deploy). */
export const SOCKET_URL = BASE || undefined;

export async function api(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No internet connection. Please check your network and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Please try again.');
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  return data;
}
