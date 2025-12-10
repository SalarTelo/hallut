/**
 * Worldmap Generator
 * Generates worldmap configuration from discovered modules
 * Layout is automatically generated based on module dependencies from unlockRequirement field
 */

import type { WorldmapConfig, WorldmapNode, WorldmapConnection, WorldmapIcon } from './types.js';
import { getModule } from '../module/registry.js';
import { extractModuleDependencies, extractRequirementTypes, extractRequirementDetails } from '../unlock/requirements.js';
import type { UnlockRequirement } from '../unlock/types.js';

/**
 * Generate worldmap configuration from module IDs
 * Uses module-defined positions when available, otherwise auto-generates based on dependencies
 */
export async function generateWorldmap(moduleIds: string[]): Promise<WorldmapConfig> {
  if (moduleIds.length === 0) {
    return {
      layout: 'linear',
      nodes: [],
      connections: [],
    };
  }

  // Check if all modules have worldmap positions defined
  const modulesWithPositions = moduleIds.filter(id => {
    const module = getModule(id);
    return module?.config.worldmap?.position !== undefined;
  });

  // If all modules have positions, use them
  if (modulesWithPositions.length === moduleIds.length) {
    return generateFromModulePositions(moduleIds);
  }

  // Otherwise, fall back to auto-generation
  return generateFromDependencies(moduleIds);
}

/**
 * Determine icon type based on unlock requirement
 * For locked modules, always use 'lock' since tooltip shows specific requirements
 */
function getIconTypeForRequirement(requirement: UnlockRequirement | null | undefined): WorldmapIcon['iconType'] {
  if (!requirement) {
    return 'pin'; // Default for no requirements (unlocked modules)
  }

  // All locked modules use 'lock' icon - tooltip shows specific requirements
  return 'lock';
}

/**
 * Generate worldmap from module-defined positions
 */
function generateFromModulePositions(moduleIds: string[]): WorldmapConfig {
  const nodes: WorldmapNode[] = [];
  const connections: WorldmapConnection[] = [];

  // Create nodes from module configurations
  moduleIds.forEach(moduleId => {
    const module = getModule(moduleId);
    if (!module || !module.config.worldmap?.position) {
      return;
    }

    const unlockReq = module.config.unlockRequirement;
    const iconType = getIconTypeForRequirement(unlockReq);
    const reqTypes = unlockReq ? extractRequirementTypes(unlockReq) : undefined;
    const reqDetails = unlockReq ? extractRequirementDetails(unlockReq) : undefined;

    // Use module-defined icon or defaults
    const moduleIcon = module.config.worldmap.icon;
    const icon: WorldmapIcon = {
      shape: moduleIcon?.shape || 'circle',
      size: moduleIcon?.size || 48,
      iconType,
    };

    nodes.push({
      moduleId,
      position: module.config.worldmap.position,
      icon,
      summary: module.config.manifest.summary,
      unlockRequirementTypes: reqTypes,
      unlockRequirementDetails: reqDetails,
    });
  });

  // Generate connections based on unlock requirements only
  // Connections are only created when modules explicitly depend on each other
  moduleIds.forEach(moduleId => {
    const module = getModule(moduleId);
    if (!module) return;

    const unlockReq = module.config.unlockRequirement;
    if (!unlockReq) return;

    const dependencies = extractModuleDependencies(unlockReq);
    dependencies.forEach(depId => {
      if (moduleIds.includes(depId)) {
        connections.push({
          from: depId,
          to: moduleId,
          locked: true,
          style: 'dashed',
        });
      }
    });
  });

  return {
    layout: 'branching', // Default to branching when using custom positions
    nodes,
    connections,
  };
}

/**
 * Auto-generate worldmap layout based on dependency graph
 * Creates a tree structure where modules without dependencies are at the start,
 * and modules with dependencies are positioned based on their requirements
 */
function generateFromDependencies(moduleIds: string[]): WorldmapConfig {
  const nodes: WorldmapNode[] = [];
  const connections: WorldmapConnection[] = [];
  const positioned = new Set<string>();

  // Build dependency graph from unlockRequirement
  const modules = moduleIds.map(id => {
    const module = getModule(id);
    const unlockReq = module?.config.unlockRequirement;
    const dependencies = unlockReq 
      ? extractModuleDependencies(unlockReq)
      : [];
    
    return {
      id,
      module,
      dependencies,
    };
  }).filter(m => m.module !== null);

  // Find root modules (no dependencies or dependencies not in the set)
  const rootModules = modules.filter(m => 
    m.dependencies.length === 0 || 
    !m.dependencies.some(dep => moduleIds.includes(dep))
  );

  // Position root modules
  if (rootModules.length === 1) {
    // Single root: place at left center
    const root = rootModules[0];
    const unlockReq = root.module?.config.unlockRequirement;
    const iconType = getIconTypeForRequirement(unlockReq);
    const reqTypes = unlockReq ? extractRequirementTypes(unlockReq) : undefined;
    const reqDetails = unlockReq ? extractRequirementDetails(unlockReq) : undefined;
    nodes.push({
      moduleId: root.id,
      position: { x: 15, y: 50 },
      icon: { shape: 'circle', size: 56, iconType },
      summary: root.module?.config.manifest.summary,
      unlockRequirementTypes: reqTypes,
      unlockRequirementDetails: reqDetails,
    });
    positioned.add(root.id);
  } else if (rootModules.length > 1) {
    // Multiple roots: spread vertically
    rootModules.forEach((root, index) => {
      const ySpacing = 100 / (rootModules.length + 1);
      const y = 20 + (index + 1) * ySpacing;
      const unlockReq = root.module?.config.unlockRequirement;
      const iconType = getIconTypeForRequirement(unlockReq);
      const reqTypes = unlockReq ? extractRequirementTypes(unlockReq) : undefined;
      const reqDetails = unlockReq ? extractRequirementDetails(unlockReq) : undefined;
      nodes.push({
        moduleId: root.id,
        position: { x: 15, y },
        icon: { shape: 'circle', size: 48, iconType },
        summary: root.module?.config.manifest.summary,
        unlockRequirementTypes: reqTypes,
        unlockRequirementDetails: reqDetails,
      });
      positioned.add(root.id);
    });
  }

  // Position remaining modules based on their dependencies
  let currentX = 40;
  const maxDepth = 5;
  
  for (let depth = 1; depth <= maxDepth; depth++) {
    const modulesAtDepth = modules.filter(m => 
      !positioned.has(m.id) &&
      m.dependencies.every(dep => positioned.has(dep) || !moduleIds.includes(dep))
    );

    if (modulesAtDepth.length === 0) break;

    // Group by dependency count
    const byDependencyCount = new Map<number, typeof modulesAtDepth>();
    modulesAtDepth.forEach(m => {
      const count = m.dependencies.filter(dep => moduleIds.includes(dep)).length;
      if (!byDependencyCount.has(count)) {
        byDependencyCount.set(count, []);
      }
      byDependencyCount.get(count)!.push(m);
    });

    // Position modules at this depth
    modulesAtDepth.forEach((moduleData, index) => {
      const dependencyCount = moduleData.dependencies.filter(dep => moduleIds.includes(dep)).length;
      const siblings = byDependencyCount.get(dependencyCount) || [];
      const siblingIndex = siblings.indexOf(moduleData);
      
      // Calculate Y position based on dependencies
      let y = 50;
      if (moduleData.dependencies.length > 0) {
        const dependencyNodes = moduleData.dependencies
          .filter(dep => moduleIds.includes(dep))
          .map(dep => nodes.find(n => n.moduleId === dep))
          .filter(Boolean) as WorldmapNode[];
        
        if (dependencyNodes.length > 0) {
          const avgY = dependencyNodes.reduce((sum, n) => sum + n.position.y, 0) / dependencyNodes.length;
          y = avgY + (siblingIndex - (siblings.length - 1) / 2) * 15;
          y = Math.max(15, Math.min(85, y)); // Clamp to bounds
        }
      } else {
        // No dependencies: spread evenly
        const ySpacing = 100 / (modulesAtDepth.length + 1);
        y = 20 + (index + 1) * ySpacing;
      }

      const unlockReq = moduleData.module?.config.unlockRequirement;
      const iconType = getIconTypeForRequirement(unlockReq);
      const reqTypes = unlockReq ? extractRequirementTypes(unlockReq) : undefined;
      const reqDetails = unlockReq ? extractRequirementDetails(unlockReq) : undefined;
      nodes.push({
        moduleId: moduleData.id,
        position: { x: currentX, y },
        icon: { 
          shape: dependencyCount > 1 ? 'diamond' : dependencyCount === 1 ? 'square' : 'circle',
          size: dependencyCount > 1 ? 52 : 48,
          iconType,
        },
        summary: moduleData.module?.config.manifest.summary,
        unlockRequirementTypes: reqTypes,
        unlockRequirementDetails: reqDetails,
      });
      positioned.add(moduleData.id);

      // Create connections from dependencies
      moduleData.dependencies
        .filter(dep => moduleIds.includes(dep))
        .forEach(dep => {
          connections.push({
            from: dep,
            to: moduleData.id,
            locked: dependencyCount > 1,
            style: dependencyCount > 1 ? 'dashed' : 'solid',
          });
        });
    });

    currentX += 25;
    if (currentX > 85) break;
  }

  // Handle any remaining unpositioned modules (orphans)
  modules.forEach(moduleData => {
    if (!positioned.has(moduleData.id)) {
      const unlockReq = moduleData.module?.config.unlockRequirement;
      const iconType = getIconTypeForRequirement(unlockReq);
      const reqTypes = unlockReq ? extractRequirementTypes(unlockReq) : undefined;
      const reqDetails = unlockReq ? extractRequirementDetails(unlockReq) : undefined;
      nodes.push({
        moduleId: moduleData.id,
        position: { x: 50, y: 50 },
        icon: { shape: 'circle', size: 44, iconType },
        summary: moduleData.module?.config.manifest.summary,
        unlockRequirementTypes: reqTypes,
        unlockRequirementDetails: reqDetails,
      });
    }
  });

  return {
    layout: 'branching',
    nodes,
    connections,
  };
}
