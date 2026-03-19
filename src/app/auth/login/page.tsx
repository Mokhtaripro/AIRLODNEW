'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => router.push('/dashboard/cards'), 600);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[380px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-lg font-bold tracking-tight">AIRLOD</span>
          </div>
          <h1 className="text-2xl font-bold mt-6 mb-1 text-[var(--text)]">Welcome back</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-[var(--radius-sm)] bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="input input-lg"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[var(--text)]">Password</label>
                <a href="#" className="text-xs text-[var(--accent)] hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-lg pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-light)] hover:text-[var(--text-secondary)]"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 !text-[15px] disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-light)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <button
            onClick={() => { setLoading(true); setTimeout(() => router.push('/dashboard/cards'), 400); }}
            className="btn-outline w-full !py-3 !text-[15px]"
          >
            Try Demo <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center mt-8 text-sm text-[var(--text-secondary)]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-[var(--accent)] font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 bg-[var(--accent)] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[220px] h-[220px] rounded-full bg-white/5" />

        <div className="relative z-10 text-center text-white max-w-md">
          {/* Mock card */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl mb-8 text-left text-[var(--text)] inline-block w-[280px]">
            <div className="h-16 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 mb-6 relative">
              <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-full bg-white shadow flex items-center justify-center border-[3px] border-white">
                <span className="text-sm font-bold text-[var(--accent)]">JD</span>
              </div>
            </div>
            <p className="font-semibold text-sm mt-2">John Doe</p>
            <p className="text-xs text-[var(--text-muted)]">Marketing Expert</p>
            <div className="mt-4 space-y-2">
              <div className="h-8 rounded-lg bg-[var(--bg-muted)] flex items-center px-3 text-[10px] text-[var(--text-muted)]">john@example.com</div>
              <div className="h-8 rounded-lg bg-[var(--bg-muted)] flex items-center px-3 text-[10px] text-[var(--text-muted)]">+33 6 12 34 56 78</div>
            </div>
            <div className="mt-4 h-9 rounded-lg bg-[var(--text)] text-white flex items-center justify-center text-xs font-semibold">
              Save Contact
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Your Digital Business Card</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Share your contact info instantly with NFC, QR codes, and personalized links.
          </p>
        </div>
      </div>
    </div>
  );
}
