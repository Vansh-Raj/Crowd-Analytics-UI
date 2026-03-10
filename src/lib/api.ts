const BASE_URL: string = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL ?? '/api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Network error: unable to reach auth service');
  }
  if (!res.ok) {
    let message = 'Registration failed';
    try {
      const data = await res.json() as Partial<ApiError>;
      if (data?.message) message = data.message;
    } catch { /* ignore parse error */ }
    throw new Error(message);
  }
}

export async function loginUser(payload: LoginPayload): Promise<{ token: string }> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Network error: unable to reach auth service');
  }
  if (!res.ok) {
    let message = 'Login failed';
    try {
      const data = await res.json() as Partial<ApiError>;
      if (data?.message) message = data.message;
    } catch { /* ignore parse error */ }
    throw new Error(message);
  }
  const data = await res.json() as { token?: unknown };
  if (!data?.token || typeof data.token !== 'string') {
    throw new Error('Invalid response');
  }
  return { token: data.token };
}
