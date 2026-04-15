'use client';

import { CreditCard, Calendar, Pause, Play, X, TrendingUp } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MerchantAvatar } from '@/components/common/MerchantAvatar';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: 'bg-sky-400/10 text-sky-400 border-sky-400/20',
  Analytics: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  Staking: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
};

export default function SubscriptionsPage() {
  const { state, dispatch } = useStore();

  const active = state.subscriptions.filter((s) => s.status === 'active');
  const paused = state.subscriptions.filter((s) => s.status === 'paused');
  const cancelled = state.subscriptions.filter((s) => s.status === 'cancelled');
  const totalMonthly = active.reduce((sum, s) => sum + s.monthlyCost, 0);

  const handleToggle = (id: string, currentStatus: string) => {
    dispatch({ type: 'TOGGLE_SUBSCRIPTION', id });
    const next = currentStatus === 'active' ? 'paused' : 'resumed';
    toast.success(`Subscription ${next}`);
  };

  const handleCancel = (id: string, service: string) => {
    dispatch({ type: 'CANCEL_SUBSCRIPTION', id });
    toast.success(`${service} subscription cancelled`);
  };

  const SubscriptionCard = ({ sub }: { sub: typeof state.subscriptions[0] }) => {
    const daysUntilBilling = Math.ceil(
      (new Date(sub.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const categoryStyle = CATEGORY_COLORS[sub.category] || 'bg-secondary text-muted-foreground border-border';

    return (
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 hover:border-border transition-all duration-200 animate-slide-up">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <MerchantAvatar icon={sub.serviceIcon} />
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground">{sub.service}</h3>
                <StatusBadge status={sub.status} />
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${categoryStyle}`}>
                  {sub.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Next: {new Date(sub.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {sub.status === 'active' && (
                    <span className={`ml-1 ${daysUntilBilling <= 3 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                      ({daysUntilBilling}d)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <p className="text-base font-bold text-foreground">${sub.monthlyCost.toFixed(2)}</p>
              <p className="text-[10px] text-muted-foreground">per month</p>
            </div>
            <div className="flex flex-col gap-1.5 ml-2">
              {sub.status !== 'cancelled' && (
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-7 text-xs border-border/60 ${
                    sub.status === 'active'
                      ? 'text-muted-foreground hover:text-amber-400 hover:border-amber-400/30'
                      : 'text-muted-foreground hover:text-emerald-400 hover:border-emerald-400/30'
                  }`}
                  onClick={() => handleToggle(sub.id, sub.status)}
                >
                  {sub.status === 'active' ? (
                    <><Pause className="w-3 h-3 mr-1" />Pause</>
                  ) : (
                    <><Play className="w-3 h-3 mr-1" />Resume</>
                  )}
                </Button>
              )}
              {sub.status !== 'cancelled' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-border/60 text-muted-foreground hover:text-rose-400 hover:border-rose-400/30"
                  onClick={() => handleCancel(sub.id, sub.service)}
                >
                  <X className="w-3 h-3 mr-1" />Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Subscriptions" />
      <main className="flex-1 p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">Monthly Total</span>
              <div className="w-7 h-7 rounded-lg bg-sky-400/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">${totalMonthly.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">across {active.length} active subscriptions</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">Active</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{active.length}</p>
            <p className="text-xs text-muted-foreground mt-1">services billing monthly</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">Paused</span>
              <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Pause className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{paused.length}</p>
            <p className="text-xs text-muted-foreground mt-1">suspended subscriptions</p>
          </div>
        </div>

        {/* Active Subscriptions */}
        {active.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">Active</h2>
            <div className="space-y-3">
              {active.map((sub) => <SubscriptionCard key={sub.id} sub={sub} />)}
            </div>
          </section>
        )}

        {/* Paused */}
        {paused.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">Paused</h2>
            <div className="space-y-3">
              {paused.map((sub) => <SubscriptionCard key={sub.id} sub={sub} />)}
            </div>
          </section>
        )}

        {/* Cancelled */}
        {cancelled.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">Cancelled</h2>
            <div className="space-y-3">
              {cancelled.map((sub) => <SubscriptionCard key={sub.id} sub={sub} />)}
            </div>
          </section>
        )}

        {state.subscriptions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No subscriptions</h3>
            <p className="text-xs text-muted-foreground">Subscribe to a service to see it here</p>
          </div>
        )}
      </main>
    </div>
  );
}
