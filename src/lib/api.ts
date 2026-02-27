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
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let message = 'Registration failed';
      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch { void 0; }
      throw new Error(message);
    }
  } catch {
    throw new Error('Network error: unable to reach auth service');
  }
}

export async function loginUser(payload: LoginPayload): Promise<{ token: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let message = 'Login failed';
      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch { void 0; }
      throw new Error(message);
    }
    const data = await res.json();
    if (!data?.token || typeof data.token !== 'string') {
      throw new Error('Invalid response');
    }
    return { token: data.token };
  } catch {
    throw new Error('Network error: unable to reach auth service');
  }
}
