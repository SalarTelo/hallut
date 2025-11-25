import type { TaskConfig } from '../../types/module.types.js';
import { Badge } from '../ui/Badge.js';
import { useI18n } from '../../i18n/context.js';
import '../../styles/game-theme.css';

export interface CriteriaDisplayProps {
  task: TaskConfig;
}

export function CriteriaDisplay({ task }: CriteriaDisplayProps) {
  const { t } = useI18n();
  
  return (
    <div
      className="game-surface-elevated"
      style={{
        position: 'fixed',
        top: 'var(--spacing-5)',
        right: 'var(--spacing-5)',
        zIndex: 'var(--z-sticky)',
        minWidth: '280px',
        maxWidth: '320px',
        padding: 'var(--spacing-5)',
      }}
    >
      <h3
        className="h4"
        style={{
          margin: '0 0 var(--spacing-4) 0',
          color: 'var(--game-world-border)',
          fontFamily: 'var(--font-family-pixel)',
          borderBottom: '2px solid var(--game-world-border-light)',
          paddingBottom: 'var(--spacing-2)',
        }}
      >
        {t.criteria.title}
      </h3>

      <div style={{ marginBottom: 'var(--spacing-3)' }}>
        <div
          className="text-sm font-semibold"
          style={{
            color: 'var(--game-text-secondary)',
            marginBottom: 'var(--spacing-1)',
            fontFamily: 'var(--font-family-pixel)',
            fontSize: 'var(--font-size-xs)',
          }}
        >
          {t.criteria.task}
        </div>
        <div
          className="text-sm"
          style={{
            color: 'var(--game-text-primary)',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          {task.description}
        </div>
      </div>

      {task.minLength && (
        <div
          className="game-surface"
          style={{
            marginBottom: 'var(--spacing-3)',
            padding: 'var(--spacing-2)',
          }}
        >
          <div
            className="text-xs font-semibold"
            style={{
              color: 'var(--game-text-secondary)',
              marginBottom: 'var(--spacing-1)',
              fontFamily: 'var(--font-family-pixel)',
            }}
          >
            {t.criteria.minimumLength}
          </div>
          <div
            className="text-sm font-semibold"
            style={{ color: 'var(--game-world-border)' }}
          >
            {task.minLength} {t.common.characters}
          </div>
        </div>
      )}

      {task.keywords && task.keywords.length > 0 && (
        <div
          className="game-surface"
          style={{
            marginBottom: 'var(--spacing-3)',
            padding: 'var(--spacing-2)',
          }}
        >
          <div
            className="text-xs font-semibold"
            style={{
              color: 'var(--game-text-secondary)',
              marginBottom: 'var(--spacing-2)',
              fontFamily: 'var(--font-family-pixel)',
            }}
          >
            {t.criteria.requiredKeywords}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
            {task.keywords.map((keyword, index) => (
              <Badge key={index} variant="primary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .game-surface-elevated {
            position: relative !important;
            top: auto !important;
            right: auto !important;
            margin-bottom: var(--spacing-4);
          }
        }
      `}</style>
    </div>
  );
}
