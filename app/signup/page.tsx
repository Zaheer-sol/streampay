'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Layers, ArrowRight, Check, RefreshCw, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

type Role = 'customer' | 'merchant';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-amber-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [role, setRole] = useState<Role>('customer');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, {
      full_name: fullName,
      role,
      ...(role === 'merchant' && companyName ? { company_name: companyName } : {}),
    });

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1800);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-4 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Account created!</h2>
            <p className="text-sm text-muted-foreground mt-1">Redirecting you to your dashboard...</p>
          </div>
          <div className="flex justify-center">
            <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[44%] flex-col justify-between p-12 bg-gradient-to-br from-background via-background to-emerald-950/15 border-r border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl translate-x-1/2 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sky-500/5 blur-3xl -translate-x-1/4 translate-y-1/4" />
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

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
              Two portals,
              <br />
              <span className="text-emerald-400">one protocol</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Users authorize spending limits. Merchants build billing logic. StreamPay handles settlement.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border/50 bg-card/20 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-400/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <span className="text-sm font-semibold text-foreground">Customer</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Connect your wallet, authorize merchants, manage subscriptions, and track all spending in one place.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/20 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm font-semibold text-foreground">Merchant</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Accept recurring payments, usage billing, and API micropayments with no custody risk.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground/50">
          Built on Solana · USDC Native · Demo purposes only
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-7">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4 text-background" />
            </div>
            <span className="text-lg font-semibold text-foreground">StreamPay</span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">Get started with StreamPay for free</p>
          </div>

          {/* Role selector */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground">I am a</Label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'customer', label: 'Customer', desc: 'I want to pay with crypto', icon: User, color: 'sky' },
                { value: 'merchant', label: 'Merchant', desc: 'I want to accept payments', icon: Building2, color: 'emerald' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  className={cn(
                    'relative flex flex-col items-start gap-1.5 p-3 rounded-xl border transition-all text-left',
                    role === opt.value
                      ? opt.color === 'sky'
                        ? 'border-sky-500/60 bg-sky-500/8'
                        : 'border-emerald-500/60 bg-emerald-500/8'
                      : 'border-border/60 bg-card/30 hover:bg-card/60'
                  )}
                >
                  {role === opt.value && (
                    <div className={cn(
                      'absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center',
                      opt.color === 'sky' ? 'bg-sky-500' : 'bg-emerald-500'
                    )}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center',
                    opt.color === 'sky' ? 'bg-sky-400/10' : 'bg-emerald-400/10'
                  )}>
                    <opt.icon className={cn('w-3.5 h-3.5', opt.color === 'sky' ? 'text-sky-400' : 'text-emerald-400')} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm text-foreground">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Satoshi Nakamoto"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-10 bg-card/40 border-border/60 focus:border-sky-500/60 focus:ring-sky-500/20"
              />
            </div>

            {role === 'merchant' && (
              <div className="space-y-1.5 animate-slide-up">
                <Label htmlFor="companyName" className="text-sm text-foreground">Company name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Acme API Co."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-10 bg-card/40 border-border/60 focus:border-emerald-500/60 focus:ring-emerald-500/20"
                />
              </div>
            )}

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
              <Label htmlFor="password" className="text-sm text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-all duration-300',
                          i <= strength.score ? strength.color : 'bg-border/40'
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn('text-[10px]', strength.score <= 1 ? 'text-rose-400' : strength.score <= 2 ? 'text-amber-400' : 'text-emerald-400')}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full h-10 font-semibold transition-all hover:scale-[1.01]',
                role === 'merchant'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-background'
                  : 'bg-sky-500 hover:bg-sky-400 text-background'
              )}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
