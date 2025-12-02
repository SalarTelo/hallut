/**
 * Dialogue Builders
 * Type-safe builders for creating dialogues
 */

import type { DialogueConfig, DialogueChoice, ChoiceAction } from '@core/types/dialogue.js';
import type { Task } from '@core/types/task.js';
import type { ModuleContext } from '@core/types/module.js';

/**
 * Dialogue options
 */
export interface DialogueOptions {
  id: string;
  speaker: string;
  lines: string[];
  choices?: DialogueChoice[];
}

/**
 * Create a dialogue
 */
export function createDialogue(options: DialogueOptions): DialogueConfig {
  const { id, speaker, lines, choices } = options;

  return {
    id,
    speaker,
    lines,
    choices,
  };
}

/**
 * Choice builder implementation
 */
class ChoiceBuilderImpl implements ChoiceBuilder {
  private text: string;
  private actions: ChoiceAction[] = [];

  constructor(text: string) {
    this.text = text;
  }

  acceptTask(task: Task): ChoiceBuilder {
    this.actions.push({ type: 'accept-task', task });
    return this;
  }

  setState(key: string, value: unknown): ChoiceBuilder {
    this.actions.push({ type: 'set-state', key, value });
    return this;
  }

  callFunction(handler: (context: ModuleContext) => void | Promise<void>): ChoiceBuilder {
    this.actions.push({ type: 'call-function', handler });
    return this;
  }

  goTo(dialogue: DialogueConfig | null): ChoiceBuilder {
    this.actions.push({ type: 'go-to', dialogue });
    return this;
  }

  build(): DialogueChoice {
    if (this.actions.length === 0) {
      return {
        text: this.text,
        action: null,
      };
    }

    if (this.actions.length === 1) {
      return {
        text: this.text,
        action: this.actions[0],
      };
    }

    return {
      text: this.text,
      action: this.actions,
    };
  }
}

/**
 * Choice builder interface
 */
export interface ChoiceBuilder {
  acceptTask(task: Task): ChoiceBuilder;
  setState(key: string, value: unknown): ChoiceBuilder;
  callFunction(handler: (context: ModuleContext) => void | Promise<void>): ChoiceBuilder;
  goTo(dialogue: DialogueConfig | null): ChoiceBuilder;
  build(): DialogueChoice;
}

/**
 * Create a choice builder
 */
export function choice(text: string): ChoiceBuilder {
  return new ChoiceBuilderImpl(text);
}

/**
 * Create a simple choice with no action
 */
export function simpleChoice(text: string): DialogueChoice {
  return {
    text,
    action: null,
  };
}

