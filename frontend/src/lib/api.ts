export type User = { id: number; email: string; admin: boolean };
const BASE = import.meta.env.VITE_API_BASE ?? '';
async function req(path: string, opts: RequestInit = {}) {
  const r = await fetch(BASE + path, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(opts.headers||{}) }, ...opts });
  const text = await r.text();
  let data: any; try { data = JSON.parse(text); } catch { data = text; }
  if (!r.ok) throw new Error(typeof data === 'string' ? data : (data?.message?.join?.(', ') || data?.message || `HTTP ${r.status}`));
  return data;
}
export const api = {
  whoami: () => req('/auth/whoami'),
  signup: (email: string, password: string) => req('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signin: (email: string, password: string) => req('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signout: () => req('/auth/signout', { method: 'POST' }),
  createReport: (b: any) => req('/reports', { method: 'POST', body: JSON.stringify(b) }),
  approveReport: (id: number, approved: boolean) => req(`/reports/${id}`, { method: 'PATCH', body: JSON.stringify({ approved }) }),
  estimate: (q: Record<string, string|number>) => req('/reports?' + new URLSearchParams(q as any)),
};
