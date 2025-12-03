/**
 * ModulePath Utilities
 * Helper functions for the module path components
 */

import type { WorldmapConnection, WorldmapNode } from '@core/types/worldmap.js';
import type { ModuleProgressionState } from '@core/state/types.js';

/**
 * Convert hex color to rgba
 */
export function hexToRgba(hex: string, alpha: number): string {
  const hexWithoutHash = hex.replace('#', '');
  const r = parseInt(hexWithoutHash.substring(0, 2), 16);
  const g = parseInt(hexWithoutHash.substring(2, 4), 16);
  const b = parseInt(hexWithoutHash.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Format module ID to display name (capitalize words)
 */
export function formatModuleName(moduleId: string): string {
  return moduleId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check if a module progression state is unlocked or completed
 */
export function isModuleUnlocked(state: ModuleProgressionState): boolean {
  return state === 'unlocked' || state === 'completed';
}

/**
 * Get connection nodes (from and to)
 */
export function getConnectionNodes(
  connection: WorldmapConnection,
  nodes: WorldmapNode[]
): { fromNode: WorldmapNode; toNode: WorldmapNode } | null {
  const fromNode = nodes.find((n) => n.moduleId === connection.from);
  const toNode = nodes.find((n) => n.moduleId === connection.to);
  return fromNode && toNode ? { fromNode, toNode } : null;
}

/**
 * Connection state information
 */
export interface ConnectionState {
  fromState: ModuleProgressionState;
  toState: ModuleProgressionState;
  fromUnlocked: boolean;
  toUnlocked: boolean;
  isPartiallyUnlocked: boolean;
}

/**
 * Get connection state information
 */
export function getConnectionState(
  connection: WorldmapConnection,
  getModuleProgression: (moduleId: string) => ModuleProgressionState
): ConnectionState {
  const fromState = getModuleProgression(connection.from);
  const toState = getModuleProgression(connection.to);
  const fromUnlocked = isModuleUnlocked(fromState);
  const toUnlocked = isModuleUnlocked(toState);
  const isPartiallyUnlocked = (fromUnlocked && !toUnlocked) || (!fromUnlocked && toUnlocked);

  return {
    fromState,
    toState,
    fromUnlocked,
    toUnlocked,
    isPartiallyUnlocked,
  };
}

/**
 * Get stroke dash array from connection style
 */
export function getStrokeDasharray(style: 'dotted' | 'dashed' | 'solid' | undefined): string {
  if (style === 'dashed') return '5,5';
  if (style === 'dotted') return '2,2';
  return '0';
}

/**
 * Generate connection key
 */
export function getConnectionKey(connection: WorldmapConnection): string {
  return `${connection.from}-${connection.to}`;
}

/**
 * Generate gradient ID
 */
export function getGradientId(connection: WorldmapConnection): string {
  return `gradient-${connection.from}-${connection.to}`;
}

/**
 * Get gradient colors for a connection state
 * Always returns gradient colors based on module states
 * Uses the same logic for all line styles (solid, dashed, dotted)
 */
export function getGradientColors(
  state: ConnectionState,
  borderColor: string
): { fromColor: string; toColor: string; fromOpacity: number; toOpacity: number } {
  // Determine colors based on module states
  const fromColor = state.fromState === 'completed' 
    ? '#10b981' // Green for completed
    : state.fromUnlocked 
      ? borderColor // Yellow for unlocked
      : '#666666'; // Gray for locked
  
  const toColor = state.toState === 'completed'
    ? '#10b981' // Green for completed
    : state.toUnlocked
      ? borderColor // Yellow for unlocked
      : '#666666'; // Gray for locked

  const fromOpacity = state.fromUnlocked || state.fromState === 'completed' ? 0.9 : 0.4;
  const toOpacity = state.toUnlocked || state.toState === 'completed' ? 0.9 : 0.4;

  return { fromColor, toColor, fromOpacity, toOpacity };
}

