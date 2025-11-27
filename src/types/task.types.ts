/**
 * Task submission types
 */

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
      containsKeywords?: string[];  // For text
      maxFileSize?: number;  // For image (bytes)
      allowedFormats?: string[];  // For image (e.g., ['jpg', 'png'])
        // ... other config options
  };
}



