/**
 * Worldmap Types
 * Defines the worldmap structure for module selection and progression
 * Modules don't know about each other - worldmap handles connections
 */

/**
 * Module node in the worldmap
 * Represents a module's position and appearance in the worldmap
 */
export interface WorldmapNode {
  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Position in the worldmap layout
   */
  position: {
    x: number;
    y: number;
  };

  /**
   * Module icon configuration
   */
  icon?: {
    shape?: 'circle' | 'square' | string;
    size?: number;
    style?: Record<string, unknown>;
  };

  /**
   * Module summary for tooltips
   */
  summary?: string;
}

/**
 * Connection between modules in the worldmap
 */
export interface WorldmapConnection {
  /**
   * Source module ID
   */
  from: string;

  /**
   * Target module ID
   */
  to: string;

  /**
   * Whether this connection is locked
   * Locked connections use different visual style
   */
  locked: boolean;

  /**
   * Connection style (for visual distinction)
   */
  style?: 'dotted' | 'dashed' | 'solid';
}

/**
 * Worldmap layout configuration
 */
export type WorldmapLayout = 'linear' | 'branching' | string;

/**
 * Worldmap configuration
 * Defines the entire worldmap structure
 */
export interface WorldmapConfig {
  /**
   * Layout type
   */
  layout: WorldmapLayout;

  /**
   * All module nodes in the worldmap
   */
  nodes: WorldmapNode[];

  /**
   * Connections between modules
   */
  connections: WorldmapConnection[];
}
