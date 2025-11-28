/**
 * Card Component
 * JRPG-styled card with dark backgrounds and configurable border color
 */

import type { HTMLAttributes, ReactNode } from 'react';
import { getThemeValue } from '@utils/theme.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card content
   */
  children: ReactNode;

  /**
   * Card title (optional)
   */
  title?: string;

  /**
   * Card subtitle (optional)
   */
  subtitle?: string;

  /**
   * Card footer (optional)
   */
  footer?: ReactNode;

  /**
   * Padding variant
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Shadow variant
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Use pixelated font for text (for in-game contexts)
   */
  pixelated?: boolean;

  /**
   * Border color (defaults to theme)
   */
  borderColor?: string;


  /**
   * Enable glow effect on border
   */
  glow?: boolean;

  /**
   * Dark mode (default: true for JRPG aesthetic)
   */
  dark?: boolean;
}

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

const shadowStyles: Record<NonNullable<CardProps['shadow']>, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

/**
 * Card component
 */
export function Card({
  children,
  title,
  subtitle,
  footer,
  padding = 'md',
  shadow = 'md',
  pixelated = false,
  borderColor,
  glow = false,
  dark = true,
  className = '',
  style,
  ...props
}: CardProps) {
  const borderColorValue = borderColor || getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);
  const paddingStyle = paddingStyles[padding];
  const shadowStyle = shadowStyles[shadow];
  const pixelatedStyle = pixelated ? 'pixelated' : '';
  
  // Background and text colors based on dark mode
  const bgColor = dark ? 'bg-gray-900' : 'bg-white';
  const textColor = dark ? 'text-gray-100' : 'text-gray-900';
  const borderColorClass = dark ? 'border-gray-700' : 'border-gray-200';
  const titleColor = dark ? 'text-white' : 'text-gray-900';
  const subtitleColor = dark ? 'text-gray-400' : 'text-gray-500';
  
  // Border and glow styles
  const borderStyle = {
    borderColor: borderColorValue,
    borderWidth: '2px',
  };
  
  const glowStyle = glow
    ? {
        boxShadow: `0 0 8px ${borderColorValue}`,
      }
    : {};

  const baseStyles = `rounded-lg ${bgColor} ${textColor} ${borderColorClass} ${shadowStyle} ${pixelatedStyle} transition-all duration-300`;

  return (
    <div
      className={`${baseStyles} ${className}`}
      style={{
        ...borderStyle,
        ...glowStyle,
        ...style,
      }}
      {...props}
    >
      {(title || subtitle) && (
        <div className={`border-b ${borderColorClass} px-4 py-3 sm:px-6`}>
          {title && <h3 className={`text-xl font-bold ${dark ? 'text-yellow-400' : titleColor} ${pixelatedStyle}`}>{title}</h3>}
          {subtitle && <p className={`mt-1 text-sm ${subtitleColor} ${pixelatedStyle}`}>{subtitle}</p>}
        </div>
      )}
      <div className={paddingStyle}>{children}</div>
      {footer && (
        <div className={`border-t ${borderColorClass} px-4 py-3 sm:px-6`}>{footer}</div>
      )}
    </div>
  );
}

