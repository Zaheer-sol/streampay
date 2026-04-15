'use client';

import { useState } from 'react';
import { Plus, ShieldCheck, X, Check, Loader as Loader2, ChevronDown, Pause, Play, Trash2 } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/common/StatusBadge';
import { BillingTypeBadge } from '@/components/common/BillingTypeBadge';
import { MerchantAvatar } from '@/components/common/MerchantAvatar';
import { useStore } from '@/lib/store';
import type { Authorization, BillingType } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BILLING_TYPES: { value: BillingType; label: string; desc: string }[] = [
  { value: 'subscription', label: 'Subscription', desc: 'Fixed recurring monthly charge' },
  { value: 'usage', label: 'Usage-Based', desc: 'Metered billing per unit consumed' },
  { value: 'api', label: 'API (per request)', desc: 'Micropayment per API call' },
];

function ConfirmModal({
  auth,
  onClose,
  onConfirm,
}: {
  auth: Partial<Authorization>;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        onConfirm();
      }, 800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6 animate-scale-in">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Authorization Created</h3>
            <p className="text-xs text-muted-foreground">
              {auth.merchant} can now charge up to ${auth.maxPerMonth}/month
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Confirm Authorization</h3>
                <p className="text-xs text-muted-foreground">Sign with your wallet to authorize</p>
              </div>
            </div>

            <div className="space-y-2 mb-5 p-3.5 rounded-xl bg-secondary/30 border border-border/60">
              {[
                { label: 'Merchant', value: auth.merchant },
                { label: 'Token', value: auth.token },
                { label: 'Max per tx', value: `$${auth.maxPerTx}` },
                { label: 'Max per month', value: `$${auth.maxPerMonth}` },
                { label: 'Total cap', value: `$${auth.totalCap}` },
                { label: 'Billing type', value: auth.billingType },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground capitalize">{value as string}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-background"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Signing...</>
                ) : (
                  <><ShieldCheck className="w-3.5 h-3.5 mr-1.5" />Enable Billing</>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthorizationsPage() {
  const { state, dispatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [confirmAuth, setConfirmAuth] = useState<Partial<Authorization> | null>(null);
  const [form, setForm] = useState({
    merchant: '',
    token: 'USDC',
    maxPerTx: '',
    maxPerMonth: '',
    totalCap: '',
    billingType: 'api' as BillingType,
    expiresAt: '',
    rateLimit: '',
  });

  const updateForm = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.merchant || !form.maxPerTx || !form.maxPerMonth || !form.totalCap) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newAuth: Partial<Authorization> = {
      merchant: form.merchant,
      token: 'USDC',
      maxPerTx: parseFloat(form.maxPerTx),
      maxPerMonth: parseFloat(form.maxPerMonth),
      totalCap: parseFloat(form.totalCap),
      billingType: form.billingType,
      expiresAt: form.expiresAt || undefined,
      rateLimit: form.rateLimit ? parseInt(form.rateLimit) : undefined,
    };
    setConfirmAuth(newAuth);
  };

  const handleConfirm = () => {
    if (!confirmAuth) return;
    const auth: Authorization = {
      id: `auth_${Date.now()}`,
      merchant: confirmAuth.merchant!,
      merchantIcon: confirmAuth.merchant![0].toUpperCase(),
      token: 'USDC',
      maxPerTx: confirmAuth.maxPerTx!,
      maxPerMonth: confirmAuth.maxPerMonth!,
      totalCap: confirmAuth.totalCap!,
      spent: 0,
      billingType: confirmAuth.billingType!,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: confirmAuth.expiresAt,
      rateLimit: confirmAuth.rateLimit,
    };
    dispatch({ type: 'ADD_AUTHORIZATION', payload: auth });
    toast.success(`Authorization for ${auth.merchant} created`);
    setConfirmAuth(null);
    setShowForm(false);
    setForm({ merchant: '', token: 'USDC', maxPerTx: '', maxPerMonth: '', totalCap: '', billingType: 'api', expiresAt: '', rateLimit: '' });
  };

  const handleStatusChange = (id: string, status: Authorization['status']) => {
    dispatch({ type: 'UPDATE_AUTH_STATUS', id, status });
    toast.success(`Authorization ${status}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Authorizations" />
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Spend Authorizations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {state.authorizations.filter((a) => a.status === 'active').length} active · {state.authorizations.length} total
            </p>
          </div>
          <Button
            size="sm"
            className="bg-sky-500 hover:bg-sky-400 text-background font-medium"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Authorization
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-400/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Create Spend Authorization</h3>
                  <p className="text-xs text-muted-foreground">Define limits for a merchant to bill you</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Billing Type Selection */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Billing Type *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {BILLING_TYPES.map((bt) => (
                    <button
                      key={bt.value}
                      type="button"
                      onClick={() => updateForm('billingType', bt.value)}
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all',
                        form.billingType === bt.value
                          ? 'border-sky-500/50 bg-sky-500/10 text-sky-400'
                          : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                      )}
                    >
                      <p className="text-xs font-semibold">{bt.label}</p>
                      <p className="text-[10px] mt-0.5 opacity-70">{bt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Merchant Name *</Label>
                  <Input
                    placeholder="e.g. OpenAI API"
                    value={form.merchant}
                    onChange={(e) => updateForm('merchant', e.target.value)}
                    className="h-9 text-sm bg-secondary/30 border-border/60 focus:border-sky-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Token</Label>
                  <div className="relative">
                    <Input
                      value="USDC"
                      readOnly
                      className="h-9 text-sm bg-secondary/30 border-border/60 pr-8 cursor-not-allowed opacity-60"
                    />
                    <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Max per Transaction *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                    <Input
                      placeholder="0.05"
                      type="number"
                      step="0.000001"
                      value={form.maxPerTx}
                      onChange={(e) => updateForm('maxPerTx', e.target.value)}
                      className="h-9 text-sm bg-secondary/30 border-border/60 pl-6 focus:border-sky-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Max per Month *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                    <Input
                      placeholder="50.00"
                      type="number"
                      value={form.maxPerMonth}
                      onChange={(e) => updateForm('maxPerMonth', e.target.value)}
                      className="h-9 text-sm bg-secondary/30 border-border/60 pl-6 focus:border-sky-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Total Cap *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                    <Input
                      placeholder="200.00"
                      type="number"
                      value={form.totalCap}
                      onChange={(e) => updateForm('totalCap', e.target.value)}
                      className="h-9 text-sm bg-secondary/30 border-border/60 pl-6 focus:border-sky-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Rate Limit (req/month)</Label>
                  <Input
                    placeholder="1000"
                    type="number"
                    value={form.rateLimit}
                    onChange={(e) => updateForm('rateLimit', e.target.value)}
                    className="h-9 text-sm bg-secondary/30 border-border/60 focus:border-sky-500/50"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Expiry Date (optional)</Label>
                  <Input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => updateForm('expiresAt', e.target.value)}
                    className="h-9 text-sm bg-secondary/30 border-border/60 focus:border-sky-500/50 max-w-48"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)} className="border-border/60">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-sky-500 hover:bg-sky-400 text-background font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Enable Billing
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Authorizations List */}
        <div className="space-y-3">
          {state.authorizations.map((auth, i) => {
            const pct = (auth.spent / auth.maxPerMonth) * 100;
            return (
              <div
                key={auth.id}
                className="rounded-2xl border border-border/60 bg-card/60 p-5 hover:border-border transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <MerchantAvatar icon={auth.merchantIcon} />
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">{auth.merchant}</h3>
                        <StatusBadge status={auth.status} />
                        <BillingTypeBadge type={auth.billingType} />
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Max ${auth.maxPerTx}/tx</span>
                        <span>·</span>
                        <span>Max ${auth.maxPerMonth}/mo</span>
                        <span>·</span>
                        <span>Cap ${auth.totalCap}</span>
                        {auth.rateLimit && <><span>·</span><span>{auth.rateLimit.toLocaleString()} req/mo</span></>}
                        {auth.expiresAt && <><span>·</span><span>Expires {new Date(auth.expiresAt).toLocaleDateString()}</span></>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {auth.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-border/60 text-muted-foreground hover:text-amber-400 hover:border-amber-400/30"
                        onClick={() => handleStatusChange(auth.id, 'paused')}
                      >
                        <Pause className="w-3 h-3 mr-1" />Pause
                      </Button>
                    )}
                    {auth.status === 'paused' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-border/60 text-muted-foreground hover:text-emerald-400 hover:border-emerald-400/30"
                        onClick={() => handleStatusChange(auth.id, 'active')}
                      >
                        <Play className="w-3 h-3 mr-1" />Resume
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-border/60 text-muted-foreground hover:text-rose-400 hover:border-rose-400/30"
                      onClick={() => handleStatusChange(auth.id, 'cancelled')}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />Cancel
                    </Button>
                  </div>
                </div>

                {/* Usage Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Monthly usage: <span className="text-foreground font-medium">${auth.spent.toFixed(2)}</span> of ${auth.maxPerMonth}</span>
                    <span className={pct > 80 ? 'text-rose-400' : pct > 60 ? 'text-amber-400' : 'text-sky-400'}>
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct > 80 ? 'bg-rose-400' : pct > 60 ? 'bg-amber-400' : 'bg-sky-400'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-muted-foreground">
                  Created {new Date(auth.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {state.authorizations.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No authorizations yet</h3>
            <p className="text-xs text-muted-foreground mb-4">Create your first spend authorization to enable billing</p>
            <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-background" onClick={() => setShowForm(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Authorization
            </Button>
          </div>
        )}
      </main>

      {confirmAuth && (
        <ConfirmModal
          auth={confirmAuth}
          onClose={() => setConfirmAuth(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
