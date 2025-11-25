/**
 * Simple module registry - just discovers modules
 * Loading is handled by loader.ts
 */

/**
 * Get all available module IDs
 */
export async function getModuleIds(): Promise<string[]> {
  const modules = import.meta.glob('/modules/*/module.ts', { eager: true });
  const ids: string[] = [];
  
  for (const path of Object.keys(modules)) {
    const match = path.match(/\/modules\/([^/]+)\/module\.ts$/);
    if (match) {
      ids.push(match[1]);
    }
  }
  
  return ids;
}

