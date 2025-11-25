import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  characterCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = true,
      className = '',
      id,
      characterCount = false,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const textareaClasses = [
      'textarea',
      error ? 'textarea-error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div style={{ width: fullWidth ? '100%' : 'auto' }}>
        {label && (
          <label htmlFor={textareaId} className="label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText || characterCount
                ? `${textareaId}-helper`
                : undefined
          }
          {...props}
        />
        {characterCount && maxLength && (
          <div className="helper-text" style={{ textAlign: 'right' }}>
            {currentLength} / {maxLength} characters
          </div>
        )}
        {error && (
          <div id={`${textareaId}-error`} className="error-text" role="alert">
            {error}
          </div>
        )}
        {helperText && !error && (
          <div id={`${textareaId}-helper`} className="helper-text">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

