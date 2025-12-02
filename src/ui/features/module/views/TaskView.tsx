/**
 * Task View
 * Displays task interface for submission
 */

import { useState } from 'react';
import type { Task, TaskSubmission } from '@core/types/task.js';
import { validateTask } from '@core/services/task.js';
import { actions } from '@core/state/actions.js';
import { Card } from '@ui/shared/components/Card.js';
import { Button } from '@ui/shared/components/Button.js';
import { Textarea } from '@ui/shared/components/Textarea.js';
import { Badge } from '../../../shared/components/Badge.js';

export interface TaskViewProps {
  task: Task;
  moduleId: string;
  onComplete: () => void;
  onClose: () => void;
}

/**
 * Task View component
 */
export function TaskView({ task, moduleId, onComplete, onClose }: TaskViewProps) {
  const [submission, setSubmission] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ solved: boolean; details: string } | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const taskSubmission: TaskSubmission = {
        type: 'text',
        text: submission,
      };

      const validationResult = validateTask(task, taskSubmission);
      setResult({
        solved: validationResult.solved,
        details: validationResult.details,
      });

      if (validationResult.solved) {
        actions.completeTask(moduleId, task);
        // Check if module is complete and unlock dependents
        const { evaluateModuleCompletion } = await import('../../../../core/services/unlockService.js');
        await evaluateModuleCompletion(moduleId);
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
        <Textarea
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder="Enter your answer here..."
          rows={10}
          className="w-full"
        />
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
          disabled={submitting || !submission.trim()}
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

