/**
 * Text Generation Module
 * Main module definition using TypeScript
 */

import { InteractableType, InteractableActionType } from '../../src/types/interactable.types.js';
import type { Interactable } from '../../src/types/interactable.types.js';
import type { ModuleConfig, Task } from '../../src/types/module.types.js';
import { task1_solve, task2_solve, task3_solve } from './taskSolvers.js';
import { getTranslations } from './translations.js';

export function createModule(locale: string = 'sv'): ModuleConfig {
  const t = getTranslations(locale);
  
  // Define tasks
  const tasks: Task[] = [
    {
      id: 'task-1',
      order: 1,
      name: t.tasks.task1.name,
      description: t.tasks.task1.description,
      solveFunction: task1_solve,
      submission: {
        type: 'text',
        config: {
          minLength: 100,  // Minimum word count enforced in solver
        },
      },
      offerDialogue: {
        lines: t.tasks.task1.intro.lines,
        acceptText: 'Ja, det kan jag göra',
      },
      activeDialogue: {
        lines: [
          'Hur går det med berättelsen?',
          'Är du redo att lämna in?',
        ],
        readyText: 'Ja, jag är redo',
        notReadyText: 'Inte ännu',
      },
      overview: {
        requirements: t.tasks.task1.description,
        goals: [],
      },
    },
    {
      id: 'task-2',
      order: 2,
      name: t.tasks.task2.name,
      description: t.tasks.task2.description,
      solveFunction: task2_solve,
      submission: {
        type: 'text',
        config: {
          minLength: 50,  // Minimum word count enforced in solver
        },
      },
      offerDialogue: {
        lines: t.tasks.task2.intro.lines,
        acceptText: 'Ja, det kan jag göra',
      },
      activeDialogue: {
        lines: [
          'Har du tittat i kylskåpet?',
          'Är du redo att ge mig ditt förslag?',
        ],
        readyText: 'Ja, jag är redo',
        notReadyText: 'Inte ännu',
      },
      overview: {
        requirements: t.tasks.task2.description,
        goals: [],
      },
    },
    {
      id: 'task-3',
      order: 3,
      name: t.tasks.task3.name,
      description: t.tasks.task3.description,
      solveFunction: task3_solve,
      submission: {
        type: 'text',
        config: {
          minLength: 50,  // Minimum word count enforced in solver
        },
      },
      offerDialogue: {
        lines: t.tasks.task3.intro.lines,
        acceptText: 'Ja, det kan jag göra',
      },
      activeDialogue: {
        lines: [
          'Har du tänkt på frågan?',
          'Är du redo att dela med dig av din reflektion?',
        ],
        readyText: 'Ja, jag är redo',
        notReadyText: 'Inte ännu',
      },
      overview: {
        requirements: t.tasks.task3.description,
        goals: [],
      },
    },
  ];
  
  // Define interactables
  const interactables: Interactable[] = [
    {
      id: 'guard',
      type: InteractableType.NPC,
      name: t.interactables.guard.name,
      position: { x: 30, y: 60 },
      avatar: '🛡️',
      locked: false,
      unlockRequirement: null,
      action: {
        type: InteractableActionType.Dialogue,
        dialogue: 'guard_intro',
      },
      // Guard gives all tasks
      tasks: ['task-1', 'task-2', 'task-3'],
    },
    {
      id: 'ai-companion',
      type: InteractableType.NPC,
      name: t.interactables.aiCompanion.name,
      position: { x: 70, y: 40 },
      avatar: '🤖',
      locked: false,
      unlockRequirement: null,
      action: {
        type: InteractableActionType.Component,
        component: 'AiChatModal',
      },
    },
    {
      id: 'fridge',
      type: InteractableType.Object,
      name: t.interactables.fridge.name,
      position: { x: 50, y: 80 },
      avatar: '🧊',
      locked: true,
      unlockRequirement: {
        type: 'task',
        task: 'task-1',
        message: 'Klara uppgift 1 först',
      },
      action: {
        type: InteractableActionType.Component,
        component: 'FridgeModal',
      },
    },
  ];
  
  return {
    manifest: {
      id: 'text-generation',
      name: t.manifest.name,
      version: '1.0.0',
    },
    background: {
      color: '#2d3748',
      image: null,
    },
    welcome: {
      speaker: 'guard',
      lines: t.welcome.lines,
    },
    interactables,
    tasks,
  };
}

// Default export for default locale
export const module = createModule('sv');
