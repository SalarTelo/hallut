/**
 * Worldmap Types
 * Types for worldmap/module path visualization
 */

/**
 * Worldmap layout type
 */
export type WorldmapLayout = 'linear' | 'branching' | 'grid';

/**
 * Worldmap node position
 */
export interface WorldmapPosition {
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
}

/**
 * Worldmap node icon configuration
 */
export interface WorldmapIcon {
  shape: 'circle' | 'square' | 'diamond';
  size: number;
}

/**
 * Worldmap node
 */
export interface WorldmapNode {
  moduleId: string;
  position: WorldmapPosition;
  icon?: WorldmapIcon;
  summary?: string;
}

/**
 * Worldmap connection style
 */
export type ConnectionStyle = 'solid' | 'dashed' | 'dotted';

/**
 * Worldmap connection
 */
export interface WorldmapConnection {
  from: string; // Module ID
  to: string; // Module ID
  locked?: boolean;
  style?: ConnectionStyle;
}

/**
 * Worldmap configuration
 */
export interface WorldmapConfig {
  layout: WorldmapLayout;
  nodes: WorldmapNode[];
  connections: WorldmapConnection[];
}

