import type { ComponentType } from 'react';

export type ComponentRegistry = Record<string, ComponentType<any>>;

const registry: ComponentRegistry = {};

export function registerComponent(type: string, component: ComponentType<any>): void {
  registry[type] = component;
}

export function getComponent(type: string): ComponentType<any> | null {
  // First try exact match
  if (registry[type]) {
    return registry[type];
  }
  
  // If type contains ':', it's a module-specific component
  // Try to load it dynamically
  if (type.includes(':')) {
    const [moduleId, componentName] = type.split(':');
    // Return a placeholder that will trigger dynamic loading
    // The StepRenderer will handle the async loading
    return null; // Will be handled by StepRenderer
  }
  
  return null;
}

export function getAllRegisteredTypes(): string[] {
  return Object.keys(registry);
}

export function isModuleComponent(type: string): boolean {
  return type.includes(':');
}

export function parseModuleComponentType(type: string): { moduleId: string; componentName: string } | null {
  if (!type.includes(':')) return null;
  const [moduleId, componentName] = type.split(':');
  return { moduleId, componentName };
}

