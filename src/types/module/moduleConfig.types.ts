/**
 * Module Configuration Types
 * Types for module configuration and data
 * Depends on: Task, Interactable, DialogueConfig
 */

import type { TaskSubmissionConfig, TaskSolveFunction } from './task.types.js';
import type { Interactable } from '../interactable.types.js';
import type { DialogueConfig, DialogueContext } from '../dialogue.types.js';
import type { ComponentType } from 'react';

/**
 * Task - defines a task in a module
 */
export interface Task {
  /**
   * Unique task ID
   */
  id: string;

  /**
   * Display name
   */
  name: string;

  /**
   * Description
   */
  description: string;

  /**
   * Function to evaluate task submissions
   * Module provides this logic
   */
  solveFunction: TaskSolveFunction;

  /**
   * Submission configuration
   */
  submission: TaskSubmissionConfig;

  /**
   * Optional dialogue shown when task is offered
   */
  offerDialogue?: {
    lines: string[];
    acceptText?: string;
  };

  /**
   * Optional dialogue shown when task is active
   */
  activeDialogue?: {
    lines: string[];
    readyText?: string;
    notReadyText?: string;
    onReady?: (context: DialogueContext) => void;
    onNotReady?: (context: DialogueContext) => void;
  };

  /**
   * Optional overview information for display
   */
  overview?: {
    requirements?: string;
    goals?: string[];
  };
}

/**
 * Module configuration
 * Fixed structure that all modules must follow
 */
export interface ModuleConfig {
  /**
   * Module manifest
   */
  manifest: {
    id: string;
    name: string;
    version: string;
  };

  /**
   * Background configuration
   * Image preferred, color as fallback
   */
  background: {
    image?: string;
    color?: string;
  };

  /**
   * Theme configuration
   * Optional per-module theming
   */
  theme?: {
    /**
     * Border color (default: yellow #FFD700)
     */
    borderColor?: string;

    /**
     * Optional accent colors
     */
    accentColors?: {
      primary?: string;
      secondary?: string;
      highlight?: string;
    };
  };

  /**
   * Welcome dialogue
   */
  welcome: {
    speaker: string; // Reference to interactable ID
    lines: string[];
  };

  /**
   * Interactable objects in the module
   */
  interactables: Interactable[];

  /**
   * Tasks in the module
   * Order in array defines task order
   */
  tasks: Task[];

  /**
   * Optional dialogue definitions
   * Map dialogue IDs to their content
   */
  dialogues?: Record<string, {
    speaker: string;
    lines: string[];
    choices?: import('../dialogue.types.js').DialogueChoice[];
    onComplete?: import('../dialogue.types.js').DialogueCompletionAction | import('../dialogue.types.js').DialogueCompletionAction[];
  }>;

  /**
   * Module dependencies
   * Array of module IDs that must be completed before this module can be unlocked
   */
  requires?: string[];
}

/**
 * Module component props interface
 * All module components must accept these props
 */
export interface ModuleComponentProps {
  onNext?: () => void;
  [key: string]: unknown;
}

/**
 * Module data - complete module data structure
 */
export interface ModuleData {
  /**
   * Module configuration
   */
  config: ModuleConfig;

  /**
   * Dialogue configurations
   */
  dialogues: Record<string, DialogueConfig>;

  /**
   * Tasks (same as config.tasks, kept for convenience)
   */
  tasks: Task[];

  /**
   * Module-specific React components
   */
  components: Record<string, ComponentType<ModuleComponentProps>>;
}
