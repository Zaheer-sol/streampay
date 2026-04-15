import { cn } from '@/lib/utils';
import { Video as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'text-sky-400',
  iconBg = 'bg-sky-400/10',
  className,
  delay = 0,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm animate-slide-up hover:border-border transition-all duration-200 hover:bg-card/80',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs text-muted-foreground font-medium">{title}</span>
        {Icon && (
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', iconBg)}>
            <Icon className={cn('w-4 h-4', iconColor)} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground tracking-tight">{value}</span>
        {trend !== undefined && (
          <div className={cn('flex items-center gap-0.5 text-xs font-medium mb-0.5', trend >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
