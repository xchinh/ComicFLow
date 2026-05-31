import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border p-5 md:p-6 ${
        hover ? 'transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
