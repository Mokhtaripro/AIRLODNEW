'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    setTimeout(() => router.push('/dashboard/cards'), 600);
  };

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[380px]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-lg font-bold tracking-tight">AIRLOD</span>
          </div>
          <h1 className="text-2xl font-bold mt-6 mb-1">Create your account</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-8">Start sharing your card in minutes</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-[var(--radius-sm)] bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" className="input input-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" className="input input-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" className="input input-lg pr-10" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm password</label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat password" className="input input-lg" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3 !text-[15px] disabled:opacity-50 mt-2">
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[var(--accent)] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-[var(--bg-page)] items-center justify-center p-12">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
          <h2 className="text-2xl font-bold mb-3">Digital Business Card</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Create, customize, and share your professional digital business card with NFC and QR code technology.
          </p>
        </div>
      </div>
    </div>
  );
}
