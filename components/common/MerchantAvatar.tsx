import { cn } from '@/lib/utils';

const MERCHANT_COLORS: Record<string, string> = {
  O: 'from-sky-500 to-blue-600',
  R: 'from-violet-500 to-purple-600',
  S: 'from-emerald-500 to-teal-600',
  H: 'from-amber-500 to-orange-600',
  V: 'from-rose-500 to-pink-600',
};

interface MerchantAvatarProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MerchantAvatar({ icon, size = 'md', className }: MerchantAvatarProps) {
  const gradient = MERCHANT_COLORS[icon] || 'from-sky-500 to-blue-600';
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };
  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-br flex items-center justify-center font-bold text-white shrink-0 shadow-sm',
        gradient,
        sizeClasses[size],
        className
      )}
    >
      {icon}
    </div>
  );
}
