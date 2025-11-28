/**
 * Temp-modul Uppgifter
 * Exportera alla uppgiftsdefinitioner
 */

import type { Task } from '../../../src/types/module/moduleConfig.types.js';
import { exampleTask } from './exampleTask.js';

/**
 * Alla uppgifter för modulen
 */
export const tasks: Task[] = [exampleTask];

export { exampleTask };
