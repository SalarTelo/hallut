/**
 * Dialogue trees for text-generation module
 * These are loaded by the module registry and used by InteractableHandler
 * 
 * Dialogues can define onResponse handlers that receive:
 * - response: string (the choice selected)
 * - context: { setModuleStateField, moduleState, moduleData, interactable, locale }
 */

import { getTranslations } from './translations.js';

// Default dialogues for Swedish (module registry loads this)
const t = getTranslations('sv');

// Helper to find next task for guard
function findNextTask(moduleData: any, completedTasks: string[]): string | null {
  if (!moduleData?.tasks) return null;
  const guardTasks = ['task-1', 'task-2', 'task-3'];
  const nextTask = moduleData.tasks
    .filter((t: any) => guardTasks.includes(t.id))
    .sort((a: any, b: any) => a.order - b.order)
    .find((t: any) => !completedTasks.includes(t.id));
  return nextTask?.id || null;
}

// Base guard intro dialogue with manual onResponse handler
export const dialogues = {
  guard_intro: {
    speaker: 'guard',
    lines: t.dialogues.guard_intro.lines,
    choices: ['Acceptera', 'Avböj'], // Swedish default
    // Manual onResponse handler - you control what each choice does
    onResponse: (response: string, context: any) => {
      const { setModuleStateField, moduleState, moduleData, locale } = context;
      const acceptText = locale === 'sv' ? 'Acceptera' : 'Accept';
      
      if (response === acceptText) {
        // Accept: find and set next task
        const completedTasks = moduleState.completedTasks || [];
        const nextTaskId = findNextTask(moduleData, completedTasks);
        if (nextTaskId) {
          setModuleStateField('currentTaskId', nextTaskId);
        }
      }
      // Decline: do nothing, dialogue will just close
    },
  },
} as const;

export type DialogueId = keyof typeof dialogues;

// Function to get dialogues for a specific locale (for module registry)
export function getDialogues(locale: string = 'sv') {
  const translations = getTranslations(locale);
  
  return {
    guard_intro: {
      speaker: 'guard',
      lines: translations.dialogues.guard_intro.lines,
      choices: locale === 'sv' ? ['Acceptera', 'Avböj'] : ['Accept', 'Decline'],
      // onResponse will be the same function, it uses context.locale
      onResponse: dialogues.guard_intro.onResponse,
    },
  };
}
