/**
 * Module path component
 * Super Mario world map-like module selection
 * Flexible layouts, tooltips, connections
 */

import { useState, useCallback } from 'react';
import type { WorldmapConfig, WorldmapNode, WorldmapConnection } from '@core/worldmap/types.js';
import { actions } from '@core/state/actions.js';
import { useAppStore } from '@core/state/store.js';
import { canUnlockModule } from '@core/unlock/service.js';
import { getModule } from '@core/module/registry.js';
import { ModuleInfoModal } from './ModuleInfoModal.js';
import { useThemeBorderColor } from '../../hooks/useThemeBorderColor.js';
import { ConnectionLines, ModuleNode } from './modulePath/index.js';

export interface ModulePathProps {
  /**
   * Worldmap configuration
   */
  worldmap: WorldmapConfig;

  /**
   * Callback when module is selected to enter
   */
  onSelectModule: (moduleId: string) => void;

  /**
   * Callback when module requires password
   */
  onPasswordRequired?: (moduleId: string, hint?: string, moduleName?: string) => void;

  /**
   * Border color (default from theme)
   */
  borderColor?: string;
}

/**
 * Module path component
 */
export function ModulePath({
  worldmap,
  onSelectModule,
  onPasswordRequired,
  borderColor,
}: ModulePathProps) {
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const borderColorValue = useThemeBorderColor(borderColor);
  
  // Subscribe to module progression state changes
  const moduleProgression = useAppStore((state) => state.moduleProgression);
  
  const getModuleProgression = useCallback((moduleId: string) => {
    // moduleProgression is Record<string, ModuleProgression> where ModuleProgression has a 'state' property
    const progression = moduleProgression[moduleId];
    return progression?.state || 'locked';
  }, [moduleProgression]);

  const handleModuleClick = useCallback(
    async (moduleId: string) => {
      const progression = getModuleProgression(moduleId);
      const module = getModule(moduleId);
      const unlockReq = module?.config.unlockRequirement;
      
      // If already unlocked or completed, allow entry (password was already entered)
      if (progression === 'unlocked' || progression === 'completed') {
        setSelectedModuleId(moduleId);
        return;
      }

      // Check if module can be unlocked
      const { canUnlock, requiresInteraction } = await canUnlockModule(moduleId);

      // If requires user interaction (password), trigger password modal
      if (requiresInteraction && onPasswordRequired) {
        if (unlockReq?.type === 'password') {
          onPasswordRequired(
            moduleId,
            unlockReq.hint,
            module?.config.manifest.name
          );
          return;
        }
      }

      // If can unlock without interaction, allow entry
      if (canUnlock) {
        setSelectedModuleId(moduleId);
      }
    },
    [getModuleProgression, onPasswordRequired]
  );

  const handleEnterModule = useCallback(() => {
    if (selectedModuleId) {
      onSelectModule(selectedModuleId);
      setSelectedModuleId(null);
    }
  }, [selectedModuleId, onSelectModule]);

  const isConnectionUnlocked = useCallback(
    (connection: WorldmapConnection): boolean => {
      const fromProgression = getModuleProgression(connection.from);
      return fromProgression === 'completed' || fromProgression === 'unlocked';
    },
    [getModuleProgression]
  );

  // Get selected module data
  const selectedNode = selectedModuleId
    ? worldmap.nodes.find((n: WorldmapNode) => n.moduleId === selectedModuleId)
    : null;

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden border-2" 
      style={{ 
        height: '100%',
        borderColor: borderColorValue,
        background: `
          linear-gradient(to bottom, 
            rgba(139, 115, 85, 0.15) 0%, 
            rgba(101, 67, 33, 0.2) 50%, 
            rgba(139, 115, 85, 0.15) 100%
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(139, 115, 85, 0.1) 2px,
            rgba(139, 115, 85, 0.1) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(139, 115, 85, 0.1) 2px,
            rgba(139, 115, 85, 0.1) 4px
          ),
          radial-gradient(
            circle at 20% 30%,
            rgba(255, 215, 0, 0.05) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at 80% 70%,
            rgba(255, 215, 0, 0.05) 0%,
            transparent 50%
          ),
          linear-gradient(135deg, #2a1f1a 0%, #1a1510 100%)
        `,
        boxShadow: `inset 0 0 100px rgba(0, 0, 0, 0.5), 0 0 20px ${borderColorValue}30`,
      }}
    >
      {/* Decorative corner elements */}
      <div 
        className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2"
        style={{ borderColor: borderColorValue, opacity: 0.3 }}
      />
      <div 
        className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2"
        style={{ borderColor: borderColorValue, opacity: 0.3 }}
      />
      <div 
        className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2"
        style={{ borderColor: borderColorValue, opacity: 0.3 }}
      />
      <div 
        className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2"
        style={{ borderColor: borderColorValue, opacity: 0.3 }}
      />
      
      {/* SVG for connections */}
      <ConnectionLines
        nodes={worldmap.nodes}
        connections={worldmap.connections}
        borderColor={borderColorValue}
        isConnectionUnlocked={isConnectionUnlocked}
        getModuleProgression={getModuleProgression}
      />

      {/* Module nodes */}
      {worldmap.nodes.map((node: WorldmapNode) => {
        const progression = getModuleProgression(node.moduleId);
        const isHovered = hoveredModuleId === node.moduleId;

        return (
          <ModuleNode
            key={node.moduleId}
            node={node}
            progression={progression}
            isHovered={isHovered}
            borderColor={borderColorValue}
            onClick={() => handleModuleClick(node.moduleId)}
            onMouseEnter={() => setHoveredModuleId(node.moduleId)}
            onMouseLeave={() => setHoveredModuleId(null)}
          />
        );
      })}

      {/* Module info modal */}
      {selectedNode && (() => {
        const progression = getModuleProgression(selectedNode.moduleId);
        return (
          <ModuleInfoModal
            isOpen={selectedModuleId !== null}
            onClose={() => setSelectedModuleId(null)}
            moduleId={selectedNode.moduleId}
            moduleName={selectedNode.moduleId.replace(/-/g, ' ')}
            description={selectedNode.summary}
            isUnlocked={progression !== 'locked'}
            isCompleted={progression === 'completed'}
            onEnterModule={handleEnterModule}
            borderColor={borderColorValue}
          />
        );
      })()}
    </div>
  );
}
