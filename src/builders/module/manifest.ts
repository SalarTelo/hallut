/**
 * Module Manifest Builder
 * Functions for creating module manifests
 */

import type { ModuleManifest } from '@core/module/types/index.js';

/**
 * Create a module manifest
 */
export function createManifest(
  id: string,
  name: string,
  version: string = '1.0.0',
  summary?: string
): ModuleManifest {
  return { id, name, version, summary };
}

