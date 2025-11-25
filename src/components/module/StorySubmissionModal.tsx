import { useState } from 'react';
import { Modal } from '../ui/Modal.js';
import { Textarea } from '../ui/Textarea.js';
import { Button } from '../ui/Button.js';
import { Badge } from '../ui/Badge.js';
import { evaluateAnswer } from '../../api/client.js';
import { useI18n } from '../../i18n/context.js';
import type { TaskConfig, EvaluationResponse } from '../../types/module.types.js';
import '../../styles/game-theme.css';

export interface StorySubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskConfig;
  onSubmit?: (answer: string, response: EvaluationResponse) => void;
  onSuccess?: () => void;
  onFailure?: () => void;
}

export function StorySubmissionModal({
  isOpen,
  onClose,
  task,
  onSubmit,
  onSuccess,
  onFailure,
}: StorySubmissionModalProps) {
  const { t, locale } = useI18n();
  const [story, setStory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await evaluateAnswer(story, task, locale);
      setResult(response);

      if (onSubmit) {
        onSubmit(story, response);
      }

      // Check if evaluation is good enough
      if (response.evaluation === 'excellent' || response.evaluation === 'good') {
        // Success - task passed
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            handleClose();
          }, 3000);
        }
      } else {
        // Failure - need to revise
        if (onFailure) {
          setTimeout(() => {
            onFailure();
          }, 3000);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.evaluateStory);
      console.error('Error submitting story:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Only clear the story and result if we're closing without a successful submission
    // If result exists and is successful, don't clear it (onSuccess will handle the close)
    if (!result || (result.evaluation !== 'excellent' && result.evaluation !== 'good')) {
      setStory('');
      setResult(null);
      setError(null);
    }
    onClose();
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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t.story.submitTitle}
      size="lg"
      closeOnEscape={!isSubmitting}
      closeOnBackdropClick={!isSubmitting}
      aria-label="Story submission"
    >
      <form onSubmit={handleSubmit}>
        {!result && (
          <>
            <div className="game-surface" style={{ marginBottom: 'var(--spacing-4)', padding: 'var(--spacing-4)' }}>
              <p className="text-base" style={{ margin: 0, color: 'var(--game-text-primary)' }}>
                {t.storySubmission.description}
              </p>
            </div>

            <Textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder={t.story.pasteStory}
              disabled={isSubmitting}
              fullWidth
              characterCount={!!task?.minLength}
              maxLength={task?.minLength ? task.minLength * 3 : undefined}
              className="game-textarea"
              style={{
                marginBottom: 'var(--spacing-4)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderColor: 'var(--game-world-border)',
                color: 'var(--game-text-primary)',
                minHeight: '300px',
              }}
            />

            <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{
                  borderColor: 'var(--game-world-border)',
                  color: 'var(--game-world-border)',
                  fontFamily: 'var(--font-family-pixel)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {t.common.close}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !story.trim()}
                loading={isSubmitting}
                style={{
                  backgroundColor: 'var(--game-world-border)',
                  color: 'var(--game-world-bg)',
                  borderColor: 'var(--game-world-border)',
                  fontFamily: 'var(--font-family-pixel)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {isSubmitting ? t.story.evaluating : t.story.submitButton}
              </Button>
            </div>
          </>
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
            <strong style={{ color: 'var(--game-accent-error)' }}>{t.story.error}:</strong>{' '}
            <span style={{ color: 'var(--game-text-primary)' }}>{error}</span>
          </div>
        )}

        {result && (
          <div
            className="game-surface-elevated"
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
                marginBottom: 'var(--spacing-4)',
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
            </div>

            <div className="game-surface" style={{ marginBottom: 'var(--spacing-4)', padding: 'var(--spacing-4)' }}>
              <h3
                className="h4"
                style={{
                  marginTop: 0,
                  marginBottom: 'var(--spacing-3)',
                  color: 'var(--game-world-border)',
                  fontFamily: 'var(--font-family-pixel)',
                }}
              >
                {t.storySubmission.guardResponse}
              </h3>
              <p
                className="text-base"
                style={{
                  lineHeight: 'var(--line-height-relaxed)',
                  color: 'var(--game-text-primary)',
                  margin: 0,
                }}
              >
                {result.reply}
              </p>
            </div>

            {(result.evaluation === 'excellent' || result.evaluation === 'good') ? (
              <div
                className="game-surface"
                style={{
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  border: '2px solid var(--game-accent-success)',
                }}
              >
                <p
                  className="text-base"
                  style={{
                    margin: 0,
                    color: 'var(--game-text-primary)',
                    fontFamily: 'var(--font-family-pixel)',
                  }}
                >
                  🎉 {t.story.success}
                </p>
              </div>
            ) : (
              <div
                className="game-surface"
                style={{
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'rgba(255, 152, 0, 0.2)',
                  border: '2px solid var(--game-accent-warning)',
                }}
              >
                <p
                  className="text-base"
                  style={{
                    margin: 0,
                    color: 'var(--game-text-primary)',
                    fontFamily: 'var(--font-family-pixel)',
                  }}
                >
                  {t.story.failureMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
}

