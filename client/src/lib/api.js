import { useEffect, useState } from 'react';

const TOKEN_KEY = 'aionion.token';
export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
export const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* storage blocked */ } };

async function request(method, url, body) {
  if (import.meta.env.VITE_PREVIEW_ONLY === 'true') {
    const { previewRequest } = await import('./previewApi.js');
    return previewRequest(method, url, body);
  }
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const tok = getToken();
  if (tok) headers.Authorization = `Bearer ${tok}`;
  const res = await fetch(`/api${url}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body || {}),
  put: (url, body) => request('PUT', url, body),
  patch: (url, body) => request('PATCH', url, body)
};

/** Fetch `url` whenever it changes. Pass null to skip. `reload()` refetches. */
export function useApi(url) {
  const [state, setState] = useState({ data: null, error: null, loading: !!url });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    api.get(url)
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((error) => alive && setState({ data: null, error, loading: false }));
    return () => { alive = false; };
  }, [url, n]);
  return { ...state, reload: () => setN((x) => x + 1) };
}

/** Download an authenticated file (CSV etc.). */
export async function download(url, filename) {
  if (import.meta.env.VITE_PREVIEW_ONLY === 'true') throw new Error('Report downloads are disabled in this visual preview.');
  const res = await fetch(`/api${url}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
