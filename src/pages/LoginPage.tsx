import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser, setToken } from '../lib/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ||
    '/home';

  useEffect(() => {
    const state = location.state as { email?: string } | null;
    if (state?.email) setEmail(state.email);
  }, [location.state]);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;
    setLoading(true);
    try {
      const { token } = await loginUser({ email: email.trim(), password });
      setToken(token);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = (err as Error).message || 'Login failed';
      if (msg.toLowerCase().includes('user not found')) {
        setError('Account does not exist');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold">Log In</h1>

        {error && (
          <div className="p-3 bg-red-500/10 text-red-600 text-sm rounded">{error}</div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Log In'}
        </button>

        <div className="text-sm text-slate-600">
          No account?{' '}
          <Link to="/register" className="text-blue-600">Sign up</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
