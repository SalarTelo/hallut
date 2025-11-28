/**
 * Worldmap Service
 * Provides worldmap configuration for module selection
 * Generates worldmap from discovered modules
 */

import type { WorldmapConfig, WorldmapNode, WorldmapConnection } from '../types/worldmap.types.js';
import { getRegisteredModuleIds } from '../engine/moduleRegistry.js';
import {branchingWorldmapExample} from "../../WORLDMAP_BRANCHING_EXAMPLE.ts";

/**
 * Generate worldmap configuration from registered modules
 * Creates a unified layout algorithm that works for any number of modules
 */
export async function generateWorldmap(): Promise<WorldmapConfig> {
  const moduleIds = getRegisteredModuleIds();
  const nodes: WorldmapNode[] = [];
  const connections: WorldmapConnection[] = [];

  if (moduleIds.length === 0) {
    return {
      layout: 'linear',
      nodes: [],
      connections: [],
    };
  }

  // Unified algorithm: works for 1, 2, 3, or many modules
  // First module at start position, subsequent modules follow a path
  const startX = moduleIds.length === 1 ? 50 : 15; // Center single module, otherwise start left
  const startY = 50;
  
  // Add first module
  nodes.push({
    moduleId: moduleIds[0],
    position: { x: startX, y: startY },
    icon: {
      shape: 'circle',
      size: 48,
    },
  });

  // Add remaining modules in a path
  const remainingModules = moduleIds.slice(1);
  const totalModules = moduleIds.length;
  const availableWidth = 70; // Percentage of width to use
  const spacing = remainingModules.length > 0 
    ? availableWidth / (remainingModules.length + 1) 
    : 0;

  remainingModules.forEach((moduleId, index) => {
    const x = startX + (index + 1) * spacing;
    
    // Add slight curve to path for visual appeal (only if more than 2 modules)
    const baseY = startY;
    const yOffset = totalModules > 2 
      ? Math.sin((index / remainingModules.length) * Math.PI) * 15 
      : 0;
    const y = Math.min(Math.max(baseY + yOffset, 20), 80);
    
    nodes.push({
      moduleId,
      position: { 
        x: Math.min(Math.max(x, 30), 85), 
        y 
      },
      icon: {
        shape: 'circle',
        size: 48,
      },
    });

    // Connect to previous module
    const connectFrom = index === 0 ? moduleIds[0] : remainingModules[index - 1];
    connections.push({
      from: connectFrom,
      to: moduleId,
      locked: false,
      style: 'solid',
    });
  });

  return {
    layout: totalModules > 2 ? 'branching' : 'linear',
    nodes,
    connections,
  };
}

/**
 * Get worldmap configuration
 * Cached version that can be extended with custom layouts
 */
let cachedWorldmap: WorldmapConfig | null = null;

export async function getWorldmap(): Promise<WorldmapConfig> {
  if (!cachedWorldmap) {
    cachedWorldmap = await generateWorldmap();
  }
  return branchingWorldmapExample;
}

/**
 * Clear worldmap cache
 */
export function clearWorldmapCache(): void {
  cachedWorldmap = null;
}

