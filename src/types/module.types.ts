/**
 * Task solve result - returned by task solve functions
 */
export interface TaskSolveResult {
  solved: boolean;
  reason: string;
  details?: string;
  score?: number;
}

/**
 * Task - defines a task in a module
 */
export interface Task {
  id: string;
  order: number;
  name: string;
  description: string;
  solveFunction: (input: import('./task.types.js').TaskSubmission) => TaskSolveResult;
  
  // Submission configuration
  submission: import('./task.types.js').TaskSubmissionConfig;
  
  // Dialogue (from task definition)
  offerDialogue?: {
    lines: string[];
    acceptText?: string;
  };
  activeDialogue?: {
    lines: string[];
    readyText?: string;
    notReadyText?: string;
    onReady?: (context: import('./dialogue.types.js').DialogueContext) => void;
    onNotReady?: (context: import('./dialogue.types.js').DialogueContext) => void;
  };
  
  // Overview for task display
  overview?: {
    requirements?: string;
    goals?: string[];
  };
}

/**
 * ModuleData - complete module data structure
 */
export interface ModuleData {
  config: ModuleConfig;
  dialogues: Record<string, import('./dialogue.types.js').DialogueConfig>;
  tasks: Task[];
  components: Record<string, import('react').ComponentType<any>>;
}


import type { Interactable } from './interactable.types.js';

/**
 * Module configuration - new TypeScript-based module structure
 */
export interface ModuleConfig {
  manifest: {
    id: string;
    name: string;
    version: string;
  };
  background: {
    color: string;
    image: string | null;
  };
  welcome: {
    speaker: string; // Reference to interactable ID
    lines: string[];
  };
  interactables: Interactable[];
  tasks: Task[];
}


/**
 * TaskConfig - legacy type alias for Task (for backward compatibility)
 * @deprecated Use Task directly
 */
export type TaskConfig = Task;

/**
 * EvaluationResponse - legacy, may be removed later
 * @deprecated Use TaskSolveResult instead
 */
export interface EvaluationResponse {
  evaluation: 'too_short' | 'missing_keywords' | 'weak' | 'good' | 'excellent';
  details?: string;
  reply: string;
}

