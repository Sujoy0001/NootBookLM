import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/main');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/main');
    } catch (err) {
      setError('Failed to log in with Google: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="glass-panel animate-fade-in w-full max-w-md p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative flair */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"></div>
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-inner">
            <LogIn size={28} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Welcome back</h2>
          <p className="text-slate-500 dark:text-slate-400">Enter your details to access your workspace.</p>
        </div>

        {error && (
          <div className="p-3 mb-5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" required className="auth-input w-full transition-shadow duration-200" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div className="space-y-1.5 flex flex-col mb-6">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <input type="password" required className="auth-input w-full transition-shadow duration-200" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          
          <button disabled={loading} type="submit" className="btn btn-primary w-full py-3 mt-4 text-base shadow-md hover:shadow-lg transition-all">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="flex items-center my-6 text-slate-400 dark:text-slate-500">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50"></div>
          <span className="px-4 text-sm font-medium">or continue with</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50"></div>
        </div>

        <button disabled={loading} onClick={handleGoogleLogin} className="btn btn-secondary w-full flex justify-center py-3 bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          Don't have an account? <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
