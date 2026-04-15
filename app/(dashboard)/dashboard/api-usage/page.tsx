'use client';

import { useState } from 'react';
import { Code as Code2, Zap, Play, Loader as Loader2, TrendingUp, Hash, DollarSign } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { MerchantAvatar } from '@/components/common/MerchantAvatar';
import { StatsCard } from '@/components/common/StatsCard';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const HOURLY_MOCK = [
  { hour: '00:00', requests: 1200 },
  { hour: '03:00', requests: 840 },
  { hour: '06:00', requests: 2100 },
  { hour: '09:00', requests: 8400 },
  { hour: '12:00', requests: 12000 },
  { hour: '15:00', requests: 9800 },
  { hour: '18:00', requests: 7200 },
  { hour: '21:00', requests: 4100 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 p-2.5 shadow-xl">
      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
      <p className="text-xs font-medium text-foreground">{payload[0].value.toLocaleString()} requests</p>
    </div>
  );
}

export default function ApiUsagePage() {
  const { state, dispatch } = useStore();
  const [simulating, setSimulating] = useState(false);
  const [lastCost, setLastCost] = useState<number | null>(null);

  const totalRequests = state.apiUsage.reduce((s, u) => s + u.totalRequests, 0);
  const totalCost = state.apiUsage.reduce((s, u) => s + u.totalCost, 0);
  const requestsThisMonth = state.apiUsage.reduce((s, u) => s + u.requestsThisMonth, 0);

  const handleSimulate = () => {
    setSimulating(true);
    setLastCost(null);
    const delay = 400 + Math.random() * 600;
    setTimeout(() => {
      dispatch({ type: 'SIMULATE_API_CALL', merchantId: 'auth_1' });
      setSimulating(false);
      setLastCost(0.00005);
      toast.success('API call simulated', {
        description: 'Charged $0.00005 · OpenAI API · Confirmed in 412ms',
      });
    }, delay);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="API Usage" />
      <main className="flex-1 p-6 space-y-6">
        {/* Simulate Panel */}
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">API Call Simulator</h3>
                <p className="text-xs text-muted-foreground">
                  Simulate a real API request to OpenAI API via StreamPay billing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastCost !== null && (
                <div className="text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg animate-fade-in">
                  -${lastCost.toFixed(5)} USDC
                </div>
              )}
              <Button
                onClick={handleSimulate}
                disabled={simulating}
                className="bg-sky-500 hover:bg-sky-400 text-background font-medium"
                size="sm"
              >
                {simulating ? (
                  <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Processing...</>
                ) : (
                  <><Play className="w-3.5 h-3.5 mr-1.5 fill-current" />Simulate API Call</>
                )}
              </Button>
            </div>
          </div>

          {simulating && (
            <div className="mt-4 pt-4 border-t border-sky-500/20">
              <div className="flex items-center gap-2 text-xs text-sky-400">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>Submitting transaction to Solana... waiting for confirmation</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Requests"
            value={totalRequests.toLocaleString()}
            subtitle="all time"
            icon={Hash}
            iconColor="text-sky-400"
            iconBg="bg-sky-400/10"
            trend={12.3}
            delay={0}
          />
          <StatsCard
            title="Requests This Month"
            value={requestsThisMonth.toLocaleString()}
            subtitle="January 2025"
            icon={TrendingUp}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-400/10"
            trend={8.7}
            delay={80}
          />
          <StatsCard
            title="Total API Cost"
            value={`$${totalCost.toFixed(2)}`}
            subtitle="all merchants"
            icon={DollarSign}
            iconColor="text-amber-400"
            iconBg="bg-amber-400/10"
            delay={160}
          />
        </div>

        {/* Hourly Distribution */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-foreground">Requests by Hour</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Today&apos;s API traffic distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={HOURLY_MOCK} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 13%)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="requests" fill="#38bdf8" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per Merchant Breakdown */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">By Merchant</h2>
          {state.apiUsage.map((usage, i) => {
            const pct = (usage.requestsThisMonth / (usage.requestsThisMonth + 50000)) * 100;
            return (
              <div
                key={usage.merchantId}
                className="rounded-2xl border border-border/60 bg-card/60 p-5 hover:border-border transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <MerchantAvatar icon={usage.merchantIcon} />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{usage.merchant}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ${usage.costPerRequest.toFixed(6)} per request
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{usage.requestsThisMonth.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">reqs this month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{usage.totalRequests.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">total requests</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-sky-400">${usage.totalCost.toFixed(2)}</p>
                      <p className="text-[10px] text-muted-foreground">total cost</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>This month vs. capacity</span>
                    <span>{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-400 transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 flex items-start gap-3">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-foreground mb-0.5">Enable Demo Mode</p>
            <p className="text-xs text-muted-foreground">
              Toggle Demo Mode in the top bar to auto-simulate API calls every 3 seconds and see real-time counter updates.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
