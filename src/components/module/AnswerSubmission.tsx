import { useState, useEffect } from 'react';
import { evaluateAnswer } from '../../api/client.js';
import { useI18n } from '../../i18n/context.js';
import type { TaskConfig, EvaluationResponse } from '../../types/module.types.js';
import { Textarea } from '../ui/Textarea.js';
import { Button } from '../ui/Button.js';
import { Badge } from '../ui/Badge.js';
import { StorageService } from '../../services/storage.js';
import '../../styles/game-theme.css';

export interface AnswerSubmissionProps {
  onSubmit: (answer: string) => Promise<EvaluationResponse>;
  task?: TaskConfig;
  moduleState?: Record<string, unknown>;
}

export function AnswerSubmission({ onSubmit, task, moduleState }: AnswerSubmissionProps) {
  const { t } = useI18n();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (answer && !result) {
      const timer = setTimeout(() => {
        StorageService.saveAnswerDraft(answer);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [answer, result]);

  // Load draft on mount
  useEffect(() => {
    const draft = StorageService.getAnswerDraft();
    if (draft && !result) {
      setAnswer(draft);
    }
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    StorageService.removeAnswerDraft(); // Clear draft on submit

    try {
      const response = await onSubmit(answer);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.evaluateAnswer);
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEvaluationColor = (evaluation: string): string => {
    switch (evaluation) {
      case 'excellent':
        return 'var(--game-accent-success)';
      case 'good':
        return 'var(--game-primary)';
      case 'weak':
        return 'var(--game-accent-warning)';
      case 'too_short':
      case 'missing_keywords':
        return 'var(--game-accent-error)';
      default:
        return 'var(--game-text-muted)';
    }
  };

  const getEvaluationEmoji = (evaluation: string): string => {
    switch (evaluation) {
      case 'excellent':
        return '🌟';
      case 'good':
        return '✅';
      case 'weak':
        return '⚠️';
      case 'too_short':
      case 'missing_keywords':
        return '❌';
      default:
        return '📝';
    }
  };

  return (
    <div>
      {!result && (
        <form onSubmit={handleSubmit}>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={t.answer.placeholder}
            disabled={isSubmitting}
            fullWidth
            characterCount={!!task?.minLength}
            maxLength={task?.minLength ? task.minLength * 2 : undefined}
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
            {isSubmitting ? t.answer.evaluating : t.answer.submit}
          </Button>
        </form>
      )}

      {error && (
        <div
          role="alert"
          className="game-surface"
          style={{
            marginTop: 'var(--spacing-4)',
            borderColor: 'var(--game-accent-error)',
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
          }}
        >
          <strong style={{ color: 'var(--game-accent-error)' }}>{t.answer.error}:</strong>{' '}
          <span style={{ color: 'var(--game-text-primary)' }}>{error}</span>
        </div>
      )}

      {result && (
        <div
          className="game-surface"
          style={{
            marginTop: 'var(--spacing-4)',
            borderColor: getEvaluationColor(result.evaluation),
            borderWidth: '3px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              marginBottom: 'var(--spacing-2)',
            }}
          >
            <span style={{ fontSize: 'var(--font-size-2xl)' }} aria-hidden="true">
              {getEvaluationEmoji(result.evaluation)}
            </span>
            <Badge
              variant={
                result.evaluation === 'excellent'
                  ? 'success'
                  : result.evaluation === 'good'
                    ? 'primary'
                    : result.evaluation === 'weak'
                      ? 'warning'
                      : 'error'
              }
            >
              {result.evaluation}
            </Badge>
            {result.details && (
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--game-text-muted)',
                  fontStyle: 'italic',
                }}
              >
                {result.details}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
