'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Layers, ArrowRight, Zap, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';

const DEMO_ACCOUNTS = [
  { label: 'Customer Demo', email: 'customer@demo.streampay.so', password: 'demo1234', role: 'Customer' },
  { label: 'Merchant Demo', email: 'merchant@demo.streampay.so', password: 'demo1234', role: 'Merchant' },
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error, role } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  const fillDemo = (account: typeof DEMO_ACCOUNTS[number]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 bg-gradient-to-br from-background via-background to-sky-950/20 border-r border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-sky-500/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(217_32%_13%/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_32%_13%/0.3)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4 text-background" />
            </div>
            <span className="text-lg font-semibold text-foreground">StreamPay</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
              Programmable billing
              <br />
              <span className="text-sky-400">for the onchain economy</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-sm">
              Subscriptions, usage-based billing, and pay-per-request APIs — all settled on Solana in under 400ms.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: RefreshCw, label: 'Recurring subscriptions', desc: 'Automated billing with one wallet auth' },
              { icon: Zap, label: 'Instant settlement', desc: 'Sub-400ms finality on Solana' },
              { icon: Shield, label: 'Spend controls', desc: 'Per-tx and monthly limit enforcement' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { value: '<400ms', label: 'Settlement' },
              { value: '$0.00025', label: 'Per-tx fee' },
              { value: '99.9%', label: 'Uptime' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                <div className="text-lg font-bold text-foreground">{s.value}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground/50">
          Built on Solana · USDC Native · Demo purposes only
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4 text-background" />
            </div>
            <span className="text-lg font-semibold text-foreground">StreamPay</span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your StreamPay account</p>
          </div>

          {/* Demo accounts */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Quick demo access</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="flex flex-col items-start px-3 py-2.5 rounded-lg border border-border/60 bg-card/40 hover:bg-card/80 hover:border-border transition-all text-left group"
                >
                  <span className="text-xs font-medium text-foreground group-hover:text-sky-400 transition-colors">{account.label}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{account.role} portal</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-10 bg-card/40 border-border/60 focus:border-sky-500/60 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-foreground">Password</Label>
                <a href="#" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 pr-10 bg-card/40 border-border/60 focus:border-sky-500/60 focus:ring-sky-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-sky-500 hover:bg-sky-400 text-background font-semibold transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
