/**
 * Modulväg-komponent
 * Super Mario-världskarteliknande modulval
 * Flexibla layouter, verktygstips, kopplingar
 */

import { useState, useCallback } from 'react';
import type { WorldmapConfig, WorldmapNode, WorldmapConnection } from '@types/worldmap.types.js';
import { useModuleStore } from '@stores/moduleStore/index.js';
import { ModuleInfoModal } from './ModuleInfoModal.js';
import { getThemeValue } from '@utils/theme.js';
import { ConnectionLines, ModuleNode } from './modulePath/index.js';

export interface ModulePathProps {
  /**
   * Världskartskonfiguration
   */
  worldmap: WorldmapConfig;

  /**
   * Callback när modul väljs för att gå in
   */
  onSelectModule: (moduleId: string) => void;

  /**
   * Kantfärg (standard från tema)
   */
  borderColor?: string;
}

/**
 * Modulväg-komponent
 */
export function ModulePath({
  worldmap,
  onSelectModule,
  borderColor,
}: ModulePathProps) {
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const { getModuleProgression } = useModuleStore();
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');

  const handleModuleClick = useCallback(
    (moduleId: string) => {
      const progression = getModuleProgression(moduleId);
      if (progression === 'unlocked' || progression === 'completed') {
        setSelectedModuleId(moduleId);
      }
    },
    [getModuleProgression]
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

  // Hämta vald moduldata
  const selectedNode = selectedModuleId
    ? worldmap.nodes.find((n: WorldmapNode) => n.moduleId === selectedModuleId)
    : null;

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* SVG för kopplingar */}
      <ConnectionLines
        nodes={worldmap.nodes}
        connections={worldmap.connections}
        borderColor={borderColorValue}
        isConnectionUnlocked={isConnectionUnlocked}
        getModuleProgression={getModuleProgression}
      />

      {/* Modulnoder */}
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

      {/* Modulinformationsmodal */}
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
