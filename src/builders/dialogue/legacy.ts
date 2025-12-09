/**
 * Legacy Dialogue Builders
 * Backward compatibility builders for the old dialogue system
 */

import type {
  DialogueConfig,
  DialogueChoice,
  ChoiceAction,
  DialogueNode,
} from '@core/dialogue/types.js';
import type { Task } from '@core/task/types.js';
import type { ModuleContext } from '@core/module/types/index.js';

/**
 * Dialogue options
 */
export interface DialogueOptions {
  id: string;
  lines: string[];
  choices?: DialogueChoice[];
}

/**
 * Create a dialogue
 */
export function createDialogue(options: DialogueOptions): DialogueConfig {
  const { id, lines, choices } = options;

  return {
    id,
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
    // For backward compatibility, convert DialogueConfig to DialogueNode
    if (dialogue) {
      const node: DialogueNode = {
        id: dialogue.id,
        lines: dialogue.lines,
        choices: dialogue.choices ? Object.fromEntries(
          dialogue.choices.map((choice, index) => [`choice_${index}`, { text: choice.text }])
        ) : undefined,
      };
      this.actions.push({ type: 'go-to', node });
    } else {
      this.actions.push({ type: 'go-to', node: null });
    }
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

