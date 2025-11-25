import { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'neutral';
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = 'primary',
  children,
  className = '',
}: BadgeProps) {
  const classes = [
    'badge',
    `badge-${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}

