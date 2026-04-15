'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Code as Code2, ShieldCheck, ArrowLeftRight, Activity, Settings, Layers, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/dashboard/api-usage', label: 'API Usage', icon: Code2 },
  { href: '/dashboard/authorizations', label: 'Authorizations', icon: ShieldCheck },
  { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/dashboard/activity', label: 'Activity', icon: Activity },
];

const BOTTOM_ITEMS = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useStore();

  const activeCount = state.authorizations.filter((a) => a.status === 'active').length;

  return (
    <aside className="hidden lg:flex flex-col w-[220px] shrink-0 min-h-screen border-r border-border/60 bg-background/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/60">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center shrink-0 shadow-lg">
          <Layers className="w-4 h-4 text-background" />
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground block leading-tight">StreamPay</span>
          <span className="text-[10px] text-muted-foreground">Billing Protocol</span>
        </div>
      </div>

      {/* Network Badge */}
      <div className="px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-400/8 border border-emerald-400/15">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-medium">Solana Mainnet</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="px-2 py-1.5 mb-2">
          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
            Main
          </span>
        </div>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                isActive
                  ? 'bg-sky-500/10 text-sky-400 font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-sky-400' : 'text-muted-foreground/70 group-hover:text-foreground/70'
                  )}
                />
                {label}
              </div>
              {label === 'Authorizations' && activeCount > 0 && (
                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-sky-500/20 text-sky-400 border-sky-500/20 font-medium">
                  {activeCount}
                </Badge>
              )}
              {isActive && (
                <ChevronRight className="w-3 h-3 text-sky-400/50" />
              )}
            </Link>
          );
        })}

        <div className="px-2 py-1.5 mt-4 mb-2">
          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
            Account
          </span>
        </div>
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                isActive
                  ? 'bg-sky-500/10 text-sky-400 font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-sky-400' : 'text-muted-foreground/70 group-hover:text-foreground/70')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom promo */}
      <div className="mx-3 mb-4 p-3.5 rounded-xl border border-border/60 bg-secondary/30">
        <p className="text-[11px] font-medium text-foreground mb-0.5">Demo Mode</p>
        <p className="text-[10px] text-muted-foreground leading-snug">
          Toggle to simulate real-time billing
        </p>
      </div>
    </aside>
  );
}
