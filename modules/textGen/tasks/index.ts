/**
 * Exempelmodul Uppgifter
 * Exportera alla uppgiftsdefinitioner
 */

import type { Task } from '../../../src/types/module/moduleConfig.types.js';
import { storyTask } from './storyTask.js';
import { recipeTask } from './recipeTask.js';

/**
 * Alla uppgifter för exempelmodulen
 */
export const tasks: Task[] = [storyTask, recipeTask];

export { storyTask, recipeTask };
