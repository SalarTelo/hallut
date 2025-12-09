/**
 * State Reference Pattern
 * Creates state references for NPCs/interactables that sync with Zustand store
 */

import type { ModuleContext } from '@core/module/types/index.js';

/**
 * State reference type - function that takes context and returns state proxy
 */
export type StateRef<T extends Record<string, unknown> = Record<string, unknown>> = (
  context: ModuleContext
) => T;

/**
 * Creates a state reference for an NPC/interactable
 * Returns a function that, when called with context, returns a Proxy
 * that syncs property access with the Zustand store
 * 
 * @param interactable - The NPC or interactable to create a state reference for
 * @returns A function that takes ModuleContext and returns a state proxy
 * 
 * @example
 * ```typescript
 * const guardState = stateRef<GuardState>(guardNPC);
 * // Later, in an action:
 * (ctx) => { guardState(ctx).hasMet = true; }
 * ```
 */
export function stateRef<T extends Record<string, unknown> = Record<string, unknown>>(
  interactable: { id: string }
): StateRef<T> {
  return (context: ModuleContext) => {
    return new Proxy({} as T, {
      get(_target, prop: string | symbol) {
        // Read from Zustand store via context
        if (typeof prop === 'string') {
          return context.getInteractableState(interactable.id, prop);
        }
        return undefined;
      },
      set(_target, prop: string | symbol, value: unknown) {
        // Write to Zustand store via context
        if (typeof prop === 'string') {
          context.setInteractableState(interactable.id, prop, value);
        }
        return true; // Indicate success
      },
      has(_target, prop: string | symbol) {
        // Check if property exists in store
        if (typeof prop === 'string') {
          const value = context.getInteractableState(interactable.id, prop);
          return value !== undefined;
        }
        return false;
      },
      ownKeys(_target) {
        // This is tricky - we'd need to get all keys from the store
        // For now, return empty array (can be enhanced if needed)
        return [];
      },
    });
  };
}

