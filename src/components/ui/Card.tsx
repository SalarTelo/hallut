import { ReactNode } from 'react';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  variant = 'default',
  children,
  className = '',
  onClick,
}: CardProps) {
  const classes = [
    'card',
    variant !== 'default' ? `card-${variant}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {children}
    </div>
  );
}

