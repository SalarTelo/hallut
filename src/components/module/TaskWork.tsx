/**
 * TaskWork component - Shows task interface and handles submission
 */

import { useState } from 'react';
import type { Task, TaskSolveResult } from '../../types/module.types.js';
import { Textarea } from '../ui/Textarea.js';
import { Button } from '../ui/Button.js';
import { Card } from '../ui/Card.js';
import { useI18n } from '../../i18n/context.js';

export interface TaskWorkProps {
  task: Task;
  onSolve: (result: TaskSolveResult) => void;
  onNext?: () => void;
}

export function TaskWork({ task, onSolve, onNext }: TaskWorkProps) {
  const { t } = useI18n();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TaskSolveResult | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the task's solve function
      const solveResult = task.solveFunction({ answer });
      setResult(solveResult);
      
      if (solveResult.solved) {
        // Task solved - notify parent
        onSolve(solveResult);
        // Auto-advance after a delay
        if (onNext) {
          setTimeout(() => {
            onNext();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error solving task:', error);
      setResult({
        solved: false,
        reason: 'Ett fel uppstod',
        details: error instanceof Error ? error.message : 'Okänt fel',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-6)' }}>
      <Card>
        <h2 style={{ marginBottom: 'var(--spacing-4)' }}>{task.name}</h2>
        <p style={{ marginBottom: 'var(--spacing-6)', color: 'var(--game-text-secondary)' }}>
          {task.description}
        </p>

        {result && (
          <div
            style={{
              padding: 'var(--spacing-4)',
              marginBottom: 'var(--spacing-4)',
              backgroundColor: result.solved ? '#e8f5e9' : '#ffebee',
              border: `2px solid ${result.solved ? '#4caf50' : '#f44336'}`,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>
              {result.solved ? '✓ ' : '✗ '}
              {result.reason}
            </div>
            {result.details && (
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--game-text-secondary)' }}>
                {result.details}
              </div>
            )}
          </div>
        )}

        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Skriv ditt svar här..."
          rows={10}
          style={{ marginBottom: 'var(--spacing-4)', width: '100%' }}
        />

        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting || (result?.solved === true)}
            variant="primary"
          >
            {isSubmitting ? 'Skickar...' : result?.solved ? 'Klar!' : 'Skicka'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

