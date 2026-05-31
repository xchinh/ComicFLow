import { Crown } from 'lucide-react';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'free' | 'premium' | 'locked' | 'owned' | 'hot' | 'new' | 'success' | 'warning' | 'default' | 'primary' | 'secondary' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    free: 'bg-success/20 text-success border-success/30',
    premium: 'bg-gradient-to-r from-amber-300/35 via-yellow-400/25 to-orange-400/35 text-amber-700 dark:text-amber-200 border-yellow-400/70 shadow-[0_0_18px_rgba(250,204,21,0.28)] ring-1 ring-yellow-300/40 uppercase tracking-wide font-extrabold',
    locked: 'bg-muted/50 text-muted-foreground border-border',
    owned: 'bg-secondary/20 text-secondary border-secondary/30',
    hot: 'bg-error/20 text-error border-error/30',
    new: 'bg-warning/20 text-warning border-warning/30',
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    error: 'bg-error/20 text-error border-error/30',
    primary: 'bg-primary/20 text-primary border-primary/30',
    secondary: 'bg-secondary/20 text-secondary border-secondary/30',
    default: 'bg-muted text-muted-foreground border-border'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${variants[variant]} ${className}`}>
      {variant === 'premium' && (
        <Crown className="w-3.5 h-3.5 mr-1.5 fill-current stroke-[2.5] drop-shadow-sm" aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
