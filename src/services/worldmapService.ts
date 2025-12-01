/**
 * Världskarttjänst
 * Tillhandahåller världskartekonfiguration för modulval
 * Genererar världskarta från upptäckta moduler
 */

import type { WorldmapConfig, WorldmapNode, WorldmapConnection } from '../types/worldmap.types.js';
import { getRegisteredModuleIds, getModuleConfig } from '../engine/moduleRegistry.js';
import { DEFAULT_LOCALE } from '../constants/module.constants.js';
import { MODULE_ORDER, USE_MANUAL_ORDER } from '../constants/worldmap.config.js';

/**
 * Generera världskartekonfiguration från registrerade moduler
 * Skapar ett enhetligt layoutalgoritm som fungerar för valfritt antal moduler
 */
export async function generateWorldmap(): Promise<WorldmapConfig> {
  let moduleIds = getRegisteredModuleIds();
  
  // Apply manual order configuration if enabled
  if (USE_MANUAL_ORDER && MODULE_ORDER.length > 0) {
    // Create ordered array: modules in MODULE_ORDER first, then any remaining modules
    const orderedModules: string[] = [];
    const remainingModules: string[] = [];
    
    // Add modules in the configured order
    for (const moduleId of MODULE_ORDER) {
      if (moduleIds.includes(moduleId)) {
        orderedModules.push(moduleId);
      }
    }
    
    // Add any modules not in the configuration
    for (const moduleId of moduleIds) {
      if (!MODULE_ORDER.includes(moduleId)) {
        remainingModules.push(moduleId);
      }
    }
    
    // Combine: configured order first, then remaining modules
    moduleIds = [...orderedModules, ...remainingModules];
  }
  
  const nodes: WorldmapNode[] = [];
  const connections: WorldmapConnection[] = [];

  if (moduleIds.length === 0) {
    return {
      layout: 'linear',
      nodes: [],
      connections: [],
    };
  }

  // Enhetlig algoritm: fungerar för 1, 2, 3 eller många moduler
  // Första modulen vid startposition, efterföljande moduler följer en väg
  const startX = moduleIds.length === 1 ? 50 : 15; // Centrera enkel modul, annars börja vänster
  const startY = 50;
  
  // Lägg till första modulen
  const firstModuleConfig = await getModuleConfig(moduleIds[0], DEFAULT_LOCALE);
  nodes.push({
    moduleId: moduleIds[0],
    position: { x: startX, y: startY },
    icon: {
      shape: 'circle',
      size: 48,
    },
    summary: firstModuleConfig?.manifest.summary,
  });

  // Lägg till återstående moduler i en väg
  const remainingModules = moduleIds.slice(1);
  const totalModules = moduleIds.length;
  const availableWidth = 70; // Procent av bredd att använda
  const spacing = remainingModules.length > 0 
    ? availableWidth / (remainingModules.length + 1) 
    : 0;

  for (let index = 0; index < remainingModules.length; index++) {
    const moduleId = remainingModules[index];
    const moduleConfig = await getModuleConfig(moduleId, DEFAULT_LOCALE);
    
    const x = startX + (index + 1) * spacing;
    
    // Lägg till lätt kurva till vägen för visuellt intresse (endast om fler än 2 moduler)
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
      summary: moduleConfig?.manifest.summary,
    });

    // Koppla till föregående modul
    const connectFrom = index === 0 ? moduleIds[0] : remainingModules[index - 1];
    connections.push({
      from: connectFrom,
      to: moduleId,
      locked: false,
      style: 'solid',
    });
  }

  return {
    layout: totalModules > 2 ? 'branching' : 'linear',
    nodes,
    connections,
  };
}

/**
 * Hämta världskartekonfiguration
 * Cachad version som kan utökas med anpassade layouter
 */
let cachedWorldmap: WorldmapConfig | null = null;

export async function getWorldmap(): Promise<WorldmapConfig> {
  if (!cachedWorldmap) {
    cachedWorldmap = await generateWorldmap();
  }
  return cachedWorldmap;
}

/**
 * Rensa världskartecache
 */
export function clearWorldmapCache(): void {
  cachedWorldmap = null;
}
