/**
 * Task Store
 * Manages task state, submissions, and evaluations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaskSubmission } from '../types/module/task.types.js';
import type { TaskSolveResult } from '../types/core/taskSolveResult.types.js';

/**
 * Task submission record
 */
interface TaskSubmissionRecord {
  taskId: string;
  moduleId: string;
  submission: TaskSubmission;
  result: TaskSolveResult;
  submittedAt: number;
}

/**
 * Task store state
 */
interface TaskStoreState {
  // Task submissions (persisted)
  submissions: Record<string, TaskSubmissionRecord[]>; // key: moduleId, value: array of submissions

  // Current task submission (not persisted)
  currentSubmission: TaskSubmission | null;
  currentTaskId: string | null;
  currentModuleId: string | null;

  // Actions
  setCurrentTask: (moduleId: string, taskId: string) => void;
  setCurrentSubmission: (submission: TaskSubmission) => void;
  submitTask: (moduleId: string, taskId: string, submission: TaskSubmission, result: TaskSolveResult) => void;
  getSubmissions: (moduleId: string, taskId?: string) => TaskSubmissionRecord[];
  clearCurrentTask: () => void;
}

/**
 * Create the task store with persistence
 */
export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      submissions: {},
      currentSubmission: null,
      currentTaskId: null,
      currentModuleId: null,

      // Set current task
      setCurrentTask: (moduleId, taskId) => {
        set({ currentModuleId: moduleId, currentTaskId: taskId });
      },

      // Set current submission
      setCurrentSubmission: (submission) => {
        set({ currentSubmission: submission });
      },

      // Submit a task
      submitTask: (moduleId, taskId, submission, result) => {
        const moduleSubmissions = get().submissions[moduleId] || [];
        const newSubmission: TaskSubmissionRecord = {
          taskId,
          moduleId,
          submission,
          result,
          submittedAt: Date.now(),
        };

        set({
          submissions: {
            ...get().submissions,
            [moduleId]: [...moduleSubmissions, newSubmission],
          },
          currentSubmission: null,
        });
      },

      // Get submissions for a module/task
      getSubmissions: (moduleId, taskId) => {
        const moduleSubmissions = get().submissions[moduleId] || [];
        if (taskId) {
          return moduleSubmissions.filter((s) => s.taskId === taskId);
        }
        return moduleSubmissions;
      },

      // Clear current task
      clearCurrentTask: () => {
        set({ currentTaskId: null, currentModuleId: null, currentSubmission: null });
      },
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        // Persist submissions only
        submissions: state.submissions,
      }),
    }
  )
);

/**
 * Selector hooks
 */
export const useCurrentTask = () =>
  useTaskStore((state) => ({
    moduleId: state.currentModuleId,
    taskId: state.currentTaskId,
    submission: state.currentSubmission,
  }));

export const useTaskSubmissions = (moduleId: string, taskId?: string) =>
  useTaskStore((state) => state.getSubmissions(moduleId, taskId));

