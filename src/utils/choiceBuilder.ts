/**
 * Unified Choice Builder
 * Simplified choice builder with method chaining and direct references
 */

import type { DialogueChoice, ChoiceAction } from '../types/choiceTypes.js';
import type { Task } from '../types/module/moduleConfig.types.js';
import type { DialogueConfig } from '../types/dialogue.types.js';
import type { ModuleContext } from '../types/core/moduleClass.types.js';

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
 * 
 * @param text - Choice text
 * @returns Choice builder for method chaining
 * 
 * @example
 * choice('Yes, I\'ll help')
 *   .acceptTask(storyTask)
 *   .build()
 * 
 * choice('Continue')
 *   .goTo(nextDialogue)
 *   .build()
 * 
 * choice('Submit')
 *   .callFunction(submitHandler)
 *   .build()
 */
export function choice(text: string): ChoiceBuilder {
  return new ChoiceBuilderImpl(text);
}

/**
 * Create a simple choice with no action
 * 
 * @param text - Choice text
 * @returns Choice with no action
 */
export function simpleChoice(text: string): DialogueChoice {
  return {
    text,
    action: null,
  };
}

