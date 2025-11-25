import type { TaskConfig } from '../../types/module.types.js';
import { CharacterCard } from './CharacterCard.js';
import { Button } from '../ui/Button.js';
import { Badge } from '../ui/Badge.js';
import { useI18n } from '../../i18n/context.js';
import { useModuleActions } from '../../store/moduleStore.js';
import '../../styles/game-theme.css';

export interface TaskAcceptanceProps {
  task: TaskConfig;
  guardDialogue: string;
  onAccept?: () => void;
  onNext?: () => void;
}

export function TaskAcceptance({ task, guardDialogue, onAccept, onNext, moduleState: _moduleState }: TaskAcceptanceProps & { moduleState?: Record<string, unknown> }) {
  const { t } = useI18n();
  const { setModuleStateField } = useModuleActions();
  
  const handleAccept = () => {
    // Set current task ID in moduleState
    if (task.id) {
      setModuleStateField('currentTaskId', task.id);
    }
    
    if (onAccept) {
      onAccept();
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <CharacterCard
        name={t.guard.name}
        avatar="🛡️"
        avatarColor="guard"
      >
        <div className="game-surface" style={{ marginBottom: 'var(--spacing-6)' }}>
          <p
            className="text-base"
            style={{
              margin: '0 0 var(--spacing-4) 0',
              color: 'var(--game-text-primary)',
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            {guardDialogue}
          </p>
        </div>

        {/* Structured Criteria Display */}
        <div
          className="game-surface-elevated"
          style={{
            marginBottom: 'var(--spacing-6)',
            border: '3px solid var(--game-world-border)',
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
            {t.task.requirements}
          </h3>

          {/* Task Description */}
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div
              className="text-sm font-semibold"
              style={{
                color: 'var(--game-world-border)',
                marginBottom: 'var(--spacing-2)',
                fontFamily: 'var(--font-family-pixel)',
                fontSize: 'var(--font-size-xs)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {t.task.whatToDo}
            </div>
            <div
              className="text-base"
              style={{
                color: 'var(--game-text-primary)',
                lineHeight: 'var(--line-height-relaxed)',
                padding: 'var(--spacing-3)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--game-world-border-light)',
              }}
            >
              {task.description}
            </div>
          </div>

          {/* Requirements Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-3)',
            }}
          >
            {/* Minimum Length */}
            {task.minLength && (
              <div
                className="game-surface"
                style={{
                  padding: 'var(--spacing-3)',
                  border: '2px solid var(--game-world-border-light)',
                }}
              >
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
                  {t.task.minimumLength}
                </div>
                <div
                  className="text-lg font-bold"
                  style={{
                    color: 'var(--game-world-border)',
                    fontFamily: 'var(--font-family-mono)',
                  }}
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
                  gridColumn: task.minLength ? 'span 1' : 'span 2',
                }}
              >
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
                    <Badge
                      key={index}
                      variant="primary"
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        padding: 'var(--spacing-1) var(--spacing-3)',
                        fontFamily: 'var(--font-family-pixel)',
                      }}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Requirements */}
          {task.twists && task.twists.length > 0 && (
            <div
              className="game-surface"
              style={{
                marginTop: 'var(--spacing-4)',
                padding: 'var(--spacing-3)',
                border: '2px solid var(--game-accent-warning)',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
              }}
            >
              <div
                className="text-xs font-semibold"
                style={{
                  color: 'var(--game-accent-warning)',
                  marginBottom: 'var(--spacing-2)',
                  fontFamily: 'var(--font-family-pixel)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t.task.bonusChallenges}
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 'var(--spacing-4)',
                  color: 'var(--game-text-primary)',
                }}
              >
                {task.twists.map((twist, index) => (
                  <li
                    key={index}
                    className="text-sm"
                    style={{
                      marginBottom: 'var(--spacing-1)',
                      lineHeight: 'var(--line-height-relaxed)',
                    }}
                  >
                    {twist}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-3)', width: '100%' }}>
          {onNext && (
            <Button
              variant="outline"
              onClick={onNext}
              style={{
                flex: '1',
                borderColor: 'var(--game-world-border)',
                color: 'var(--game-world-border)',
                fontFamily: 'var(--font-family-pixel)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {t.task.back}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleAccept}
            style={{
              flex: '2',
              backgroundColor: 'var(--game-world-border)',
              color: 'var(--game-world-bg)',
              borderColor: 'var(--game-world-border)',
              fontFamily: 'var(--font-family-pixel)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            {t.task.accept}
          </Button>
        </div>
      </CharacterCard>
    </div>
  );
}
