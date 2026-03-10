import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../lib/api';

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPasswordStrong(password: string) {
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;
}

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const navigate = useNavigate();

  const passwordsMatch = password === confirm;
  const emailOk = isEmailValid(email);
  const pwdStrong = isPasswordStrong(password);

  const canSubmit = name.trim().length > 0 && emailOk && pwdStrong && passwordsMatch && !loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailExists(false);
    if (!canSubmit) return;
    setLoading(true);
    try {
      await registerUser({ name: name.trim(), email: email.trim(), password });
      navigate('/login', { replace: true, state: { email: email.trim() } });
    } catch (err) {
      const msg = (err as Error).message || 'Registration failed';
      if (msg.toLowerCase().includes('email already exists')) {
        setEmailExists(true);
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
        <h1 className="text-2xl font-bold">Sign Up</h1>

        {error && (
          <div className="p-3 bg-red-500/10 text-red-600 text-sm rounded">{error}</div>
        )}
        {emailExists && (
          <div className="p-3 bg-yellow-100 text-yellow-900 text-sm rounded flex items-center justify-between gap-2">
            <span>Email already exists. Log in instead.</span>
            <Link
              to="/login"
              state={{ email: email.trim() }}
              className="text-blue-600 underline"
            >
              Go to Login
            </Link>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="you@example.com"
          />
          {!emailOk && email.length > 0 && (
            <p className="text-xs text-red-600">Invalid email format</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Strong password"
          />
          {password.length > 0 && !pwdStrong && (
            <ul className="text-xs text-slate-600 list-disc pl-5">
              <li>At least 8 characters</li>
              <li>Uppercase and lowercase letters</li>
              <li>Number and special character</li>
            </ul>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Repeat password"
          />
          {confirm.length > 0 && !passwordsMatch && (
            <p className="text-xs text-red-600">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>

        <div className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">Log in</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
