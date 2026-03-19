'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Wifi, UserPlus, Share2, QrCode } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      router.push('/dashboard/cards');
    }, 800);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard/cards');
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-lg bg-[var(--text-primary)] flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">airlod</span>
            <span className="text-[var(--border-strong)] mx-1">|</span>
            <span className="text-[var(--text-secondary)] font-normal">Log in</span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-[var(--radius-sm)] bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="input input-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input input-lg pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-dark w-full !py-3 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-sm text-[var(--text-muted)]">OR</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Demo button */}
          <button
            onClick={handleDemoLogin}
            className="btn-secondary w-full !py-3 mb-3"
          >
            Continue with Demo
          </button>

          {/* Sign up link */}
          <p className="text-center mt-8 text-sm text-[var(--text-secondary)]">
            New to AIRLOD?{' '}
            <Link href="/auth/register" className="text-[var(--accent)] font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Showcase (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-[var(--bg-secondary)] items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center max-w-md">
          {/* Card Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 inline-block text-left">
            <div className="w-full h-24 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 relative">
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border-4 border-white">
                <span className="text-lg font-bold text-[var(--accent)]">SS</span>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="font-semibold text-[var(--text-primary)]">Samantha Smith</p>
              <p className="text-sm text-[var(--text-secondary)]">Sales at Company Co</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">samantha@company.co</p>
            </div>
            <button className="btn-dark w-full mt-4 !py-2.5 !text-sm">
              Save Contact
            </button>
          </div>

          {/* Share Info Form Preview */}
          <div className="bg-white rounded-xl shadow-md p-5 max-w-[240px] ml-auto -mt-12 relative z-20">
            <p className="font-semibold text-sm mb-3 text-[var(--text-primary)]">Share your info back</p>
            <div className="space-y-2">
              <div className="h-8 border border-[var(--border)] rounded-md px-2 flex items-center text-xs text-[var(--text-muted)]">Name</div>
              <div className="h-8 border border-[var(--border)] rounded-md px-2 flex items-center text-xs text-[var(--text-muted)]">Your Email</div>
              <div className="h-8 border border-[var(--border)] rounded-md px-2 flex items-center text-xs text-[var(--text-muted)]">Number</div>
            </div>
            <button className="btn-dark w-full mt-3 !py-2 !text-xs">Connect</button>
          </div>

          {/* Features */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <QrCode className="w-4 h-4 text-[var(--accent)]" />
              QR Code
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <UserPlus className="w-4 h-4 text-[var(--accent)]" />
              Contacts
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Share2 className="w-4 h-4 text-[var(--accent)]" />
              NFC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
