/**
 * Module Component Loader
 * Dynamically loads custom React components from module folders
 * 
 * Components should be in: modules/{moduleId}/components/{componentName}.tsx
 * They are loaded using Vite's import.meta.glob or direct imports
 */

import type { ComponentType } from 'react';

// Type for module component props
export interface ModuleComponentProps {
  onNext?: () => void;
  [key: string]: unknown;
}

const moduleComponentCache = new Map<string, ComponentType<ModuleComponentProps>>();

/**
 * Load a custom component from a module's components folder
 * Uses Vite's import.meta.glob for dynamic imports
 */
export async function loadModuleComponent(
  moduleId: string,
  componentName: string
): Promise<ComponentType<ModuleComponentProps> | null> {
  const cacheKey = `${moduleId}:${componentName}`;
  
  // Check cache first
  if (moduleComponentCache.has(cacheKey)) {
    return moduleComponentCache.get(cacheKey)!;
  }

  try {
    // Use Vite's import.meta.glob to dynamically import from modules folder
    // This works because modules/ is at the project root
    const modules = import.meta.glob('/modules/*/components/*.tsx', { eager: false });
    
    // Find the matching module component
    const modulePath = `/modules/${moduleId}/components/${componentName}.tsx`;
    const moduleLoader = modules[modulePath];
    
    if (moduleLoader) {
      const componentModule = await moduleLoader() as { default?: ComponentType<ModuleComponentProps>; [key: string]: unknown };
      const Component = (componentModule.default || componentModule[componentName]) as ComponentType<ModuleComponentProps> | undefined;
      
      if (Component) {
        moduleComponentCache.set(cacheKey, Component);
        return Component;
      }
    }
    
    // Fallback: try direct import (for development)
    try {
      const componentModule = await import(
        /* @vite-ignore */
        `../../modules/${moduleId}/components/${componentName}.tsx`
      ) as { default?: ComponentType<ModuleComponentProps>; [key: string]: unknown };
      const Component = (componentModule.default || componentModule[componentName]) as ComponentType<ModuleComponentProps> | undefined;
      if (Component) {
        moduleComponentCache.set(cacheKey, Component);
        return Component;
      }
    } catch (fallbackError) {
      // Ignore fallback errors
    }
    
    return null;
  } catch (error) {
    console.warn(`Failed to load module component ${moduleId}/${componentName}:`, error);
    return null;
  }
}

/**
 * Load all components from a module's components folder
 * Looks for a components/index.ts file that exports all components
 */
export async function loadModuleComponents(moduleId: string): Promise<Record<string, ComponentType<ModuleComponentProps>>> {
  const components: Record<string, ComponentType<ModuleComponentProps>> = {};
  
  try {
    // Use Vite's import.meta.glob to find the index file
    const modules = import.meta.glob('/modules/*/components/index.ts', { eager: false });
    const indexPath = `/modules/${moduleId}/components/index.ts`;
    const indexLoader = modules[indexPath];
    
    if (indexLoader) {
      const componentsModule = await indexLoader() as { default?: Record<string, ComponentType<ModuleComponentProps>>; [key: string]: unknown };
      
      // Components should be exported as named exports or default export
      if (componentsModule.default) {
        Object.assign(components, componentsModule.default as Record<string, ComponentType<ModuleComponentProps>>);
      } else {
        Object.assign(components, componentsModule as Record<string, ComponentType<ModuleComponentProps>>);
      }
      
      // Cache all loaded components
      Object.entries(components).forEach(([name, component]) => {
        const cacheKey = `${moduleId}:${name}`;
        moduleComponentCache.set(cacheKey, component);
      });
    }
    
    return components;
  } catch (error) {
    console.warn(`Failed to load module components for ${moduleId}:`, error);
    return {};
  }
}

/**
 * Register module components in the global component registry
 */
export async function registerModuleComponents(
  moduleId: string,
  registerComponent: (type: string, component: ComponentType<ModuleComponentProps>) => void
): Promise<void> {
  const components = await loadModuleComponents(moduleId);
  
  // Register each component with a module-specific type prefix
  // Format: {moduleId}:{componentName}
  Object.entries(components).forEach(([name, component]) => {
    const type = `${moduleId}:${name}`;
    registerComponent(type, component);
  });
}

/**
 * Clear module component cache (useful for hot reloading)
 */
export function clearModuleComponentCache(moduleId?: string): void {
  if (moduleId) {
    // Clear specific module
    const keysToDelete: string[] = [];
    moduleComponentCache.forEach((_, key) => {
      if (key.startsWith(`${moduleId}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => moduleComponentCache.delete(key));
  } else {
    // Clear all
    moduleComponentCache.clear();
  }
}

