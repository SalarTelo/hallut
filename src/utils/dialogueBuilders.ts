/**
 * Dialogue Builder Helpers
 * Type-safe helpers for creating dialogue configurations
 */

import type { DialogueChoice, DialogueCompletionAction } from '../types/dialogue.types.js';
import type { ModuleConfig } from '../types/module/moduleConfig.types.js';

// ============================================================================
// Action Builders
// ============================================================================

/**
 * Create an "accept task" action
 * Used when a dialogue choice should start a task
 * 
 * @example
 * choice('Yes, I\'ll help', acceptTask('task-1'))
 */
export function acceptTask(taskId: string): DialogueCompletionAction {
  return { type: 'accept-task', taskId };
}

/**
 * Create a "set state" action
 * Used to set a value in module state
 * 
 * @example
 * choice('Not now', setState('declined', true))
 */
export function setState(key: string, value: unknown): DialogueCompletionAction {
  return { type: 'set-state', key, value };
}

/**
 * Create a "function" action
 * Used to call a custom function handler
 * 
 * @example
 * choice('Submit', callFunction('submit-task'))
 */
export function callFunction(functionName: string): DialogueCompletionAction {
  return { type: 'function', functionName };
}

// ============================================================================
// Choice Builders
// ============================================================================

/**
 * Create a dialogue choice
 * 
 * @param text - The text to display for the choice
 * @param action - Action(s) to perform when selected, or null to just continue
 * 
 * @example
 * // Simple continue choice
 * choice('Continue')
 * 
 * // Choice with action
 * choice('Accept the task', acceptTask('task-1'))
 * 
 * // Choice with multiple actions
 * choice('Accept and remember', [acceptTask('task-1'), setState('accepted', true)])
 */
export function choice(
  text: string,
  action: DialogueCompletionAction | DialogueCompletionAction[] | null = null
): DialogueChoice {
  return { text, action };
}

/**
 * Create a simple "Continue" choice with no action
 * 
 * @example
 * choices: [continueChoice()]
 */
export function continueChoice(text: string = 'Continue'): DialogueChoice {
  return choice(text, null);
}

// ============================================================================
// Dialogue Builders
// ============================================================================

/**
 * Dialogue definition options
 */
export interface DialogueOptions {
  /** Speaker name (usually matches an interactable ID) */
  speaker: string;
  /** Lines of dialogue to display */
  lines: string[];
  /** Choices to show at the end */
  choices?: DialogueChoice[];
  /** Action(s) to perform when dialogue completes (if no choices) */
  onComplete?: DialogueCompletionAction | DialogueCompletionAction[];
}

/**
 * Dialogue entry for the dialogues record
 */
export type DialogueEntry = NonNullable<ModuleConfig['dialogues']>[string];

/**
 * Create a dialogue definition
 * 
 * @param options - Dialogue configuration
 * @returns Dialogue entry object
 * 
 * @example
 * const guardGreeting = createDialogue({
 *   speaker: 'guard',
 *   lines: ['Halt! Who goes there?', 'State your business.'],
 *   choices: [
 *     choice('I\'m here to help', acceptTask('task-1')),
 *     choice('Just passing through')
 *   ]
 * });
 */
export function createDialogue(options: DialogueOptions): DialogueEntry {
  const { speaker, lines, choices, onComplete } = options;

  const dialogue: DialogueEntry = {
    speaker,
    lines,
  };

  if (choices && choices.length > 0) {
    dialogue.choices = choices;
  }

  if (onComplete) {
    dialogue.onComplete = onComplete;
  }

  return dialogue;
}

/**
 * Create a simple dialogue with just lines and optional continue choice
 * 
 * @param speaker - Speaker name
 * @param lines - Lines of dialogue
 * @param continueText - Optional custom text for continue button
 * 
 * @example
 * const intro = simpleDialogue('narrator', [
 *   'Welcome to the castle.',
 *   'Your adventure begins here.'
 * ]);
 */
export function simpleDialogue(
  speaker: string,
  lines: string[],
  continueText?: string
): DialogueEntry {
  return createDialogue({
    speaker,
    lines,
    choices: [continueChoice(continueText)],
  });
}

/**
 * Create a dialogue that offers a task
 * 
 * @param speaker - Speaker name
 * @param lines - Lines explaining the task
 * @param taskId - Task ID to accept
 * @param acceptText - Text for accept button
 * @param declineText - Text for decline button
 * @param declineStateKey - Optional state key to set when declined
 * 
 * @example
 * const taskOffer = taskOfferDialogue(
 *   'guard',
 *   ['I need your help with a task.', 'Will you assist me?'],
 *   'task-1',
 *   'Yes, I\'ll help',
 *   'Not right now',
 *   'task1_declined'
 * );
 */
export function taskOfferDialogue(
  speaker: string,
  lines: string[],
  taskId: string,
  acceptText: string = 'Yes, I\'ll help',
  declineText: string = 'Not right now',
  declineStateKey?: string
): DialogueEntry {
  const declineAction = declineStateKey 
    ? setState(declineStateKey, true) 
    : null;

  return createDialogue({
    speaker,
    lines,
    choices: [
      choice(acceptText, acceptTask(taskId)),
      choice(declineText, declineAction),
    ],
  });
}

/**
 * Create a dialogue that checks if a task is ready to submit
 * 
 * @param speaker - Speaker name
 * @param lines - Lines asking if ready
 * @param submitFunctionName - Function name to call for submission
 * @param submitText - Text for submit button
 * @param notReadyText - Text for not ready button
 * 
 * @example
 * const taskReady = taskReadyDialogue(
 *   'guard',
 *   ['Have you completed the task?'],
 *   'submit-task',
 *   'Yes, I\'m ready',
 *   'Not yet'
 * );
 */
export function taskReadyDialogue(
  speaker: string,
  lines: string[],
  submitFunctionName: string,
  submitText: string = 'Yes, I\'m ready to submit',
  notReadyText: string = 'Not yet'
): DialogueEntry {
  return createDialogue({
    speaker,
    lines,
    choices: [
      choice(submitText, callFunction(submitFunctionName)),
      choice(notReadyText, null),
    ],
  });
}

// ============================================================================
// Dialogues Record Builder
// ============================================================================

/**
 * Create a dialogues record from an array of [id, dialogue] pairs
 * 
 * @param entries - Array of dialogue entries
 * @returns Dialogues record
 * 
 * @example
 * const dialogues = createDialogues([
 *   ['greeting', createDialogue({ speaker: 'guard', lines: ['Hello!'] })],
 *   ['farewell', simpleDialogue('guard', ['Goodbye!'])],
 * ]);
 */
export function createDialogues(
  entries: Array<[string, DialogueEntry]>
): NonNullable<ModuleConfig['dialogues']> {
  return Object.fromEntries(entries);
}

