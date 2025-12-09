/**
 * Input Component
 * Reusable input component with label and error states
 */

import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { useThemeBorderColor } from '../hooks/useThemeBorderColor.js';
import { DEFAULT_THEME } from '@config/constants.js';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label
   */
  label?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Input size
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Full width input
   */
  fullWidth?: boolean;

  /**
   * Left icon
   */
  leftIcon?: ReactNode;

  /**
   * Right icon
   */
  rightIcon?: ReactNode;

  /**
   * Use pixelated font (for game contexts)
   */
  pixelated?: boolean;

  /**
   * Border color (defaults to theme)
   */
  borderColor?: string;

  /**
   * Dark mode (default: false)
   */
  dark?: boolean;
}

const sizeStyles: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

/**
 * Input component
 */
export function Input({
  label,
  error,
  helperText,
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  pixelated = false,
  borderColor,
  dark = false,
  className = '',
  id,
  style,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const borderColorValue = useThemeBorderColor(borderColor, DEFAULT_THEME.BORDER_COLOR);
  const sizeStyle = sizeStyles[size];
  const widthStyle = fullWidth ? 'w-full' : '';
  const pixelatedStyle = pixelated ? 'pixelated' : '';
  
  // Background and text colors based on dark mode
  const bgColor = dark ? 'bg-gray-900' : 'bg-white';
  const textColor = dark ? 'text-gray-100' : 'text-gray-900';
  const placeholderColor = dark ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const borderColorClass = dark ? 'border-gray-700' : 'border-gray-300';
  const labelColor = dark ? 'text-gray-300' : 'text-gray-700';
  
  // Error and focus styles
  const errorStyle = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'focus:ring-2 focus:ring-offset-1';
  
  const baseStyles = `block border rounded-md transition-colors focus:outline-none ${bgColor} ${textColor} ${borderColorClass} ${errorStyle} ${pixelatedStyle}`;
  const iconPadding = leftIcon ? 'pl-10' : '';
  const iconPaddingRight = rightIcon ? 'pr-10' : '';

  const borderStyle = {
    borderColor: error ? undefined : borderColorValue,
    borderWidth: '1px',
    ...(error ? {} : { '--tw-ring-color': borderColorValue }),
    ...style,
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className={`block text-sm font-medium ${labelColor} mb-1 ${pixelatedStyle}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`${baseStyles} ${sizeStyle} ${widthStyle} ${iconPadding} ${iconPaddingRight} ${placeholderColor} ${className}`}
          style={borderStyle}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {rightIcon && (
          <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className={`mt-1 text-sm ${dark ? 'text-red-400' : 'text-red-600'} ${pixelatedStyle}`} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} ${pixelatedStyle}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

