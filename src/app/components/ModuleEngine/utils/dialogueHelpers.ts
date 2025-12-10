/**
 * Dialogue Helper Utilities
 * Utility functions for dialogue handling
 */

import { createModuleContext } from '@core/module/context.js';
import { getTaskId } from '@core/task/utils.js';
import type { ModuleData } from '@core/module/types/index.js';
import type { ModuleContext } from '@core/module/types/index.js';

/**
 * Create module context with task submission and offer handlers
 */
export function createDialogueContext(
  moduleId: string,
  locale: string,
  moduleData: ModuleData,
  onTaskRequested: (taskId: string) => void,
  onTaskOffer?: (task: import('@core/task/types.js').Task | string) => void
): ModuleContext {
  const baseContext = createModuleContext(moduleId, locale, moduleData);
  return {
    ...baseContext,
    openTaskSubmission: (task: import('@core/task/types.js').Task | string) => {
      const taskId = getTaskId(task);
      onTaskRequested(taskId);
    },
    openTaskOffer: onTaskOffer
      ? (task: import('@core/task/types.js').Task | string) => {
          onTaskOffer(task);
        }
      : undefined,
  };
}

