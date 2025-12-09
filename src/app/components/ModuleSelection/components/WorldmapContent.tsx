/**
 * Worldmap Content Component
 * Content area for the worldmap view
 */

import { ModulePath } from '@ui/shared/components/game/index.js';
import type { WorldmapConfig } from '@core/worldmap/types.js';

export interface WorldmapContentProps {
  worldmap: WorldmapConfig;
  onSelectModule: (moduleId: string) => void;
  onPasswordRequired: (moduleId: string) => void;
}

/**
 * Worldmap Content component
 */
export function WorldmapContent({
  worldmap,
  onSelectModule,
  onPasswordRequired,
}: WorldmapContentProps) {
  return (
    <div className="flex-1 w-full p-4 overflow-hidden">
      <div className="w-full h-full" style={{ position: 'relative' }}>
        <ModulePath
          worldmap={worldmap}
          onSelectModule={onSelectModule}
          onPasswordRequired={onPasswordRequired}
        />
      </div>
    </div>
  );
}

