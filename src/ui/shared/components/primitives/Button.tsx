/**
 * Button Component
 * JRPG-styled button with configurable border color and pixelated font option
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useThemeBorderColor } from '../../hooks/useThemeBorderColor.js';
import { DEFAULT_THEME } from '@config/constants.js';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   */
  variant?: ButtonVariant;

  /**
   * Button size
   */
  size?: ButtonSize;

  /**
   * Button content
   */
  children: ReactNode;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Full width button
   */
  fullWidth?: boolean;

  /**
   * Use pixelated font (for game contexts)
   */
  pixelated?: boolean;

  /**
   * Border color (defaults to theme)
   */
  borderColor?: string;

  /**
   * Enable glow effect
   */
  glow?: boolean;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; hover: string; active: string }> = {
  primary: {
    bg: 'bg-orange-600',
    text: 'text-white',
    hover: 'hover:bg-orange-700',
    active: 'active:bg-orange-800',
  },
  secondary: {
    bg: 'bg-gray-700',
    text: 'text-white',
    hover: 'hover:bg-gray-600',
    active: 'active:bg-gray-500',
  },
  danger: {
    bg: 'bg-red-600',
    text: 'text-white',
    hover: 'hover:bg-red-700',
    active: 'active:bg-red-800',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-gray-300',
    hover: 'hover:bg-gray-800',
    active: 'active:bg-gray-700',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-gray-300',
    hover: 'hover:bg-gray-800',
    active: 'active:bg-gray-700',
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * Button component
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  fullWidth = false,
  pixelated = false,
  borderColor,
  glow = false,
  disabled,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const borderColorValue = useThemeBorderColor(borderColor, DEFAULT_THEME.BORDER_COLOR);
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const widthStyle = fullWidth ? 'w-full' : '';
  const loadingStyle = loading ? 'cursor-wait' : '';
  const pixelatedStyle = pixelated ? 'pixelated' : '';
  
  // Border style - outline variant uses border, others use glow
  const borderStyle = variant === 'outline' 
    ? { borderColor: borderColorValue, borderWidth: '1px' }
    : {};
  
  // Glow effect style - use only for emphasis/active states
  const glowStyle = glow
    ? {
        boxShadow: `0 0 8px ${borderColorValue}`,
      }
    : {};

  const baseStyles = `inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyle.bg} ${variantStyle.text} ${variantStyle.hover} ${variantStyle.active} ${sizeStyle} ${widthStyle} ${loadingStyle} ${pixelatedStyle}`;

  return (
    <button
      type="button"
      className={`${baseStyles} ${className}`}
      style={{
        ...borderStyle,
        ...glowStyle,
        ...style,
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
