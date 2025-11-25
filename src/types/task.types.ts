/**
 * Task submission types
 */

import type { TaskSolveResult } from './module.types.js';

/**
 * Task submission - union type for different submission methods
 */
export type TaskSubmission =
  | { type: 'text'; text: string }
  | { type: 'image'; image: File | string }  // File or URL
  | { type: 'code'; code: string }
  | { type: 'multiple_choice'; choice: string }
  | { type: 'custom'; data: unknown };

/**
 * Task submission configuration
 */
export interface TaskSubmissionConfig {
  type: 'text' | 'image' | 'code' | 'multiple_choice' | 'custom';
  component?: string;  // For custom submission components
  config?: {
    minLength?: number;  // For text
    maxFileSize?: number;  // For image (bytes)
    allowedFormats?: string[];  // For image (e.g., ['jpg', 'png'])
    // ... other config options
  };
}

/**
 * Task dialogue definitions
 */
export interface TaskDialogue {
  offerDialogue?: {
    lines: string[];
    acceptText?: string;  // Default: 'Ja, det kan jag göra'
  };
  activeDialogue?: {
    lines: string[];
    readyText?: string;  // Default: 'Ja, jag är redo'
    notReadyText?: string;  // Default: 'Inte ännu'
    onReady?: (context: import('./dialogue.types.js').DialogueContext) => void;
    onNotReady?: (context: import('./dialogue.types.js').DialogueContext) => void;
  };
}

