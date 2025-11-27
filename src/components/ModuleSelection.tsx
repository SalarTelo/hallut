import { useState, useRef, useEffect, useMemo } from 'react';
import { useI18n } from '../i18n/context.js';
import { useModuleStore } from '../store/moduleStore.js';
import '../styles/game-theme.css';

export interface Module {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ModuleSelectionProps {
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
}

interface ModuleNode {
  id: string;
  position: { x: number; y: number };
  module: Module;
  connectedTo: string[]; // IDs of modules that come after this one
  state: 'locked' | 'unlocked' | 'completed';
}

export function ModuleSelection({ modules, onSelectModule }: ModuleSelectionProps) {
  const { t } = useI18n();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useModuleStore((state) => state.progress);

  // Define module order and connections (like Mario World paths)
  const moduleOrder = [
    'text-generation',
      'image-recognition',
      'sound-generation',
  ];

  // Get completed modules from store
  // A module is completed if all its tasks are completed
  const completedModules = useMemo(() => {
    return modules.filter(module => {
      const moduleProgress = progress[module.id];
      if (!moduleProgress) return false;
      // For now, consider a module complete if it has any completed tasks
      // This can be refined later to check if ALL tasks are complete
      return (moduleProgress.completedTasks?.length || 0) > 0;
    }).map(m => m.id);
  }, [modules, progress]);

  // Determine module state
  const getModuleState = (moduleId: string, index: number): 'locked' | 'unlocked' | 'completed' => {
    if (completedModules.includes(moduleId)) {
      return 'completed';
    }
    // First module (intro) is always unlocked
    if (index === 0) {
      return 'unlocked';
    }
    // Module is unlocked if previous module is completed
    const previousModuleId = moduleOrder[index - 1];
    if (completedModules.includes(previousModuleId)) {
      return 'unlocked';
    }
    return 'locked';
  };

  // Create nodes from modules with positions in a path layout
  const nodes: ModuleNode[] = modules
    .map((module) => {
      const orderIndex = moduleOrder.indexOf(module.id);
      if (orderIndex === -1) return null; // Skip modules not in the defined order

      // Position nodes in a flowing path (like Mario World)
      // Create a curved path from left to right
      const pathProgress = orderIndex / Math.max(1, moduleOrder.length - 1);
      const x = 15 + (pathProgress * 70); // 15% to 85% horizontally
      
      // Create a wave pattern vertically for visual interest
      const wave = Math.sin(pathProgress * Math.PI * 2) * 15;
      const y = 40 + wave; // Center around 40% with wave variation
      
      // Determine which modules come after this one
      const connectedTo: string[] = [];
      if (orderIndex < moduleOrder.length - 1) {
        connectedTo.push(moduleOrder[orderIndex + 1]);
      }

      return {
        id: module.id,
        position: { x, y },
        module,
        connectedTo,
        state: getModuleState(module.id, orderIndex),
      };
    })
    .filter((node): node is ModuleNode => node !== null);

  // Draw paths between connected nodes (like Mario World)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawPaths = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paths between connected nodes
      nodes.forEach((node) => {
        node.connectedTo.forEach((targetId) => {
          const targetNode = nodes.find((n) => n.id === targetId);
          if (!targetNode) return;

          // Node radius in pixels (80px / 2 = 40px, plus border)
          const nodeRadius = 42;
          
          // Calculate positions in pixels
          const fromCenterX = (node.position.x / 100) * canvas.width;
          const fromCenterY = (node.position.y / 100) * canvas.height;
          const toCenterX = (targetNode.position.x / 100) * canvas.width;
          const toCenterY = (targetNode.position.y / 100) * canvas.height;

          // Calculate direction vector
          const dx = toCenterX - fromCenterX;
          const dy = toCenterY - fromCenterY;
          const angle = Math.atan2(dy, dx);

          // Calculate start and end points at node edges (not centers)
          const fromX = fromCenterX + Math.cos(angle) * nodeRadius;
          const fromY = fromCenterY + Math.sin(angle) * nodeRadius;
          const toX = toCenterX - Math.cos(angle) * nodeRadius;
          const toY = toCenterY - Math.sin(angle) * nodeRadius;

          // Draw curved path (quadratic bezier)
          const midX = (fromX + toX) / 2;
          const midY = (fromY + toY) / 2;
          const perp = angle - Math.PI / 2;
          const pathDist = Math.hypot(toX - fromX, toY - fromY);
          const offset = pathDist * 0.15; // Curve amount
          const controlX = midX + Math.cos(perp) * offset;
          const controlY = midY + Math.sin(perp) * offset;

          // Path color based on whether target is unlocked
          if (targetNode.state === 'locked') {
            ctx.strokeStyle = 'rgba(150, 150, 150, 0.6)';
            ctx.setLineDash([8, 4]);
          } else {
            ctx.strokeStyle = 'rgba(255, 235, 59, 0.8)';
            ctx.setLineDash([]);
          }

          ctx.lineWidth = 6;
          ctx.shadowBlur = 10;
          ctx.shadowColor = targetNode.state === 'locked' ? 'rgba(150, 150, 150, 0.5)' : 'rgba(255, 235, 59, 0.6)';
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.quadraticCurveTo(controlX, controlY, toX, toY);
          ctx.stroke();
        });
      });
    };

    drawPaths();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [nodes]);

  const handleNodeClick = (moduleId: string) => {
    const node = nodes.find((n) => n.id === moduleId);
    // Only allow clicking unlocked modules
    if (node && node.state !== 'locked') {
      onSelectModule(moduleId);
    }
  };

  return (
    <div className="game-bg" style={{ padding: 0, position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          padding: 'var(--spacing-6) var(--spacing-4)',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h1
          className="h1"
          style={{
            margin: '0 0 var(--spacing-2) 0',
            color: 'var(--game-world-border)',
            fontFamily: 'var(--font-family-pixel)',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 235, 59, 0.3)',
          }}
        >
          {t.app.title}
        </h1>
        <p
          className="text-base"
          style={{
            color: 'var(--game-text-secondary)',
            margin: 0,
            fontFamily: 'var(--font-family-pixel)',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
          }}
        >
          {t.app.subtitle}
        </p>
      </div>

      {/* Module Map */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100vh - 200px)',
          minHeight: '500px',
          background: `
            radial-gradient(circle at 20% 30%, rgba(255, 235, 59, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(100, 181, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 60%),
            linear-gradient(135deg, #1a237e 0%, #283593 25%, #303f9f 50%, #3949ab 75%, #3f51b5 100%)
          `,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Decorative background elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)
            `,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Floating orbs/particles - memoized to prevent re-rendering */}
        {useMemo(() => {
          return [...Array(8)].map((_, i) => {
            const size = 20 + Math.random() * 40;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const opacity = 0.1 + Math.random() * 0.2;
            const delay = Math.random() * 5;
            const duration = 15 + Math.random() * 10;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(255, 235, 59, ${opacity}) 0%, transparent 70%)`,
                  left: `${left}%`,
                  top: `${top}%`,
                  animation: `float ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                  pointerEvents: 'none',
                  zIndex: 0,
                  filter: 'blur(2px)',
                }}
              />
            );
          });
        }, [])}
        {/* Cloud-like shapes - memoized to prevent re-rendering */}
        {useMemo(() => {
          return [...Array(5)].map((_, i) => {
            const width = 150 + Math.random() * 100;
            const height = 80 + Math.random() * 50;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const opacity = 0.05 + Math.random() * 0.05;
            const delay = Math.random() * 10;
            const duration = 20 + Math.random() * 15;
            
            return (
              <div
                key={`cloud-${i}`}
                style={{
                  position: 'absolute',
                  width: `${width}px`,
                  height: `${height}px`,
                  background: `radial-gradient(ellipse, rgba(255, 255, 255, ${opacity}) 0%, transparent 70%)`,
                  borderRadius: '50%',
                  left: `${left}%`,
                  top: `${top}%`,
                  filter: 'blur(20px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                  animation: `drift ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          });
        }, [])}
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
            zIndex: 2,
          }}
        />

        {/* Render module nodes */}
        {nodes.map((node) => {
          const isHovered = hoveredModule === node.id;

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isHovered ? 50 : 30,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: node.state === 'locked' ? 'not-allowed' : 'pointer',
              }}
              onClick={() => handleNodeClick(node.id)}
              onMouseEnter={() => setHoveredModule(node.id)}
              onMouseLeave={() => setHoveredModule(null)}
              role="button"
              aria-label={node.module.name}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNodeClick(node.id);
                }
              }}
            >
              {/* Module Node Circle */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor:
                    node.state === 'completed'
                      ? 'var(--game-accent-success)'
                      : node.state === 'unlocked'
                        ? 'var(--game-world-border)'
                        : 'var(--game-world-surface)',
                  border: `4px solid ${
                    node.state === 'locked' ? 'var(--game-text-muted)' : 'var(--game-world-border-light)'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  boxShadow: isHovered && node.state !== 'locked'
                    ? '0 8px 24px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 235, 59, 0.6)'
                    : node.state === 'locked'
                      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 235, 59, 0.3)',
                  transition: 'all var(--transition-base)',
                  transform: isHovered && node.state !== 'locked' ? 'scale(1.2)' : 'scale(1)',
                  filter:
                    node.state === 'locked'
                      ? 'grayscale(0.8) brightness(0.6)'
                      : isHovered
                        ? 'brightness(1.2)'
                        : 'brightness(1)',
                  position: 'relative',
                  cursor: node.state === 'locked' ? 'not-allowed' : 'pointer',
                  opacity: node.state === 'locked' ? 0.6 : 1,
                }}
              >
                {node.state === 'locked' ? '🔒' : node.module.icon || '📚'}
                {/* Completion checkmark */}
                {node.state === 'completed' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--game-accent-success)',
                      border: '3px solid var(--game-world-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>

              {/* Module Label */}
              <div
                style={{
                  marginTop: 'var(--spacing-2)',
                  padding: 'var(--spacing-1) var(--spacing-3)',
                  backgroundColor: 'var(--game-surface-elevated)',
                  border: '2px solid var(--game-world-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'var(--font-family-pixel)',
                  color: 'var(--game-world-border)',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {node.module.name}
              </div>

              {/* Hover Popup */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: 'var(--spacing-3)',
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    backgroundColor: 'var(--game-surface-elevated)',
                    border: '3px solid var(--game-world-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-family-pixel)',
                    color: 'var(--game-text-primary)',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 235, 59, 0.3)',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    minWidth: '250px',
                    textAlign: 'center',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'var(--font-weight-bold)',
                      marginBottom: 'var(--spacing-2)',
                      color: 'var(--game-world-border)',
                    }}
                  >
                    {node.module.name}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--game-text-secondary)',
                      whiteSpace: 'normal',
                      maxWidth: '300px',
                    }}
                  >
                    {node.module.description}
                  </div>
                  {node.state === 'locked' && (
                    <div
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--game-accent-warning)',
                        borderTop: '1px solid var(--game-world-border-light)',
                        paddingTop: 'var(--spacing-2)',
                        marginTop: 'var(--spacing-2)',
                        whiteSpace: 'normal',
                      }}
                    >
                      {t.interactables.requirementPrefix}
                      {(() => {
                        const orderIndex = moduleOrder.indexOf(node.id);
                        if (orderIndex > 0) {
                          const previousModule = modules.find((m) => m.id === moduleOrder[orderIndex - 1]);
                          return previousModule ? previousModule.name : t.interactables.requirementLocked;
                        }
                        return t.interactables.requirementLocked;
                      })()}
                    </div>
                  )}
                  {/* Tooltip arrow */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid var(--game-world-border)',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {modules.length === 0 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              padding: 'var(--spacing-12)',
              color: 'var(--game-text-muted)',
              fontFamily: 'var(--font-family-pixel)',
            }}
          >
            {t.moduleSelection.noModules}
          </div>
        )}
      </div>
    </div>
  );
}
