/**
 * Strict TypeScript types for module state management
 */

import type { EvaluationResponse } from './module.types.js';

/**
 * Module state structure - all known fields that can be stored in module state
 * NO index signature - all fields must be explicitly defined
 */
export interface ModuleState {
  // Task completion tracking
  completedTasks?: string[];
  currentTaskId?: string;
  currentTaskNodeId?: string;
  
  // Task submission state
  readyToSubmit?: boolean;
  submissionType?: 'text' | 'image' | 'code' | 'multiple_choice' | 'custom';
  submissionComponent?: string;
  submissionConfig?: Record<string, unknown>;
  
  // Story/answer submission state (legacy, may be removed)
  hasStoryReady?: boolean;
  storyReadyResponse?: string;
  lastSubmission?: string;
  lastEvaluation?: EvaluationResponse;
  
  // World map state
  completeWorldMapNode?: () => void;
  unlockPassword?: string;
  
  // Step navigation
  targetStepId?: string;
  
  // Greeting tracking
  seenGreetings?: Record<string, boolean>;  // dialogueId -> has seen
}

/**
 * Module progress structure stored in localStorage
 */
export interface ModuleProgress {
  completedTasks: string[];
  state: ModuleState;
}

/**
 * Helper type for accessing module state fields safely
 */
export type ModuleStateField = keyof ModuleState;

