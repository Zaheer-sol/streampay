import { RefreshCw, Activity, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BillingType } from '@/lib/types';

const TYPE_CONFIG = {
  subscription: {
    label: 'Subscription',
    icon: RefreshCw,
    className: 'bg-sky-400/10 text-sky-400 border-sky-400/20',
  },
  usage: {
    label: 'Usage',
    icon: Activity,
    className: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  },
  api: {
    label: 'API',
    icon: Code2,
    className: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  },
};

interface BillingTypeBadgeProps {
  type: BillingType;
  className?: string;
}

export function BillingTypeBadge({ type, className }: BillingTypeBadgeProps) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border',
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
