/**
 * ConnectionLines Component
 * SVG rendering for worldmap connections between modules
 */

import type { WorldmapConnection, WorldmapNode } from '@types/worldmap.types.js';
import type { ModuleProgressionState } from '@types/core/moduleProgression.types.js';
import {
  hexToRgba,
  getConnectionNodes,
  getConnectionState,
  getStrokeDasharray,
  getConnectionKey,
  getGradientId,
  getStrokeColor,
} from './utils.js';

export interface ConnectionLinesProps {
  /**
   * All nodes in the worldmap
   */
  nodes: WorldmapNode[];

  /**
   * Connections to render
   */
  connections: WorldmapConnection[];

  /**
   * Border/connection color
   */
  borderColor: string;

  /**
   * Function to check if a connection is unlocked
   */
  isConnectionUnlocked: (connection: WorldmapConnection) => boolean;

  /**
   * Function to get the progression state of a module
   */
  getModuleProgression: (moduleId: string) => ModuleProgressionState;
}

/**
 * ConnectionLines component
 */
export function ConnectionLines({
  nodes,
  connections,
  borderColor,
  isConnectionUnlocked,
  getModuleProgression,
}: ConnectionLinesProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        {connections.map((connection) => {
          const connectionNodes = getConnectionNodes(connection, nodes);
          if (!connectionNodes) return null;

          const state = getConnectionState(connection, getModuleProgression);
          if (!state.isPartiallyUnlocked) return null;

          const { fromNode, toNode } = connectionNodes;
          return (
            <linearGradient
              key={getGradientId(connection)}
              id={getGradientId(connection)}
              x1={`${fromNode.position.x}%`}
              y1={`${fromNode.position.y}%`}
              x2={`${toNode.position.x}%`}
              y2={`${toNode.position.y}%`}
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0%"
                stopColor={state.fromUnlocked ? borderColor : '#666666'}
                stopOpacity={state.fromUnlocked ? 0.9 : 0.4}
              />
              <stop
                offset="100%"
                stopColor={state.toUnlocked ? borderColor : '#666666'}
                stopOpacity={state.toUnlocked ? 0.9 : 0.4}
              />
            </linearGradient>
          );
        })}
      </defs>
      {connections.map((connection) => {
        const connectionNodes = getConnectionNodes(connection, nodes);
        if (!connectionNodes) return null;

        const { fromNode, toNode } = connectionNodes;
        const state = getConnectionState(connection, getModuleProgression);
        const isUnlocked = isConnectionUnlocked(connection);
        const connectionStyle = connection.style || (isUnlocked ? 'solid' : 'dashed');
        const strokeDasharray = getStrokeDasharray(connectionStyle);
        const strokeColor = getStrokeColor(connection, state, isUnlocked, borderColor);

        return (
          <g key={getConnectionKey(connection)}>
            {/* Glow effect for unlocked connections */}
            {isUnlocked && !state.isPartiallyUnlocked && (
              <line
                x1={`${fromNode.position.x}%`}
                y1={`${fromNode.position.y}%`}
                x2={`${toNode.position.x}%`}
                y2={`${toNode.position.y}%`}
                stroke={hexToRgba(borderColor, 0.3)}
                strokeWidth="4"
                strokeDasharray={strokeDasharray}
                style={{ filter: 'blur(4px)' }}
              />
            )}
            {/* Main connection line */}
            <line
              x1={`${fromNode.position.x}%`}
              y1={`${fromNode.position.y}%`}
              x2={`${toNode.position.x}%`}
              y2={`${toNode.position.y}%`}
              stroke={strokeColor}
              strokeWidth={isUnlocked || state.isPartiallyUnlocked ? '3' : '2'}
              strokeDasharray={strokeDasharray}
              opacity={state.isPartiallyUnlocked ? undefined : isUnlocked ? 0.9 : 0.4}
              style={{ transition: 'all 0.3s ease' }}
            />
          </g>
        );
      })}
    </svg>
  );
}

