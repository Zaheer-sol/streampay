'use client';

import { DollarSign, CreditCard, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Topbar } from '@/components/layout/Topbar';
import { StatsCard } from '@/components/common/StatsCard';
import { SpendingChart } from '@/components/charts/SpendingChart';
import { CategoryChart } from '@/components/charts/CategoryChart';
import { MerchantAvatar } from '@/components/common/MerchantAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { BillingTypeBadge } from '@/components/common/BillingTypeBadge';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function OverviewPage() {
  const { state } = useStore();

  const activeAuths = state.authorizations.filter((a) => a.status === 'active');
  const activeSubs = state.subscriptions.filter((s) => s.status === 'active');
  const totalApiRequests = state.apiUsage.reduce((sum, u) => sum + u.requestsThisMonth, 0);

  const categoryData = [
    { name: 'API Calls', value: state.apiUsage.reduce((s, u) => s + u.totalCost, 0) },
    { name: 'Subscriptions', value: activeSubs.reduce((s, sub) => s + sub.monthlyCost, 0) },
    { name: 'Usage', value: 8.43 },
  ];

  const recentTx = state.transactions.slice(0, 5);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Overview" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="USDC Balance"
            value={`$${state.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Available to spend"
            trend={2.4}
            icon={DollarSign}
            iconColor="text-sky-400"
            iconBg="bg-sky-400/10"
            delay={0}
          />
          <StatsCard
            title="Monthly Spend"
            value={`$${state.monthlySpend.toFixed(2)}`}
            subtitle="January 2025"
            trend={-5.1}
            icon={Activity}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-400/10"
            delay={80}
          />
          <StatsCard
            title="Active Subscriptions"
            value={activeSubs.length.toString()}
            subtitle={`${state.subscriptions.length} total services`}
            icon={CreditCard}
            iconColor="text-amber-400"
            iconBg="bg-amber-400/10"
            delay={160}
          />
          <StatsCard
            title="Authorizations"
            value={activeAuths.length.toString()}
            subtitle={`${state.apiUsage.reduce((s, u) => s + u.requestsThisMonth, 0).toLocaleString()} API calls this month`}
            icon={ShieldCheck}
            iconColor="text-rose-400"
            iconBg="bg-rose-400/10"
            delay={240}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Spending Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Spending Over Time</h3>
                <p className="text-xs text-muted-foreground mt-0.5">January 2025</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
                <Link href="/dashboard/transactions">View all <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
            <SpendingChart data={state.spendingData} />
          </div>

          {/* Category Breakdown */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-foreground">Spend by Category</h3>
              <p className="text-xs text-muted-foreground mt-0.5">This month</p>
            </div>
            <CategoryChart data={categoryData} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Transactions */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
                <Link href="/dashboard/transactions">View all <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
            <div className="space-y-1">
              {recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-secondary/40 transition-colors group">
                  <div className="flex items-center gap-3">
                    <MerchantAvatar icon={tx.merchant[0]} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-foreground leading-tight">{tx.merchant}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BillingTypeBadge type={tx.type} />
                    <span className={`text-xs font-semibold ${tx.status === 'failed' ? 'text-rose-400' : 'text-foreground'}`}>
                      -${tx.amount.toFixed(tx.amount < 0.01 ? 5 : 2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Authorizations */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Active Authorizations</h3>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
                <Link href="/dashboard/authorizations">Manage <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
            <div className="space-y-2">
              {activeAuths.map((auth) => {
                const pct = (auth.spent / auth.maxPerMonth) * 100;
                return (
                  <div key={auth.id} className="p-3 rounded-xl border border-border/50 hover:border-border transition-colors">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <MerchantAvatar icon={auth.merchantIcon} size="sm" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{auth.merchant}</p>
                          <p className="text-[10px] text-muted-foreground">Max ${auth.maxPerMonth}/mo</p>
                        </div>
                      </div>
                      <StatusBadge status={auth.status} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Spent: ${auth.spent.toFixed(2)}</span>
                        <span>{pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-border overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            pct > 80 ? 'bg-rose-400' : pct > 60 ? 'bg-amber-400' : 'bg-sky-400'
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* API Usage Summary */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">API Usage This Month</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{totalApiRequests.toLocaleString()} total requests</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
              <Link href="/dashboard/api-usage">Details <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {state.apiUsage.map((usage) => {
              const pct = (usage.requestsThisMonth / 100000) * 100;
              return (
                <div key={usage.merchantId} className="p-3 rounded-xl border border-border/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <MerchantAvatar icon={usage.merchantIcon} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-foreground">{usage.merchant}</p>
                      <p className="text-[10px] text-muted-foreground">${usage.costPerRequest.toFixed(5)}/req</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{usage.requestsThisMonth.toLocaleString()} reqs</span>
                    <span className="text-foreground font-medium">${usage.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="h-1 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-400 transition-all duration-700"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
