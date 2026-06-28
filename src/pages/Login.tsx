import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, error, loading, session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (session) {
      navigate('/calendar', { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/calendar', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-xl rounded-[2rem] p-8">
        <h1 className="text-3xl font-black mb-6 text-slate-900 dark:text-slate-100">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
            />
          </label>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700 transition"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
