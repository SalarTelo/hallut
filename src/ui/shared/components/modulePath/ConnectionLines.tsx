/**
 * ConnectionLines Component
 * SVG rendering for worldmap connections between modules
 */

import type { WorldmapConnection, WorldmapNode } from '@core/worldmap/types.js';
import type { ModuleProgressionState } from '@core/state/types.js';
import {
  getConnectionNodes,
  getConnectionState,
  getStrokeDasharray,
  getConnectionKey,
  getGradientId,
  getGradientColors,
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
          const { fromNode, toNode } = connectionNodes;
          
          // Always create gradient for all connections using unified logic
          const { fromColor, toColor, fromOpacity, toOpacity } = getGradientColors(state, borderColor);

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
                stopColor={fromColor}
                stopOpacity={fromOpacity}
              />
              <stop
                offset="100%"
                stopColor={toColor}
                stopOpacity={toOpacity}
              />
            </linearGradient>
          );
        })}
      </defs>
      {connections.map((connection) => {
        const connectionNodes = getConnectionNodes(connection, nodes);
        if (!connectionNodes) return null;

        const { fromNode, toNode } = connectionNodes;
        const isUnlocked = isConnectionUnlocked(connection);
        const connectionStyle = connection.style || (isUnlocked ? 'solid' : 'dashed');
        const strokeDasharray = getStrokeDasharray(connectionStyle);
        
        // Always use gradient for all connections
        const gradientId = getGradientId(connection);
        
        return (
          <g key={getConnectionKey(connection)}>
            {/* Glow effect - always uses gradient for all line styles */}
            <line
              x1={`${fromNode.position.x}%`}
              y1={`${fromNode.position.y}%`}
              x2={`${toNode.position.x}%`}
              y2={`${toNode.position.y}%`}
              stroke={`url(#${gradientId})`}
              strokeWidth="4"
              strokeDasharray={strokeDasharray}
              strokeOpacity="0.3"
              style={{ filter: 'blur(4px)' }}
            />
            {/* Main connection line - always uses gradient for all styles (solid, dashed, dotted) */}
            <line
              x1={`${fromNode.position.x}%`}
              y1={`${fromNode.position.y}%`}
              x2={`${toNode.position.x}%`}
              y2={`${toNode.position.y}%`}
              stroke={`url(#${gradientId})`}
              strokeWidth={isUnlocked ? '3' : '2'}
              strokeDasharray={strokeDasharray}
              style={{ transition: 'all 0.3s ease' }}
            />
          </g>
        );
      })}
    </svg>
  );
}

