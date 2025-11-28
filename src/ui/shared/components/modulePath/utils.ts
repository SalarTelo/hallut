/**
 * ModulePath Utilities
 * Helper functions for the module path components
 */

import type { WorldmapConnection, WorldmapNode } from '@types/worldmap.types.js';
import type { ModuleProgressionState } from '@types/core/moduleProgression.types.js';

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
 * Get stroke color for a connection
 */
export function getStrokeColor(
  connection: WorldmapConnection,
  state: ConnectionState,
  isConnectionUnlocked: boolean,
  borderColor: string
): string {
  if (state.isPartiallyUnlocked) {
    return `url(#${getGradientId(connection)})`;
  }
  return isConnectionUnlocked ? borderColor : '#666666';
}

