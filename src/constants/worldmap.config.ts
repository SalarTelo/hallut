/**
 * Worldmap Configuration
 * Manual configuration for module display order in the worldmap
 * 
 * To change the order of modules in the module selection screen:
 * 1. Add your module IDs to the MODULE_ORDER array in the desired order
 * 2. Modules not in this list will appear after the configured modules
 * 3. Empty array means use default discovery order
 */

export const MODULE_ORDER: string[] = [
    'intro',
    'textGen',
    'imagerecog',
    'audiogen',
    'videogen'
];

/**
 * Whether to use the manual order configuration
 * If false, modules will use the default discovery order
 */
export const USE_MANUAL_ORDER = true;

/**
 * Modules that should start unlocked (available from the beginning)
 * Modules not in this list will start locked
 * 
 * Example:
 * export const INITIALLY_UNLOCKED_MODULES = [
 *   'intro',
 *   'textGen',
 * ];
 */
export const INITIALLY_UNLOCKED_MODULES: string[] = [
  'intro',
  'textGen',
  // Add more module IDs that should start unlocked
];

/**
 * Whether to use the manual unlock configuration
 * If false, uses default behavior (first 2 modules unlocked)
 */
export const USE_MANUAL_UNLOCK = true;

