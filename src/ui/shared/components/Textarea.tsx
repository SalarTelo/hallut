/**
 * Textarea Component
 * Reusable textarea component with label and error states
 */

import type { TextareaHTMLAttributes } from 'react';

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
  className = '',
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const baseStyles = 'block border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
  const sizeStyle = sizeStyles[size];
  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyle = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const resizeStyle = resizeStyles[resize];

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`${baseStyles} ${sizeStyle} ${widthStyle} ${errorStyle} ${resizeStyle} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

