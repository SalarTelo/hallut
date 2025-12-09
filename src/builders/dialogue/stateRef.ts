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
/**
 * Helper to check if prop is a string key
 */
function isStringKey(prop: string | symbol): prop is string {
  return typeof prop === 'string';
}

export function stateRef<T extends Record<string, unknown> = Record<string, unknown>>(
  interactable: { id: string }
): StateRef<T> {
  return (context: ModuleContext) => {
    return new Proxy({} as T, {
      get(_target, prop: string | symbol) {
        return isStringKey(prop) ? context.getInteractableState(interactable.id, prop) : undefined;
      },
      set(_target, prop: string | symbol, value: unknown) {
        if (isStringKey(prop)) {
          context.setInteractableState(interactable.id, prop, value);
        }
        return true;
      },
      has(_target, prop: string | symbol) {
        return isStringKey(prop) 
          ? context.getInteractableState(interactable.id, prop) !== undefined
          : false;
      },
      ownKeys(_target) {
        // Would need store access to get all keys - return empty for now
        return [];
      },
    });
  };
}

