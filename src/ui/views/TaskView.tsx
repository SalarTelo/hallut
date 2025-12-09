/**
 * Task View
 * Displays task interface for submission
 * 
 * Provides a UI for users to complete tasks, supporting:
 * - Text submissions (free-form answers)
 * - Multiple choice questions
 * - Task validation and feedback
 * - Progress tracking
 * 
 * @example
 * ```tsx
 * <TaskView
 *   task={task}
 *   moduleId="example-1"
 *   onComplete={handleTaskComplete}
 *   onClose={handleClose}
 * />
 * ```
 */

import { useState } from 'react';
import type { Task, TaskSubmission } from '@core/task/types.js';
import { validateTask } from '@core/task/validation.js';
import { actions } from '@core/state/actions.js';
import { Card } from '@ui/shared/components/primitives/index.js';
import { Button } from '@ui/shared/components/primitives/index.js';
import { Textarea } from '@ui/shared/components/primitives/index.js';
import { Badge } from '@ui/shared/components/primitives/index.js';

export interface TaskViewProps {
  /**
   * Task to display
   */
  task: Task;

  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Callback when task is completed successfully
   */
  onComplete: () => void;

  /**
   * Callback when task view is closed
   */
  onClose: () => void;
}

/**
 * Task View component
 */
export function TaskView({ task, moduleId, onComplete, onClose }: TaskViewProps) {
  const [textSubmission, setTextSubmission] = useState<string>('');
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ solved: boolean; details: string } | null>(null);

  const isMultipleChoice = task.submission.type === 'multiple_choice';
  const choices = isMultipleChoice ? (task.submission.config?.options as string[] || []) : [];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const taskSubmission: TaskSubmission = isMultipleChoice
        ? {
            type: 'multiple_choice',
            choice: selectedChoice,
          }
        : {
            type: 'text',
            text: textSubmission,
          };

      const validationResult = validateTask(task, taskSubmission);
      setResult({
        solved: validationResult.solved,
        details: validationResult.details,
      });

      if (validationResult.solved) {
        // Mark task as complete
        actions.completeTask(moduleId, task);
        
        // Check if module is complete and unlock dependents
        const { evaluateModuleCompletion } = await import('@core/unlock/service.js');
        await evaluateModuleCompletion(moduleId);
        
        // Wait a bit for state to update, then call onComplete
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card padding="lg" dark pixelated className="max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-4">{task.name}</h2>
      <p className="text-gray-300 mb-4">{task.description}</p>

      {task.overview && (
        <div className="mb-4">
          {task.overview.requirements && (
            <p className="text-sm text-gray-400 mb-2">
              <strong>Requirements:</strong> {task.overview.requirements}
            </p>
          )}
          {task.overview.goals && task.overview.goals.length > 0 && (
            <div className="mb-2">
              <strong className="text-sm text-gray-400">Goals:</strong>
              <ul className="list-disc list-inside text-sm text-gray-400 ml-4">
                {task.overview.goals.map((goal, i) => (
                  <li key={i}>{goal}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        {isMultipleChoice ? (
          <div className="space-y-2">
            {choices.map((choice, index) => (
              <label
                key={index}
                className={`flex items-center p-3 rounded border cursor-pointer transition-all ${
                  selectedChoice === choice
                    ? 'bg-gray-700 border-yellow-400'
                    : 'bg-gray-800/60 border-gray-600 hover:bg-gray-700/80 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="task-choice"
                  value={choice}
                  checked={selectedChoice === choice}
                  onChange={(e) => setSelectedChoice(e.target.value)}
                  className="mr-3 w-4 h-4 text-yellow-400 focus:ring-yellow-400 focus:ring-2"
                />
                <span className="text-gray-200">{choice}</span>
              </label>
            ))}
          </div>
        ) : (
          <Textarea
            value={textSubmission}
            onChange={(e) => setTextSubmission(e.target.value)}
            placeholder="Enter your answer here..."
            rows={10}
            className="w-full"
          />
        )}
      </div>

      {result && (
        <div className="mb-4">
          <Badge variant={result.solved ? 'success' : 'danger'}>
            {result.solved ? '✓ Success!' : '✗ Try Again'}
          </Badge>
          <p className="mt-2 text-sm">{result.details}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="primary"
          pixelated
          onClick={handleSubmit}
          disabled={submitting || (isMultipleChoice ? !selectedChoice : !textSubmission.trim())}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
        <Button variant="secondary" pixelated onClick={onClose}>
          Close
        </Button>
      </div>
    </Card>
  );
}
