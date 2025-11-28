/**
 * Märkeskomponent
 * Återanvändbar märkeskomponent för etiketter och statusindikatorer
 */

import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Märkesinnehåll
   */
  children: ReactNode;

  /**
   * Märkesvariant
   */
  variant?: BadgeVariant;

  /**
   * Märkesstorlek
   */
  size?: BadgeSize;

  /**
   * Avrundat märke
   */
  rounded?: boolean;

  /**
   * Konturstil
   */
  outline?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
  },
  primary: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
  success: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
  warning: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
  },
  danger: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
  },
  info: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-300',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

/**
 * Märkeskomponent
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  outline = false,
  className = '',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium';
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const roundedStyle = rounded ? 'rounded-full' : 'rounded';
  const bgStyle = outline ? 'bg-transparent border' : variantStyle.bg;
  const textStyle = variantStyle.text;
  const borderStyle = outline ? variantStyle.border : 'border-transparent';

  return (
    <span
      className={`${baseStyles} ${bgStyle} ${textStyle} ${borderStyle} ${sizeStyle} ${roundedStyle} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
