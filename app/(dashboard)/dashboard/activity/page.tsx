'use client';

import { Activity, Zap, RefreshCw, ShieldCheck, RotateCcw, Code as Code2 } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { MerchantAvatar } from '@/components/common/MerchantAvatar';
import { useStore } from '@/lib/store';
import type { ActivityItem } from '@/lib/types';
import { cn } from '@/lib/utils';

const TYPE_CONFIG = {
  api_call: { icon: Code2, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  charge: { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  renewal: { icon: RefreshCw, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  authorization: { icon: ShieldCheck, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  refund: { icon: RotateCcw, color: 'text-rose-400', bg: 'bg-rose-400/10' },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function groupByDate(items: ActivityItem[]): Record<string, ActivityItem[]> {
  const groups: Record<string, ActivityItem[]> = {};
  items.forEach((item) => {
    const date = new Date(item.timestamp);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    let label: string;
    if (date.toDateString() === today.toDateString()) {
      label = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday';
    } else {
      label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });
  return groups;
}

export default function ActivityPage() {
  const { state } = useStore();
  const grouped = groupByDate(state.activity);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Activity" />
      <main className="flex-1 p-6">
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6 animate-slide-up">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Activity Feed</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {state.activity.length} events · Real-time billing activity
              </p>
            </div>
            {state.demoMode && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
            )}
          </div>

          {Object.entries(grouped).map(([date, items], gi) => (
            <div key={date} className="mb-6 animate-slide-up" style={{ animationDelay: `${gi * 50}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-muted-foreground">{date}</span>
                <div className="flex-1 h-px bg-border/60" />
                <span className="text-[10px] text-muted-foreground/50">{items.length} events</span>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40" />

                <div className="space-y-1">
                  {items.map((item, i) => {
                    const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.charge;
                    const Icon = config.icon;

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'flex items-start gap-4 pl-8 pr-3 py-3 rounded-xl hover:bg-secondary/30 transition-colors group animate-fade-in'
                        )}
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        {/* Timeline dot */}
                        <div className={cn(
                          'absolute left-2 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center',
                          config.bg,
                          i === 0 && date === 'Today' ? 'ring-2 ring-sky-400/30' : ''
                        )} style={{ marginTop: '10px' }}>
                          <Icon className={cn('w-2 h-2', config.color)} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <MerchantAvatar icon={item.merchantIcon} size="sm" />
                              <div>
                                <p className="text-xs font-medium text-foreground leading-tight">{item.message}</p>
                                <p className="text-[10px] text-muted-foreground">{item.merchant}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                              {item.amount !== undefined && (
                                <span className="text-xs font-semibold text-foreground">
                                  -${item.amount < 0.01 ? item.amount.toFixed(5) : item.amount.toFixed(2)}
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground/60">{timeAgo(item.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {state.activity.length === 0 && (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">No activity yet</h3>
              <p className="text-xs text-muted-foreground">Activity will appear here as charges happen</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
