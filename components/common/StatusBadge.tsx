import { cn } from '@/lib/utils';

type Status = 'active' | 'paused' | 'expired' | 'cancelled' | 'confirmed' | 'pending' | 'failed';

const STATUS_STYLES: Record<Status, { label: string; className: string; dot: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
  paused: {
    label: 'Paused',
    className: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    dot: 'bg-amber-400',
  },
  expired: {
    label: 'Expired',
    className: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
    dot: 'bg-rose-400',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    dot: 'bg-amber-400 animate-pulse',
  },
  failed: {
    label: 'Failed',
    className: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
    dot: 'bg-rose-400',
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border',
        config.className,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      {config.label}
    </span>
  );
}
