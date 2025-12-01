/**
 * Multiple Choice Submission Component
 * UI component for multiple choice task submissions
 */

import type {
  MultipleChoiceTaskSubmission,
  MultipleChoiceSubmissionConfig,
} from '../../../../types/taskTypes.js';
import type { SubmissionComponentProps } from './registry';
import { getThemeValue } from '@utils/theme.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';

export interface MultipleChoiceSubmissionProps
  extends SubmissionComponentProps<MultipleChoiceTaskSubmission> {
  config: MultipleChoiceSubmissionConfig;
}

export function MultipleChoiceSubmission({
  config,
  value,
  onChange,
  disabled = false,
  error,
}: MultipleChoiceSubmissionProps) {
  const borderColor = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);
  const options = config.config?.options || [];
  const allowMultiple = config.config?.allowMultiple || false;
  const selectedChoice = value?.choice || '';

  const handleChange = (choice: string) => {
    onChange({
      type: 'multiple_choice',
      choice,
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-yellow-200 uppercase tracking-wide mb-1.5">
        Select Answer
      </label>

      <div className="space-y-2">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center p-3 border-2 rounded cursor-pointer hover:bg-gray-900 transition-colors"
            style={{
              borderColor: selectedChoice === option ? borderColor : 'transparent',
              backgroundColor:
                selectedChoice === option ? `${borderColor}20` : 'transparent',
            }}
          >
            <input
              type={allowMultiple ? 'checkbox' : 'radio'}
              name="multiple-choice"
              value={option}
              checked={selectedChoice === option}
              onChange={(e) => handleChange(e.target.value)}
              disabled={disabled}
              className="mr-3"
            />
            <span className="text-sm text-white">{option}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="p-2 border-2 rounded" style={{ borderColor: '#ff4444' }}>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

