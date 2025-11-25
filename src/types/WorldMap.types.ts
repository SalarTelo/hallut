export interface Position {
  x: number;
  y: number;
}

export type NodeState = 'locked' | 'unlocked' | 'completed' | 'current';

export interface WorldContent {
  introduction?: string;
  sections?: {
    title: string;
    content: string;
  }[];
  summary?: string;
  resources?: {
    title: string;
    url: string;
  }[];
}

export interface WorldNode {
  id: string;
  position: Position;
  levelNumber: number;
  state: NodeState;
  connectedTo: string[]; // IDs of connected nodes
  label?: string;
  title?: string;
  description?: string;
  unlockpassword?: string;
}

export interface WorldMapConfig {
  id: string;
  name: string;
  nodes: WorldNode[];
  startNodeId: string;
  backgroundColor?: string;
}
