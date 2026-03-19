'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Wifi } from 'lucide-react';

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

    // Demo mode - skip auth for now
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
    <div className="min-h-screen bg-mesh relative flex items-center justify-center p-4">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="w-full max-w-[400px] relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Wifi className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Airl<span className="text-[var(--accent)]">o</span>d
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="glass-card p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="glass-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-[var(--accent)]">Mot de passe oublié ?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Demo button */}
        <button
          onClick={handleDemoLogin}
          className="glass-button w-full mt-4"
        >
          Accéder en mode démo
        </button>

        {/* Sign up link */}
        <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="text-[var(--accent)] font-medium">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
