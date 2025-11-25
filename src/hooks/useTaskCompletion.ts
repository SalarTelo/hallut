/**
 * Hook for task completion logic
 */

import { useCallback } from 'react';
import type { EvaluationResponse } from '../types/module.types.js';
import { useModuleStore, useModuleActions } from '../store/moduleStore.js';
import { moduleActions } from '../store/moduleActions.js';

/**
 * Hook for managing task completion state
 */
export function useTaskCompletion() {
  const currentModuleId = useModuleStore((state) => state.currentModuleId);
  const moduleProgress = useModuleStore((state) => 
    currentModuleId ? state.getProgress(currentModuleId) : null
  );
  const moduleState = moduleProgress?.state || {};

  /**
   * Mark a task as completed
   */
  const markTaskComplete = useCallback((taskId: string) => {
    if (currentModuleId) {
      moduleActions.completeTask(currentModuleId, taskId);
    }
  }, [currentModuleId]);

  /**
   * Check if a task is completed
   */
  const isTaskCompleted = useCallback((taskId: string): boolean => {
    const completedTasks = moduleState.completedTasks || [];
    return completedTasks.includes(taskId);
  }, [moduleState.completedTasks]);

  /**
   * Store task submission and evaluation
   */
  const storeTaskSubmission = useCallback((answer: string, evaluation: EvaluationResponse) => {
    if (currentModuleId) {
      moduleActions.setModuleStateField(currentModuleId, 'lastSubmission', answer);
      moduleActions.setModuleStateField(currentModuleId, 'lastEvaluation', evaluation);
    }
  }, [currentModuleId]);

  /**
   * Set current task ID
   */
  const setCurrentTaskId = useCallback((taskId: string) => {
    if (currentModuleId) {
      moduleActions.acceptTask(currentModuleId, taskId);
    }
  }, [currentModuleId]);

  /**
   * Mark story as ready
   */
  const setStoryReady = useCallback((ready: boolean) => {
    if (currentModuleId) {
      moduleActions.setModuleStateField(currentModuleId, 'hasStoryReady', ready);
    }
  }, [currentModuleId]);

  /**
   * Get guard state based on task completion
   */
  const getGuardState = useCallback((taskId?: string): 'initial' | 'ready-to-submit' | 'task-complete' => {
    if (!taskId) return 'initial';
    
    const completedTasks = moduleState.completedTasks || [];
    if (completedTasks.includes(taskId)) {
      return 'task-complete';
    }
    
    const hasStoryReady = moduleState.hasStoryReady || false;
    if (hasStoryReady) {
      return 'ready-to-submit';
    }
    
    return 'initial';
  }, [moduleState]);

  return {
    markTaskComplete,
    isTaskCompleted,
    storeTaskSubmission,
    setCurrentTaskId,
    setStoryReady,
    getGuardState,
    completedTasks: moduleState.completedTasks || [],
    currentTaskId: moduleState.currentTaskId,
  };
}

