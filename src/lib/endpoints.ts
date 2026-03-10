function ensureLeadingSlash(s: string) {
  return s.startsWith('/') ? s : `/${s}`;
}

export function httpBase() {
  const base = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL ?? '/api';
  return base;
}

export function buildUrl(path: string) {
  return `${httpBase()}${ensureLeadingSlash(path)}`;
}

export function buildWs(path: string) {
  const envWs = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_WS_BASE_URL;
  const wsOrigin = location.origin.replace('http', 'ws');
  if (typeof envWs === 'string' && envWs.startsWith('ws')) {
    return `${envWs}${ensureLeadingSlash(path)}`;
  }
  const base = typeof envWs === 'string' ? envWs : '/ws';
  return `${wsOrigin}${ensureLeadingSlash(base)}${ensureLeadingSlash(path)}`;
}
