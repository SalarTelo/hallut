/**
 * Dialogue System
 * Handles all dialogue logic - simple, task-driven approach
 * Returns dialogue data for components to render
 */

import type { DialogueConfig } from '../types/dialogue.types.js';
import type { ModuleData, Task } from '../types/module.types.js';
import type { DialogueContext } from '../types/dialogue.types.js';
import type { Interactable } from '../types/interactable.types.js';
import { createDialogueContext } from './DialogueContext.js';
import { useModuleStore } from '../store/moduleStore.js';
import { moduleActions } from '../store/moduleActions.js';

/**
 * Dialogue data returned by system
 */
export interface DialogueData {
  type: 'greeting' | 'task_offer' | 'active_task_check' | 'completion';
  speaker: string;
  lines: string[];
  choices?: Array<{
    id: string;
    text: string;
    handler: () => void;
  }>;
  onComplete?: () => void;
}

export class DialogueSystem {
  /**
   * Get dialogue data for an interactable
   * Automatically determines what to show based on state
   */
  static getDialogueData(
    dialogueConfig: DialogueConfig,
    moduleId: string,
    interactableId: string,
    onClose: () => void
  ): DialogueData | null {
    const store = useModuleStore.getState();
    const module = store.currentModule;
    if (!module) return null;
    
    const interactable = module.config.interactables.find(i => i.id === interactableId);
    if (!interactable) return null;
    
    const context = createDialogueContext(moduleId, interactable);
    
    // Check if greeting should be shown
    const greetingId = `${moduleId}_welcome`;
    if (!context.hasSeenGreeting(greetingId) && dialogueConfig.greeting.length > 0) {
      // Mark greeting as seen
      context.markGreetingSeen(greetingId);
      
      // Return greeting dialogue
      return {
        type: 'greeting',
        speaker: dialogueConfig.speaker,
        lines: dialogueConfig.greeting,
        onComplete: () => {
          // After greeting, show task dialogue
          const taskDialogue = this.getTaskDialogue(moduleId, interactable, context, onClose);
          if (taskDialogue) {
            // This will be handled by the component - it will call getDialogueData again
            onClose();
          }
        },
      };
    }
    
    // No greeting or already seen, show task dialogue
    return this.getTaskDialogue(moduleId, interactable, context, onClose);
  }
  
  /**
   * Get task-related dialogue
   * Automatically routes to task offer or active task check
   */
  private static getTaskDialogue(
    moduleId: string,
    interactable: Interactable,
    context: DialogueContext,
    onClose: () => void
  ): DialogueData | null {
    const store = useModuleStore.getState();
    const module = store.currentModule;
    if (!module) return null;
    
    const currentTaskId = context.getModuleStateField('currentTaskId');
    
    if (currentTaskId && !context.isTaskCompleted(currentTaskId)) {
      // Has active task - show active task check
      const task = module.tasks.find(t => t.id === currentTaskId);
      if (task) {
        return this.getActiveTaskCheck(task, context, moduleId, onClose);
      }
    } else {
      // No active task - offer next sequential task
      const nextTask = this.findNextSequentialTask(module, context);
      if (nextTask) {
        return this.getTaskOffer(nextTask, context, onClose);
      } else {
        // All tasks complete
        return this.getCompletion(context, onClose);
      }
    }
    
    return null;
  }
  
  /**
   * Get task offer dialogue data
   */
  private static getTaskOffer(
    task: Task,
    context: DialogueContext,
    onClose: () => void
  ): DialogueData {
    const dialogue = task.offerDialogue || {
      lines: [
        `Jag behöver hjälp med ${task.name}.`,
        'Kan du hjälpa mig?'
      ],
      acceptText: 'Ja, det kan jag göra',
    };
    
    return {
      type: 'task_offer',
      speaker: context.interactable.id,
      lines: dialogue.lines,
      choices: [
        {
          id: 'accept',
          text: dialogue.acceptText || 'Ja, det kan jag göra',
          handler: () => {
            context.acceptTask(task.id);
            onClose();
          },
        },
        {
          id: 'decline',
          text: 'Inte just nu',
          handler: () => {
            onClose();
          },
        },
      ],
    };
  }
  
  /**
   * Get active task check dialogue data
   */
  private static getActiveTaskCheck(
    task: Task,
    context: DialogueContext,
    moduleId: string,
    onClose: () => void
  ): DialogueData {
    const dialogue = task.activeDialogue || {
      lines: [
        `Hur går det med ${task.name}?`,
        'Är du redo att lämna in?'
      ],
      readyText: 'Ja, jag är redo',
      notReadyText: 'Inte ännu',
    };
    
    return {
      type: 'active_task_check',
      speaker: context.interactable.id,
      lines: dialogue.lines,
      choices: [
        {
          id: 'ready',
          text: dialogue.readyText || 'Ja, jag är redo',
          handler: () => {
            // Set ready to submit
            moduleActions.setReadyToSubmit(moduleId, true);
            // Set submission type from task
            moduleActions.setSubmissionType(
              moduleId,
              task.submission.type,
              task.submission.component,
              task.submission.config
            );
            
            // Call custom handler if provided
            dialogue.onReady?.(context);
            
            onClose();
          },
        },
        {
          id: 'not_ready',
          text: dialogue.notReadyText || 'Inte ännu',
          handler: () => {
            // Call custom handler if provided
            dialogue.onNotReady?.(context);
            
            onClose();
          },
        },
      ],
    };
  }
  
  /**
   * Get completion dialogue data
   */
  private static getCompletion(
    context: DialogueContext,
    onClose: () => void
  ): DialogueData {
    return {
      type: 'completion',
      speaker: context.interactable.id,
      lines: [
        'Fantastiskt arbete!',
        'Du har klarat alla uppgifter.',
        'Tack för din hjälp!'
      ],
      onComplete: onClose,
    };
  }
  
  /**
   * Find next sequential task
   */
  private static findNextSequentialTask(
    module: ModuleData,
    context: DialogueContext
  ): Task | null {
    const completedTasks = context.moduleState.completedTasks || [];
    
    return module.tasks
      .sort((a, b) => a.order - b.order)
      .find(task => !completedTasks.includes(task.id)) || null;
  }
}

