/**
 * Template Utilities
 * Helper functions for template generation
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, 'templates');

/**
 * Load a template file and replace placeholders
 */
export function loadTemplate(filename: string, variables: Record<string, string> = {}): string {
  const templatePath = join(TEMPLATES_DIR, filename);
  let content = readFileSync(templatePath, 'utf-8');
  
  // Replace simple placeholders {{variableName}}
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    content = content.replace(regex, value);
  }
  
  return content;
}

/**
 * Escape single quotes in strings for JavaScript/TypeScript
 */
export function escapeJsString(str: string): string {
  return str.replace(/'/g, "\\'").replace(/\\/g, '\\\\');
}

/**
 * Escape double quotes in strings for JavaScript/TypeScript
 */
export function escapeJsDoubleQuotes(str: string): string {
  return str.replace(/"/g, '\\"');
}

/**
 * Indent text by a specified number of spaces
 */
export function indent(text: string, spaces: number = 2): string {
  const indentStr = ' '.repeat(spaces);
  return text
    .split('\n')
    .map(line => line ? indentStr + line : line)
    .join('\n');
}

/**
 * Conditionally include content based on a condition
 */
export function ifCondition(condition: boolean, content: string): string {
  return condition ? content : '';
}

