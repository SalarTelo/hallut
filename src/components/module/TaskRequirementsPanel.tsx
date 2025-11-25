import { Badge } from '../ui/Badge.js';
import { useI18n } from '../../i18n/context.js';
import type { TaskConfig } from '../../types/module.types.js';
import '../../styles/game-theme.css';

export interface TaskRequirementsPanelProps {
  task: TaskConfig;
}

export function TaskRequirementsPanel({ task }: TaskRequirementsPanelProps) {
  const { t } = useI18n();

  return (
    <div
      className="game-surface-elevated task-requirements-panel"
      style={{
        position: 'fixed',
        top: 'var(--spacing-4)',
        right: 'var(--spacing-4)',
        zIndex: 100,
        minWidth: '280px',
        maxWidth: '320px',
        padding: 'var(--spacing-4)',
        border: '3px solid var(--game-world-border)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 235, 59, 0.3)',
        borderRadius: 'var(--radius-lg)',
        maxHeight: 'calc(100vh - var(--spacing-8))',
        overflowY: 'auto',
        opacity: 0.7,
        transition: 'opacity var(--transition-base)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.5';
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          marginBottom: 'var(--spacing-4)',
          paddingBottom: 'var(--spacing-3)',
          borderBottom: '2px solid var(--game-world-border-light)',
        }}
      >
        <h3
          className="h4"
          style={{
            margin: 0,
            color: 'var(--game-world-border)',
            fontFamily: 'var(--font-family-pixel)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {t.task.requirements}
        </h3>
      </div>

      {/* Task Description / Overview Requirements */}
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <div
          className="text-xs font-semibold"
          style={{
            color: 'var(--game-text-secondary)',
            marginBottom: 'var(--spacing-2)',
            fontFamily: 'var(--font-family-pixel)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {t.task.whatToDo}
        </div>
        <div
          className="text-sm"
          style={{
            color: 'var(--game-text-primary)',
            lineHeight: 'var(--line-height-relaxed)',
            padding: 'var(--spacing-2)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--game-world-border-light)',
          }}
        >
          {/* Use overview.requirements if available, otherwise fall back to description */}
          {task.overview?.requirements || task.description}
        </div>
      </div>

      {/* Goals (from overview) */}
      {task.overview?.goals && task.overview.goals.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <div
            className="text-xs font-semibold"
            style={{
              color: 'var(--game-text-secondary)',
              marginBottom: 'var(--spacing-2)',
              fontFamily: 'var(--font-family-pixel)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {t.task.goals || 'Goals'}
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 'var(--spacing-4)',
              color: 'var(--game-text-primary)',
              fontSize: 'var(--font-size-sm)',
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            {task.overview.goals.map((goal: string, index: number) => (
              <li key={index} style={{ marginBottom: 'var(--spacing-1)' }}>
                {goal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {/* Minimum Length */}
        {task.minLength && (
          <div
            className="game-surface"
            style={{
              padding: 'var(--spacing-3)',
              border: '2px solid var(--game-world-border-light)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              className="text-xs font-semibold"
              style={{
                color: 'var(--game-text-secondary)',
                fontFamily: 'var(--font-family-pixel)',
                marginBottom: 'var(--spacing-1)',
              }}
            >
              {t.task.minimumLength}
            </div>
            <div
              className="text-sm font-bold"
              style={{ color: 'var(--game-world-border)' }}
            >
              {task.minLength} {t.common.characters}
            </div>
          </div>
        )}

        {/* Required Keywords */}
        {task.keywords && task.keywords.length > 0 && (
          <div
            className="game-surface"
            style={{
              padding: 'var(--spacing-3)',
              border: '2px solid var(--game-world-border-light)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              className="text-xs font-semibold"
              style={{
                color: 'var(--game-text-secondary)',
                fontFamily: 'var(--font-family-pixel)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              {t.task.requiredKeywords}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-2)',
              }}
            >
              {task.keywords.map((keyword, index) => (
                <Badge key={index} variant="primary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Bonus Challenges - Only show if task has bonusChallenges property */}
        {task.bonusChallenges && Array.isArray(task.bonusChallenges) && task.bonusChallenges.length > 0 && (
          <div
            className="game-surface"
            style={{
              padding: 'var(--spacing-3)',
              border: '2px solid var(--color-warning)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
            }}
          >
            <div
              className="text-xs font-semibold"
              style={{
                color: 'var(--color-warning)',
                fontFamily: 'var(--font-family-pixel)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              {t.task.bonusChallenges}
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 'var(--spacing-4)',
                color: 'var(--game-text-primary)',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              {task.bonusChallenges.map((challenge: string, index: number) => (
                <li key={index} style={{ marginBottom: 'var(--spacing-1)' }}>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .game-surface-elevated {
            position: relative !important;
            top: auto !important;
            right: auto !important;
            margin: var(--spacing-4) !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

