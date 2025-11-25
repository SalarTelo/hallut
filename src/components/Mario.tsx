import type { Position } from '../types/WorldMap.types';
import '../styles/game-theme.css';

interface MarioProps {
  position: Position;
}

export const Mario = ({ position }: MarioProps) => {
  return (
    <div
      className="mario"
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.5s ease-in-out',
        zIndex: 40,
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--game-accent-error)',
          border: '3px solid var(--game-world-border)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 235, 59, 0.4), inset 0 -4px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--game-text-primary)',
          fontFamily: 'var(--font-family-pixel)',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
        }}
      >
        M
      </div>
    </div>
  );
};
