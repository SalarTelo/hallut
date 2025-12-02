/**
 * Template Helper Functions
 * Utilities to make template generation easier and less error-prone
 */

/**
 * Escape a string for use in a JavaScript/TypeScript single-quoted string
 * Handles: single quotes, backslashes, newlines
 */
export function escapeSingleQuote(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'")     // Escape single quotes
    .replace(/\n/g, '\\n')    // Escape newlines
    .replace(/\r/g, '\\r')    // Escape carriage returns
    .replace(/\t/g, '\\t');   // Escape tabs
}

/**
 * Escape a string for use in a JavaScript/TypeScript double-quoted string
 */
export function escapeDoubleQuote(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Create a single-quoted string literal with proper escaping
 */
export function singleQuote(str: string): string {
  return `'${escapeSingleQuote(str)}'`;
}

/**
 * Create a double-quoted string literal with proper escaping
 */
export function doubleQuote(str: string): string {
  return `"${escapeDoubleQuote(str)}"`;
}

/**
 * Join an array of strings with commas and newlines
 */
export function joinLines(items: string[], indent: number = 0): string {
  const indentStr = ' '.repeat(indent);
  return items.map(item => indentStr + item).join(',\n');
}

/**
 * Conditionally include content
 */
export function cond(condition: boolean, content: string): string {
  return condition ? content : '';
}

