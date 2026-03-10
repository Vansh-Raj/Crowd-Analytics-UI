import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <p className="text-slate-600">Sign in to continue or create a new account.</p>
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded transition border"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
