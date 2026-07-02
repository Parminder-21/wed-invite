'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 px-6 py-12 select-none">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#800020] flex items-center justify-center mx-auto">
            <Lock size={22} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Admin Panel Login
          </h2>
          <p className="text-sm text-gray-500">
            Secure access to manage the wedding invitation
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-xs font-semibold flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-xs uppercase font-bold text-gray-500 mb-2 flex items-center gap-1.5">
              <User size={14} className="text-gray-400" />
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs uppercase font-bold text-gray-500 mb-2 flex items-center gap-1.5">
              <Lock size={14} className="text-gray-400" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#800020] hover:bg-[#A30029] disabled:bg-[#80002070] text-white rounded-lg font-semibold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        {/* Note info */}
        <p className="text-center text-xs text-gray-400 select-text">
          Default Dev Credentials: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-600">admin / admin123</code>
        </p>
      </div>
    </main>
  );
}
