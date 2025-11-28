/**
 * Exempel på förgrenad modulväg i världskartan
 * 
 * Detta visar hur man konfigurerar en världskarta med förgreningar
 * där en modul kan leda till flera olika moduler.
 * 
 * Struktur:
 * 
 *     [Start] (example)
 *        |
 *        +---> [Vänster väg] (village)
 *        |        |
 *        |        +---> [Slut] (tower)
 *        |
 *        +---> [Höger väg] (forest)
 *        |        |
 *        |        +---> [Slut] (dungeon)
 *        |
 *        +---> [Mitt väg] (marketplace)
 */

import type { WorldmapConfig } from './src/types/worldmap.types.js';

/**
 * Exempel på förgrenad världskartekonfiguration
 * 
 * Denna konfiguration visar:
 * - En startmodul (example)
 * - Tre grenar som går ut från startmodulen
 * - Ytterligare moduler som går ut från grenarna
 */
export const branchingWorldmapExample: WorldmapConfig = {
  layout: 'branching',
  
  nodes: [
    // Startmodul (centrum, vänster)
    {
      moduleId: 'example',
      position: { x: 20, y: 50 },
      icon: {
        shape: 'circle',
        size: 56,
      },
      summary: 'Börja din resa vid slottsporten. Hjälp vakten med uppgifter för att få tillgång till slottet.',
    },
    
    // Vänster gren - första nivå
    {
      moduleId: 'village',
      position: { x: 40, y: 30 },
      icon: {
        shape: 'circle',
        size: 48,
      },
      summary: 'Besök den mysiga byn och träffa dess invånare. Hjälp byborna med deras dagliga sysslor och uppgifter.',
    },
    
    // Höger gren - första nivå
    {
      moduleId: 'forest',
      position: { x: 40, y: 70 },
      icon: {
        shape: 'circle',
        size: 48,
      },
      summary: 'Vandra genom den mystiska skogen där dolda hemligheter och utmaningar väntar. Var försiktig med vad du möter.',
    },
    
    // Mitt gren - första nivå
    {
      moduleId: 'marketplace',
      position: { x: 40, y: 50 },
      icon: {
        shape: 'square',
        size: 48,
      },
      summary: 'Handla och interagera med köpmän på den livliga marknaden. Hitta sällsynta föremål och handla klokt.',
    },
    
    // Vänster gren - andra nivå (från village)
    {
      moduleId: 'tower',
      position: { x: 65, y: 20 },
      icon: {
        shape: 'square',
        size: 48,
      },
      summary: 'Klättra upp i det höga tornet och utforska dess många våningar. Varje nivå håller nya utmaningar och belöningar.',
    },
    
    // Höger gren - andra nivå (från forest)
    {
      moduleId: 'dungeon',
      position: { x: 65, y: 80 },
      icon: {
        shape: 'circle',
        size: 48,
      },
      summary: 'Utforska de mörka kryptorna under marken. Farliga fiender och värdefulla skatter väntar de modiga.',
    },
  ],
  
  connections: [
    // Första nivå - från start till tre grenar
    {
      from: 'example',
      to: 'village',
      locked: false,
      style: 'solid',
    },
    {
      from: 'example',
      to: 'forest',
      locked: false,
      style: 'solid',
    },
    {
      from: 'example',
      to: 'marketplace',
      locked: false,
      style: 'solid',
    },
    
    // Andra nivå - från village till tower
    {
      from: 'village',
      to: 'tower',
      locked: true, // Låst tills village är klar
      style: 'dashed',
    },
    
    // Andra nivå - från forest till dungeon
    {
      from: 'forest',
      to: 'dungeon',
      locked: true, // Låst tills forest är klar
      style: 'dashed',
    },
  ],
};

/**
 * Alternativt exempel: Mer komplex förgrening
 * 
 * Denna visar en mer komplex struktur med flera nivåer
 */
export const complexBranchingExample: WorldmapConfig = {
  layout: 'branching',
  
  nodes: [
    // Nivå 1: Start
    {
      moduleId: 'example',
      position: { x: 10, y: 50 },
      summary: 'Börja din resa vid slottsporten. Hjälp vakten med uppgifter för att få tillgång till slottet.',
    },
    
    // Nivå 2: Två huvudvägar
    {
      moduleId: 'village',
      position: { x: 30, y: 30 },
      summary: 'Besök den mysiga byn och träffa dess invånare. Hjälp byborna med deras dagliga sysslor och uppgifter.',
    },
    {
      moduleId: 'forest',
      position: { x: 30, y: 70 },
      summary: 'Vandra genom den mystiska skogen där dolda hemligheter och utmaningar väntar. Var försiktig med vad du möter.',
    },
    
    // Nivå 3: Förgreningar från village
    {
      moduleId: 'marketplace',
      position: { x: 50, y: 20 },
      summary: 'Handla och interagera med köpmän på den livliga marknaden. Hitta sällsynta föremål och handla klokt.',
    },
    {
      moduleId: 'tower',
      position: { x: 50, y: 40 },
      summary: 'Klättra upp i det höga tornet och utforska dess många våningar. Varje nivå håller nya utmaningar och belöningar.',
    },
    
    // Nivå 3: Förgreningar från forest
    {
      moduleId: 'dungeon',
      position: { x: 50, y: 60 },
      summary: 'Utforska de mörka kryptorna under marken. Farliga fiender och värdefulla skatter väntar de modiga.',
    },
    {
      moduleId: 'cave',
      position: { x: 50, y: 80 },
      summary: 'Utforska den djupa grottan där gamla mysterier och dolda skatter kan hittas. Var beredd på faror.',
    },
    
    // Nivå 4: Slutmoduler
    {
      moduleId: 'final-boss',
      position: { x: 75, y: 50 },
      summary: 'Möt den slutgiltiga utmaningen. Alla dina färdigheter kommer att sättas på prov i denna avgörande strid.',
    },
  ],
  
  connections: [
    // Nivå 1 -> 2
    { from: 'example', to: 'village', locked: false },
    { from: 'example', to: 'forest', locked: false },
    
    // Nivå 2 -> 3 (från village)
    { from: 'village', to: 'marketplace', locked: true },
    { from: 'village', to: 'tower', locked: true },
    
    // Nivå 2 -> 3 (från forest)
    { from: 'forest', to: 'dungeon', locked: true },
    { from: 'forest', to: 'cave', locked: true },
    
    // Nivå 3 -> 4 (alla leder till samma slut)
    { from: 'marketplace', to: 'final-boss', locked: true },
    { from: 'tower', to: 'final-boss', locked: true },
    { from: 'dungeon', to: 'final-boss', locked: true },
    { from: 'cave', to: 'final-boss', locked: true },
  ],
};

/**
 * Så här använder du en anpassad världskarta:
 * 
 * 1. Skapa en fil med din världskartekonfiguration (som ovan)
 * 
 * 2. Modifiera worldmapService.ts för att använda din konfiguration:
 * 
 * ```typescript
 * import { branchingWorldmapExample } from './WORLDMAP_BRANCHING_EXAMPLE.js';
 * 
 * export async function getWorldmap(): Promise<WorldmapConfig> {
 *   // Använd din anpassade konfiguration istället för auto-genererad
 *   return branchingWorldmapExample;
 * }
 * ```
 * 
 * 3. Eller skapa en dynamisk funktion som bygger världskartan:
 * 
 * ```typescript
 * export async function getWorldmap(): Promise<WorldmapConfig> {
 *   const moduleIds = getRegisteredModuleIds();
 *   
 *   // Kontrollera om vi har moduler för en förgrenad struktur
 *   if (moduleIds.length >= 3) {
 *     return createBranchingWorldmap(moduleIds);
 *   }
 *   
 *   // Annars använd standard linjär layout
 *   return generateWorldmap();
 * }
 * ```
 */

/**
 * Hjälpfunktion för att skapa en förgrenad världskarta dynamiskt
 */
export function createBranchingWorldmap(moduleIds: string[]): WorldmapConfig {
  if (moduleIds.length < 3) {
    throw new Error('Behöver minst 3 moduler för förgrenad struktur');
  }

  const nodes: WorldmapConfig['nodes'] = [];
  const connections: WorldmapConfig['connections'] = [];

  // Startmodul
  const startModule = moduleIds[0];
  nodes.push({
    moduleId: startModule,
    position: { x: 20, y: 50 },
    icon: { shape: 'circle', size: 56 },
  });

  // Skapa grenar från startmodulen
  const branchModules = moduleIds.slice(1);
  const branchCount = Math.min(branchModules.length, 3); // Max 3 grenar
  const branchSpacing = 100 / (branchCount + 1);

  branchModules.slice(0, branchCount).forEach((moduleId, index) => {
    const y = 20 + (index + 1) * branchSpacing;
    nodes.push({
      moduleId,
      position: { x: 50, y },
      icon: { shape: 'circle', size: 48 },
    });

    connections.push({
      from: startModule,
      to: moduleId,
      locked: false,
      style: 'solid',
    });
  });

  // Lägg till resterande moduler som andra nivå
  const remainingModules = branchModules.slice(branchCount);
  remainingModules.forEach((moduleId, index) => {
    const branchIndex = index % branchCount;
    const parentModule = branchModules[branchIndex];
    const y = 20 + (branchIndex + 1) * branchSpacing;
    
    nodes.push({
      moduleId,
      position: { x: 75, y },
      icon: { shape: 'square', size: 48 },
    });

    connections.push({
      from: parentModule,
      to: moduleId,
      locked: true,
      style: 'dashed',
    });
  });

  return {
    layout: 'branching',
    nodes,
    connections,
  };
}

