/**
 * Code Submission Component
 * UI component for code-based task submissions
 */

import type { CodeTaskSubmission, CodeSubmissionConfig } from '../../../../types/taskTypes.js';
import type { SubmissionComponentProps } from './registry';
import { getThemeValue } from '@utils/theme.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';

export interface CodeSubmissionProps
  extends SubmissionComponentProps<CodeTaskSubmission> {
  config: CodeSubmissionConfig;
}

export function CodeSubmission({
  config,
  value,
  onChange,
  disabled = false,
  error,
}: CodeSubmissionProps) {
  const borderColor = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);
  const codeValue = value?.code || '';
  const language = config.config?.language || 'javascript';

  const handleChange = (newCode: string) => {
    onChange({
      type: 'code',
      code: newCode,
      language,
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = borderColor;
    e.currentTarget.style.boxShadow = `0 0 8px ${borderColor}`;
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = borderColor;
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-yellow-200 uppercase tracking-wide">
          Your Code
        </label>
        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">{language}</span>
      </div>

      <textarea
        value={codeValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        rows={16}
        className="w-full bg-black border-2 pixelated text-white text-xs p-2.5 rounded font-mono resize-y focus:outline-none focus:ring-2 transition-all placeholder:text-gray-500"
        style={{ borderColor }}
        placeholder={`Write your ${language} code here...`}
        spellCheck={false}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {error && (
        <div className="p-2 border-2 rounded" style={{ borderColor: '#ff4444' }}>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

