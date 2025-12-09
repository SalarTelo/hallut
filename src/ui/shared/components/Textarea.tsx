/**
 * Textarea Component
 * Reusable textarea component with label and error states
 */

import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { useThemeBorderColor } from '../hooks/useThemeBorderColor.js';
import { DEFAULT_THEME } from '@config/constants.js';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea label
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
   * Textarea size
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Full width textarea
   */
  fullWidth?: boolean;

  /**
   * Resize behavior
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';

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

const sizeStyles: Record<NonNullable<TextareaProps['size']>, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const resizeStyles: Record<NonNullable<TextareaProps['resize']>, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

/**
 * Textarea component
 */
export function Textarea({
  label,
  error,
  helperText,
  size = 'md',
  fullWidth = false,
  resize = 'vertical',
  pixelated = false,
  borderColor,
  dark = false,
  className = '',
  id,
  rows = 4,
  style,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const borderColorValue = useThemeBorderColor(borderColor, DEFAULT_THEME.BORDER_COLOR);
  const sizeStyle = sizeStyles[size];
  const widthStyle = fullWidth ? 'w-full' : '';
  const pixelatedStyle = pixelated ? 'pixelated' : '';
  const resizeStyle = resizeStyles[resize];
  
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

  const borderStyle = {
    borderColor: error ? undefined : borderColorValue,
    borderWidth: '1px',
    ...(error ? {} : { '--tw-ring-color': borderColorValue }),
    ...style,
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={textareaId} className={`block text-sm font-medium ${labelColor} mb-1 ${pixelatedStyle}`}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`${baseStyles} ${sizeStyle} ${widthStyle} ${resizeStyle} ${placeholderColor} ${className}`}
        style={borderStyle}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className={`mt-1 text-sm ${dark ? 'text-red-400' : 'text-red-600'} ${pixelatedStyle}`} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} ${pixelatedStyle}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

