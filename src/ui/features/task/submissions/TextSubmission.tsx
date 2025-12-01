/**
 * Text Submission Component
 * UI component for text-based task submissions
 */

import { useMemo } from 'react';
import type { TextTaskSubmission, TextSubmissionConfig } from '../../../../types/taskTypes.js';
import type { SubmissionComponentProps } from './registry';
import { getThemeValue } from '@utils/theme.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';

export interface TextSubmissionProps
  extends SubmissionComponentProps<TextTaskSubmission> {
  config: TextSubmissionConfig;
}

export function TextSubmission({
  config,
  value,
  onChange,
  disabled = false,
  error,
}: TextSubmissionProps) {
  const borderColor = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);
  const textValue = value?.text || '';

  const minLength = config.config?.minLength;
  const maxLength = config.config?.maxLength;
  const placeholder = config.config?.placeholder || 'Write your answer here...';
  const multiline = config.config?.multiline !== false; // Default true

  const handleChange = (newText: string) => {
    onChange({
      type: 'text',
      text: newText,
    });
  };

  const characterCount = textValue.length;
  const isValidLength =
    (!minLength || characterCount >= minLength) &&
    (!maxLength || characterCount <= maxLength);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.currentTarget.style.borderColor = borderColor;
    e.currentTarget.style.boxShadow = `0 0 8px ${borderColor}`;
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.currentTarget.style.borderColor = isValidLength ? borderColor : '#ff4444';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-yellow-200 uppercase tracking-wide mb-1.5">
        Your Answer
      </label>

      {multiline ? (
        <textarea
          value={textValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          rows={8}
          maxLength={maxLength}
          className="w-full bg-black border-2 pixelated text-white text-xs p-2.5 rounded focus:outline-none focus:ring-2 transition-all placeholder:text-gray-500 resize-y"
          style={{
            borderColor: isValidLength ? borderColor : '#ff4444',
            minHeight: '120px',
          }}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : (
        <input
          type="text"
          value={textValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          maxLength={maxLength}
          className="w-full bg-black border-2 pixelated text-white text-xs p-2.5 rounded focus:outline-none focus:ring-2 transition-all placeholder:text-gray-500"
          style={{
            borderColor: isValidLength ? borderColor : '#ff4444',
          }}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}

      {/* Character count and validation */}
      <div className="flex justify-between items-center text-xs">
        <div>
          {minLength && characterCount < minLength && (
            <span className="text-red-400">
              Minimum {minLength} characters required ({characterCount}/{minLength})
            </span>
          )}
          {maxLength && characterCount > maxLength && (
            <span className="text-red-400">
              Maximum {maxLength} characters ({characterCount}/{maxLength})
            </span>
          )}
          {isValidLength && minLength && (
            <span className="text-green-400">✓ {characterCount} characters</span>
          )}
        </div>
        {maxLength && (
          <span className="text-gray-500">
            {characterCount}/{maxLength}
          </span>
        )}
      </div>

      {error && (
        <div className="p-2 border-2 rounded" style={{ borderColor: '#ff4444' }}>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

