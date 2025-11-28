/**
 * useTaskSubmission Hook
 * Manages task submission state and logic
 */

import { useState, useEffect, useCallback } from 'react';
import { evaluateTaskSubmission, validateTaskSubmission } from '@services/taskService.js';
import { useTaskStore } from '@stores/taskStore.js';
import type { Task } from '@types/module/moduleConfig.types.js';
import type { TaskSubmission } from '@types/module/task.types.js';
import type { TaskSolveResult } from '@types/core/taskSolveResult.types.js';

/**
 * Task submission state
 */
export type TaskState = 'idle' | 'offered' | 'accepted' | 'working' | 'evaluating' | 'evaluated' | 'completed';

export interface UseTaskSubmissionOptions {
  /**
   * Task to submit
   */
  task: Task;

  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Skip directly to working state
   */
  skipToWorking?: boolean;

  /**
   * Callback when task is completed
   */
  onComplete?: (result: { solved: boolean; reason: string }) => void;

  /**
   * Callback when task is accepted
   */
  onAccept?: () => void;
}

export interface UseTaskSubmissionReturn {
  /**
   * Current state
   */
  state: TaskState;

  /**
   * Current submission value
   */
  submissionValue: string;

  /**
   * Evaluation result (if evaluated)
   */
  result: TaskSolveResult | null;

  /**
   * Error message
   */
  error: string | null;

  /**
   * Accept the task
   */
  handleAccept: () => void;

  /**
   * Start working on the task
   */
  handleStartWorking: () => void;

  /**
   * Update submission value
   */
  handleSubmissionChange: (value: string) => void;

  /**
   * Submit the task
   */
  handleSubmit: () => void;

  /**
   * Continue after evaluation (mark as completed)
   */
  handleContinue: () => void;
}

/**
 * Hook for managing task submission state
 */
export function useTaskSubmission({
  task,
  moduleId,
  skipToWorking = false,
  onComplete,
  onAccept,
}: UseTaskSubmissionOptions): UseTaskSubmissionReturn {
  const [state, setState] = useState<TaskState>('idle');
  const [submission, setSubmission] = useState<TaskSubmission | null>(null);
  const [submissionValue, setSubmissionValue] = useState('');
  const [result, setResult] = useState<TaskSolveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentTask, setCurrentSubmission, submitTask } = useTaskStore();

  // Initialize task when component mounts
  useEffect(() => {
    if (state === 'idle') {
      setCurrentTask(moduleId, task.id);
      if (skipToWorking) {
        setState('working');
      } else {
        setState('offered');
      }
    }
  }, [task.id, moduleId, state, setCurrentTask, skipToWorking]);

  // Handle task acceptance
  const handleAccept = useCallback(() => {
    setState('working');
    onAccept?.();
  }, [onAccept]);

  // Handle starting work
  const handleStartWorking = useCallback(() => {
    setState('working');
  }, []);

  // Handle submission change
  const handleSubmissionChange = useCallback((value: string) => {
    setError(null);
    setSubmissionValue(value);
    
    const newSubmission: TaskSubmission = {
      type: task.submission.type,
      ...(task.submission.type === 'text' && { text: value }),
      ...(task.submission.type === 'code' && { code: value }),
    };
    setSubmission(newSubmission);
    setCurrentSubmission(newSubmission);
  }, [task.submission.type, setCurrentSubmission]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!submission) {
      setError('Please provide a submission');
      return;
    }

    // Validate submission
    if (!validateTaskSubmission(submission, task.submission.type)) {
      setError('Invalid submission format');
      return;
    }

    // Evaluate task
    setState('evaluating');
    const evaluationResult = evaluateTaskSubmission(task.solveFunction, submission);
    setResult(evaluationResult);
    setState('evaluated');

    // Store submission
    submitTask(moduleId, task.id, submission, evaluationResult);

    // Handle completion
    if (evaluationResult.solved) {
      // Don't auto-complete, wait for user to click continue
    } else {
      setError(evaluationResult.reason || 'Task not solved');
      // Allow user to try again - go back to working state
      setState('working');
    }
  }, [submission, task.submission.type, task.solveFunction, task.id, moduleId, submitTask]);

  // Handle continue after evaluation
  const handleContinue = useCallback(() => {
    setState('completed');
    onComplete?.({ solved: true, reason: result?.reason || '' });
  }, [onComplete, result?.reason]);

  return {
    state,
    submissionValue,
    result,
    error,
    handleAccept,
    handleStartWorking,
    handleSubmissionChange,
    handleSubmit,
    handleContinue,
  };
}

