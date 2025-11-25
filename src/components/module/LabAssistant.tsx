import { useState } from 'react';
import { CharacterCard } from './CharacterCard.js';
import { Textarea } from '../ui/Textarea.js';
import { Button } from '../ui/Button.js';
import { Card } from '../ui/Card.js';
import { useI18n } from '../../i18n/context.js';
import { useModuleActions } from '../../store/moduleStore.js';
import '../../styles/game-theme.css';

export interface LabAssistantProps {
  question: string;
  onPasswordReceived?: (password: string) => void;
  onNext?: () => void;
  moduleState?: Record<string, unknown>;
}

export function LabAssistant({ question, onPasswordReceived, onNext, moduleState: _moduleState }: LabAssistantProps) {
  const { t } = useI18n();
  const { setModuleStateField } = useModuleActions();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate lab assistant evaluation
    // In a real implementation, this would call an API
    setTimeout(() => {
      // For MVP: Accept any reasonable answer (at least 20 characters)
      if (answer.trim().length >= 20) {
        setResponse(t.labAssistant.success);
        // Generate or retrieve password (in real app, this comes from backend)
        // For now, use a simple password based on task
        const newPassword = 'task1complete'; // This should match the unlockpassword in the node
        setPassword(newPassword);
        if (onPasswordReceived) {
          onPasswordReceived(newPassword);
        }
        // Store password in moduleState for WorldMap to use
        setModuleStateField('unlockPassword', newPassword);
      } else {
        setResponse(t.labAssistant.tooShort);
      }
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <CharacterCard
        name={t.labAssistant.name}
        role={t.labAssistant.role}
        avatar="👨‍🔬"
        avatarColor="assistant"
      >
        <div className="game-surface" style={{ marginBottom: 'var(--spacing-6)' }}>
          <h3
            className="h4"
            style={{
              marginTop: 0,
              marginBottom: 'var(--spacing-4)',
              color: 'var(--game-world-border)',
              fontFamily: 'var(--font-family-pixel)',
            }}
          >
            {t.labAssistant.reflectionQuestion}
          </h3>
          <p
            className="text-base"
            style={{
              lineHeight: 'var(--line-height-relaxed)',
              color: 'var(--game-text-primary)',
              marginBottom: 0,
            }}
          >
            {question}
          </p>
        </div>

        {!password && (
          <form onSubmit={handleSubmit}>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.labAssistant.placeholder}
              disabled={isSubmitting}
              fullWidth
              characterCount
              maxLength={500}
              className="game-textarea"
              style={{
                marginBottom: 'var(--spacing-4)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderColor: 'var(--game-world-border)',
                color: 'var(--game-text-primary)',
              }}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !answer.trim()}
              loading={isSubmitting}
              fullWidth
              size="lg"
              style={{
                backgroundColor: 'var(--game-world-border)',
                color: 'var(--game-world-bg)',
                borderColor: 'var(--game-world-border)',
                fontFamily: 'var(--font-family-pixel)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {isSubmitting ? t.labAssistant.evaluating : t.labAssistant.submit}
            </Button>
          </form>
        )}

        {response && (
          <div
            className="game-surface"
            style={{
              marginTop: 'var(--spacing-5)',
              borderColor: password ? 'var(--game-accent-success)' : 'var(--game-accent-warning)',
            }}
          >
            <p
              className="text-base"
              style={{
                margin: '0 0 var(--spacing-4) 0',
                lineHeight: 'var(--line-height-relaxed)',
                color: 'var(--game-text-primary)',
              }}
            >
              {response}
            </p>
            {password && (
              <div
                className="game-surface"
                style={{
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  border: '2px solid var(--game-accent-success)',
                  textAlign: 'center',
                }}
              >
                <div
                  className="text-sm font-semibold"
                  style={{
                    color: 'var(--game-text-secondary)',
                    marginBottom: 'var(--spacing-2)',
                    fontFamily: 'var(--font-family-pixel)',
                  }}
                >
                  {t.labAssistant.password}
                </div>
                <div
                  className="h3"
                  style={{
                    color: 'var(--game-accent-success)',
                    fontFamily: 'var(--font-family-mono)',
                    letterSpacing: '2px',
                    textShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
                  }}
                >
                  {password}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: 'var(--game-text-muted)',
                    marginTop: 'var(--spacing-2)',
                    fontStyle: 'italic',
                  }}
                >
                  {t.labAssistant.passwordHint}
                </div>
              </div>
            )}
          </div>
        )}

        {password && onNext && (
          <Button
            variant="primary"
            onClick={onNext}
            fullWidth
            size="lg"
            style={{
              marginTop: 'var(--spacing-5)',
              backgroundColor: 'var(--game-world-border)',
              color: 'var(--game-world-bg)',
              borderColor: 'var(--game-world-border)',
              fontFamily: 'var(--font-family-pixel)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            {t.labAssistant.continue}
          </Button>
        )}
      </CharacterCard>
    </div>
  );
}
