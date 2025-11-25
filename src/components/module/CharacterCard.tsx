import { ReactNode } from 'react';
import '../../styles/game-theme.css';

export interface CharacterCardProps {
  name: string;
  role?: string;
  avatar: ReactNode;
  avatarColor?: 'guard' | 'assistant' | 'default';
  children: ReactNode;
  className?: string;
}

export function CharacterCard({
  name,
  role,
  avatar,
  avatarColor = 'default',
  children,
  className = '',
}: CharacterCardProps) {
  const avatarColors = {
    guard: {
      background: 'linear-gradient(135deg, var(--game-guard) 0%, var(--game-guard-dark) 100%)',
    },
    assistant: {
      background: 'linear-gradient(135deg, var(--game-assistant) 0%, var(--game-assistant-dark) 100%)',
    },
    default: {
      background: 'linear-gradient(135deg, var(--game-primary) 0%, var(--game-primary-dark) 100%)',
    },
  };

  return (
    <div className={`character-card ${className}`}>
      <div
        className="character-avatar"
        style={avatarColors[avatarColor]}
      >
        {avatar}
      </div>
      <h2 className="character-name">{name}</h2>
      {role && <div className="character-role">{role}</div>}
      {children}
    </div>
  );
}

