/**
 * Task Working Form Component
 * Form for submitting task answers using type-safe submission components
 */

import { useMemo } from 'react';
import { Button } from '@ui/shared/components/Button.js';
import { Card } from '@ui/shared/components/Card.js';
import { ContainerLayout } from '@ui/shared/components/layouts/index.js';
import { getThemeValue } from '@utils/theme.js';
import { addOpacityToColor } from '@utils/color.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';
import { getSubmissionComponent } from '../submissions/index.js';
import type { TaskSubmissionConfig, TaskSubmission } from '../../../../types/taskTypes.js';

export interface TaskWorkingFormProps {
  /**
   * Task name
   */
  taskName: string;

  /**
   * Task description
   */
  taskDescription?: string;

  /**
   * Submission configuration
   */
  submissionConfig: TaskSubmissionConfig;

  /**
   * Current submission value
   */
  value: TaskSubmission | null;

  /**
   * Whether form is disabled (evaluating)
   */
  isEvaluating: boolean;

  /**
   * Error message to display
   */
  error: string | null;

  /**
   * Callback when submission changes
   */
  onChange: (submission: TaskSubmission) => void;

  /**
   * Callback when form is submitted
   */
  onSubmit: () => void;
}

/**
 * Task Working Form Component
 */
export function TaskWorkingForm({
  taskName,
  taskDescription,
  submissionConfig,
  value,
  isEvaluating,
  error,
  onChange,
  onSubmit,
}: TaskWorkingFormProps) {
  const borderColorValue = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);

  // Get the appropriate submission component
  const SubmissionComponent = useMemo(() => {
    return getSubmissionComponent(submissionConfig.type);
  }, [submissionConfig.type]);

  // Check if submission has value (for submit button)
  const hasValue = useMemo(() => {
    if (!value) return false;
    if (value.type === 'text' && 'text' in value) {
      return (value.text as string).trim().length > 0;
    }
    if (value.type === 'code' && 'code' in value) {
      return (value.code as string).trim().length > 0;
    }
    if (value.type === 'image' && 'image' in value) {
      return value.image !== null && value.image !== '';
    }
    if (value.type === 'multiple_choice' && 'choice' in value) {
      return (value.choice as string).length > 0;
    }
    return false;
  }, [value]);

  // If no component registered, show fallback
  if (!SubmissionComponent) {
    return (
      <ContainerLayout className="max-w-2xl">
        <Card padding="md" dark pixelated borderColor={borderColorValue}>
          <div className="p-4 border-2 rounded" style={{ borderColor: '#ff4444' }}>
            <p className="text-red-400">
              No UI component registered for submission type: {submissionConfig.type}
            </p>
            {submissionConfig.component && (
              <p className="text-xs text-gray-400 mt-2">
                Expected custom component: {submissionConfig.component}
              </p>
            )}
          </div>
        </Card>
      </ContainerLayout>
    );
  }

  return (
    <ContainerLayout className="max-w-2xl">
      <Card
        padding="md"
        dark
        pixelated
        className="animate-scale-in"
        borderColor={borderColorValue}
      >
        <div className="space-y-3">
          {/* Header */}
          <div
            className="pb-2 border-b"
            style={{ borderColor: addOpacityToColor(borderColorValue, 0.3) }}
          >
            <h3 className="!text-yellow-200 text-base font-bold pixelated mb-1.5">
              {taskName}
            </h3>
            {taskDescription && (
              <p className="!text-white text-xs pixelated leading-relaxed">
                {taskDescription}
              </p>
            )}
          </div>

          {/* Type-specific submission component */}
          <SubmissionComponent
            config={submissionConfig}
            value={value}
            onChange={onChange}
            disabled={isEvaluating}
            error={error}
          />

          {/* Submit button */}
          <div
            className="flex justify-end pt-2 border-t"
            style={{ borderColor: addOpacityToColor(borderColorValue, 0.2) }}
          >
            <Button
              variant="primary"
              onClick={onSubmit}
              disabled={!hasValue || isEvaluating}
              loading={isEvaluating}
              size="sm"
              pixelated
            >
              Submit
            </Button>
          </div>
        </div>
      </Card>
    </ContainerLayout>
  );
}
