'use client';

import { useState, useMemo } from 'react';
import { ArrowLeftRight, ExternalLink, Search, Filter } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { BillingTypeBadge } from '@/components/common/BillingTypeBadge';
import { MerchantAvatar } from '@/components/common/MerchantAvatar';
import { useStore } from '@/lib/store';
import type { BillingType } from '@/lib/types';
import { cn } from '@/lib/utils';

const TYPE_FILTERS: { value: BillingType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'api', label: 'API' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'usage', label: 'Usage' },
];

export default function TransactionsPage() {
  const { state } = useStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<BillingType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filtered = useMemo(() => {
    const now = new Date();
    return state.transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (search && !tx.merchant.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFilter !== 'all') {
        const txDate = new Date(tx.date);
        if (dateFilter === 'today') {
          return txDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return txDate >= weekAgo;
        } else if (dateFilter === 'month') {
          return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        }
      }
      return true;
    });
  }, [state.transactions, typeFilter, search, dateFilter]);

  const totalAmount = filtered.filter((t) => t.status === 'confirmed').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Transactions" />
      <main className="flex-1 p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-slide-up">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filtered.length} transactions · ${totalAmount.toFixed(2)} total
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search merchants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm bg-secondary/30 border-border/60"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div className="flex gap-1">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                    typeFilter === f.value
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 border-l border-border/60 pl-2">
              {(['all', 'today', 'week', 'month'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDateFilter(d)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize',
                    dateFilter === d
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/20">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Merchant</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                      <span className="text-muted-foreground/50">
                        {new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MerchantAvatar icon={tx.merchant[0]} size="sm" />
                        <span className="text-xs font-medium text-foreground">{tx.merchant}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <BillingTypeBadge type={tx.type} />
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-foreground whitespace-nowrap">
                      -${tx.amount < 0.01 ? tx.amount.toFixed(5) : tx.amount.toFixed(2)} USDC
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {tx.signature.slice(0, 8)}...{tx.signature.slice(-4)}
                        </span>
                        <button className="text-muted-foreground/50 hover:text-sky-400 transition-colors opacity-0 group-hover:opacity-100">
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <ArrowLeftRight className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No transactions found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
