import { useState, useEffect, useCallback, useRef } from 'react';
import { useI18n } from '../../i18n/context.js';
import type { WorldMapConfig, WorldNode as WorldNodeType, Position } from '../../types/WorldMap.types';
import { WorldNode } from '../WorldNode';
import { Mario } from '../Mario';
import { TaskDetailsPopup } from './TaskDetailsPopup';
import { useModuleStore } from '../../store/moduleStore.js';
import { moduleActions } from '../../store/moduleActions.js';
import '../WorldMap.css';

export interface WorldMapViewProps {
  config?: WorldMapConfig;
  onNodeClick?: (nodeId: string) => void;
  onNodeComplete?: (nodeId: string) => void;
  onNext?: () => void;
  moduleState?: Record<string, unknown>;
  [key: string]: unknown; // Allow other props from module script
}

export function WorldMapView(props: WorldMapViewProps) {
  const { t } = useI18n();
  const {
    config: configProp,
    onNodeClick,
    onNodeComplete,
    onNext,
    moduleState: _moduleStateProp,
  } = props;
  
  // Use store instead of prop
  const currentModuleId = useModuleStore((state) => state.currentModuleId);
  const moduleProgress = useModuleStore((state) => 
    currentModuleId ? state.getProgress(currentModuleId) : null
  );
  const moduleState = moduleProgress?.state || {};
  
  // Extract config from props (the module script passes it as props.config)
  // StepRenderer spreads step.props, so config comes directly from props.config
  // For now, use direct prop access (props come from StepRenderer which spreads step.props)
  // In the future, we could pass the step config here and use extractWorldMapProps
  const config = configProp;
  
  if (!config || !config.nodes) {
    return (
      <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-error)' }}>
        <div>{t.errors.worldMapMissing}</div>
        <div className="text-xs" style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-neutral-600)' }}>
          Props: {JSON.stringify(Object.keys(props))}
        </div>
      </div>
    );
  }
  const [currentNodeId, setCurrentNodeId] = useState(config.startNodeId);
  const [nodes, setNodes] = useState<WorldNodeType[]>(config.nodes);
  const [selectedTaskNode, setSelectedTaskNode] = useState<WorldNodeType | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentNode = nodes.find((n: WorldNodeType) => n.id === currentNodeId);

  // Animated player position in percentage coordinates
  const [playerPos, setPlayerPos] = useState<Position>(() =>
    currentNode ? { ...currentNode.position } : { x: 0, y: 0 }
  );
  const isMovingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Ensure player position syncs to current node when not moving
  useEffect(() => {
    if (!isMovingRef.current && currentNode) {
      setPlayerPos({ ...currentNode.position });
    }
  }, [currentNodeId]);

  // Bézier helper in percent space
  const quadBezier = (p0: Position, p1: Position, p2: Position, t: number): Position => {
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return { x, y };
  };

  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  // Start movement along curve from current to target node (percent coordinates)
  const moveToNode = useCallback(
    (target: WorldNodeType) => {
      if (!currentNode || isMovingRef.current) return;
      // Only allow if adjacent and target not locked
      if (!currentNode.connectedTo.includes(target.id) || target.state === 'locked') return;

      isMovingRef.current = true;
      // From/To in percent
      const p0: Position = { ...currentNode.position };
      const p2: Position = { ...target.position };
      // Control point similar to draw, but in percent space
      const mid: Position = { x: (p0.x + p2.x) / 2, y: (p0.y + p2.y) / 2 };
      const dx = p2.x - p0.x;
      const dy = p2.y - p0.y;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const perp = angle - Math.PI / 2;
      const offset = dist * 0.08; // gentle curve in percent units
      const p1: Position = { x: mid.x + Math.cos(perp) * offset, y: mid.y + Math.sin(perp) * offset };

      const duration = Math.max(450, Math.min(1400, dist * 18)); // ms, proportional to distance
      let start = 0;

      const step = (ts: number) => {
        if (!start) start = ts;
        const tRaw = Math.min(1, (ts - start) / duration);
        const t = easeInOut(tRaw);
        const pos = quadBezier(p0, p1, p2, t);
        setPlayerPos(pos);
        if (tRaw < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          // Finish
          isMovingRef.current = false;
          setPlayerPos({ ...p2 });
          setCurrentNodeId(target.id);
        }
      };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    },
    [currentNodeId, nodes, currentNode]
  );

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  // Draw paths on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvas = () => {
      // Set canvas size to match container
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all paths
      nodes.forEach((node: WorldNodeType) => {
        node.connectedTo.forEach((connectedId: string) => {
          const connectedNode = nodes.find((n: WorldNodeType) => n.id === connectedId);
          if (!connectedNode) return;

          // Only draw each path once (avoid duplicates)
          if (node.id > connectedId) return;

          // Convert percentage positions to pixel positions
          const x1 = (node.position.x / 100) * canvas.width;
          const y1 = (node.position.y / 100) * canvas.height;
          const x2 = (connectedNode.position.x / 100) * canvas.width;
          const y2 = (connectedNode.position.y / 100) * canvas.height;

          const pathUnlocked =
            node.state === 'unlocked' ||
            node.state === 'completed' ||
            connectedNode.state === 'unlocked' ||
            connectedNode.state === 'completed';

          const isActivePath =
            (node.id === currentNodeId && connectedNode.state !== 'locked') ||
            (connectedNode.id === currentNodeId && node.state !== 'locked');

          // Calculate control point for curve
          const dx = x2 - x1;
          const dy = y2 - y1;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          // Small perpendicular offset for gentle curve
          const offset = distance * 0.1;
          const angle = Math.atan2(dy, dx);
          const perpAngle = angle - Math.PI / 2;

          const controlX = midX + Math.cos(perpAngle) * offset;
          const controlY = midY + Math.sin(perpAngle) * offset;

          // Draw shadow path
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(controlX, controlY, x2, y2);
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.lineWidth = 8;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Draw main path
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(controlX, controlY, x2, y2);

          if (isActivePath) {
            ctx.strokeStyle = '#ffeb3b';
            ctx.lineWidth = 6;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffeb3b';
          } else if (pathUnlocked) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.shadowBlur = 0;
          } else {
            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 0;
            ctx.setLineDash([8, 8]);
          }

          ctx.globalAlpha = pathUnlocked ? 0.9 : 0.5;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        });
      });
    };

    updateCanvas();

    // Redraw when window resizes
    const handleResize = () => {
      updateCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [nodes, currentNodeId]);

  const startTask = useCallback(() => {
    // Just advance to the next step (the task), don't complete the node yet
    if (onNext) {
      onNext();
    }
  }, [onNext]);

  const completeNode = useCallback(() => {
    if (!currentNode) return;

    setNodes((prevNodes: WorldNodeType[]) =>
      prevNodes.map((node: WorldNodeType) => {
        if (node.id === currentNodeId) {
          return { ...node, state: 'completed' as const };
        }
        if (currentNode.connectedTo.includes(node.id) && node.state === 'locked') {
          return { ...node, state: 'unlocked' as const };
        }
        return node;
      })
    );

    if (onNodeComplete) {
      onNodeComplete(currentNodeId);
    }
  }, [currentNode, currentNodeId, onNodeComplete]);

  // Store completeNode in moduleState so GuardAgent can call it when task is completed
  useEffect(() => {
    if (!currentModuleId) return;
    
    // Store the completion function in moduleState
    // This allows GuardAgent to call it after successful task completion
    moduleActions.setModuleStateField(currentModuleId, 'completeWorldMapNode', completeNode);
    
    // Check for unlock password from LabAssistant
    const unlockPassword = moduleState.unlockPassword;
    if (unlockPassword) {
      // Find node that matches this password and unlock it
      setNodes((prevNodes: WorldNodeType[]) =>
        prevNodes.map((node: WorldNodeType) => {
          if (node.unlockpassword === unlockPassword && node.state === 'locked') {
            return { ...node, state: 'unlocked' as const };
          }
          return node;
        })
      );
      // Clear the password from moduleState
      moduleActions.setModuleStateField(currentModuleId, 'unlockPassword', undefined);
    }
  }, [moduleState.unlockPassword, completeNode, currentModuleId]);

  const handleNodeClick = (node: WorldNodeType) => {
    // If it's an unlocked task node (not the starting position), show task details popup
    if (node.state !== 'locked' && node.state !== 'completed' && node.id !== config.startNodeId) {
      setSelectedTaskNode(node);
    } else if (onNodeClick) {
      onNodeClick(node.id);
    }
  };

  const handleBeginTask = () => {
    if (selectedTaskNode && onNext) {
      setSelectedTaskNode(null);
      // Store the selected task node ID in moduleState so the task steps know which task to load
      const taskStepMap: Record<string, string> = {
        'task-1': 'task-1-guard-intro',
        'task-2': 'task-2-guard-intro',
      };
      if (currentModuleId) {
        moduleActions.setModuleStateField(currentModuleId, 'currentTaskNodeId', selectedTaskNode.id);
        moduleActions.setModuleStateField(currentModuleId, 'targetStepId', taskStepMap[selectedTaskNode.id]);
      }
      onNext();
    }
  };

  return (
    <div
      style={{
        backgroundColor: config.backgroundColor || 'var(--game-primary)',
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          padding: 'var(--spacing-6)',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
          color: 'var(--game-text-primary)',
          marginBottom: 0,
          backdropFilter: 'blur(10px)',
          borderBottom: '3px solid var(--game-world-border)',
        }}
      >
        <h1
          className="h1"
          style={{
            margin: '0 0 var(--spacing-3) 0',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 235, 59, 0.3)',
            fontFamily: 'var(--font-family-pixel)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--game-world-border)',
          }}
        >
          {config.name}
        </h1>
        <p
          className="text-sm"
          style={{
            margin: 0,
            color: 'var(--game-text-secondary)',
            fontFamily: 'var(--font-family-pixel)',
          }}
        >
          Navigate the map and click on tasks to begin
        </p>
      </div>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
          height: '600px',
          minHeight: '400px',
          background: 'linear-gradient(to bottom, var(--game-primary) 0%, var(--game-primary-dark) 100%)',
          overflow: 'hidden',
          margin: '0 auto',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Canvas for drawing paths */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Render all nodes */}
        {nodes.map((node) => {
          const isAdjacent = currentNode?.connectedTo.includes(node.id) || false;

          return (
            <WorldNode
              key={node.id}
              node={node}
              isActive={node.id === currentNodeId}
              isAdjacent={isAdjacent}
              onClick={() => {
                if (isAdjacent && node.state !== 'locked') {
                  moveToNode(node);
                }
                handleNodeClick(node);
              }}
              onDoubleClick={() => {
                if (node.state !== 'locked') {
                  handleNodeClick(node);
                }
              }}
              onComplete={() => {
                if (node.id === currentNodeId) {
                  startTask();
                }
              }}
            />
          );
        })}

        {/* Render player at current position */}
        {currentNode && <Mario position={playerPos} />}
      </div>

      {/* Task Details Popup */}
      {selectedTaskNode && (
        <TaskDetailsPopup
          node={selectedTaskNode}
          onBeginTask={handleBeginTask}
          onClose={() => setSelectedTaskNode(null)}
        />
      )}
    </div>
  );
}
