/**
 * CLI Utilities
 * Shared utility functions for the CLI wizard
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const MODULES_DIR = path.join(__dirname, '../../modules');

/**
 * Convert module ID to display name
 * Example: "my-module" -> "My Module"
 */
export function toDisplayName(id: string): string {
  return id.toLowerCase().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Validate module ID format
 */
export function validateModuleId(id: string): boolean | string {
  if (!id) return 'Module ID is required';
  if (!/^[a-z0-9-]+$/.test(id)) {
    return 'Module ID must be lowercase alphanumeric with hyphens (e.g. "my-module")';
  }
  if (id.startsWith('-') || id.endsWith('-')) {
    return 'Module ID must not start or end with a hyphen';
  }
  if (id.includes('--')) {
    return 'Module ID must not contain consecutive hyphens';
  }
  return true;
}

/**
 * Validate task ID format
 */
export function validateTaskId(id: string): boolean | string {
  if (!id) return 'Task ID is required';
  if (!/^[a-z0-9-]+$/.test(id)) {
    return 'Task ID must be lowercase alphanumeric with hyphens';
  }
  return true;
}

/**
 * Get list of existing modules
 */
export async function getExistingModules(): Promise<string[]> {
  try {
    const entries = await fs.readdir(MODULES_DIR, { withFileTypes: true });
    return entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  } catch {
    return [];
  }
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure directory exists (create if needed)
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

