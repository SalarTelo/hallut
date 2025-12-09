/**
 * Choice Formatter
 * Utilities for formatting dialogue choice text
 */

/**
 * Format choice text with special handling for task choices
 * Extracts [Task] prefix and returns structured format
 */
export function formatChoiceText(text: string): {
  prefix?: string;
  content: string;
  isTask: boolean;
} {
  if (text.startsWith('[Task]')) {
    return {
      prefix: '[Task]',
      content: text.substring(6).trim(),
      isTask: true,
    };
  }
  return {
    content: text,
    isTask: false,
  };
}
