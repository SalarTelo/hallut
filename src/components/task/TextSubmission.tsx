/**
 * Text submission component
 */

import { useState } from 'react';
import type { Task } from '../../types/module.types.js';
import { Textarea } from '../ui/Textarea.js';
import { Button } from '../ui/Button.js';
import { Card } from '../ui/Card.js';

export interface TextSubmissionProps {
  task: Task;
  onSubmit: (submission: { type: 'text'; text: string }) => void;
  initialValue?: string;
}

export function TextSubmission({ task, onSubmit, initialValue = '' }: TextSubmissionProps) {
  const [text, setText] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minLength = task.submission.config?.minLength;

  const handleSubmit = () => {
    if (!text.trim()) return;
    
    if (minLength && text.trim().length < minLength) {
      // Validation will be handled by service, but show immediate feedback
      return;
    }
    
    setIsSubmitting(true);
    onSubmit({ type: 'text', text: text.trim() });
    setIsSubmitting(false);
  };

  return (
    <Card>
      <h2 style={{ marginBottom: 'var(--spacing-4)' }}>{task.name}</h2>
      <p style={{ marginBottom: 'var(--spacing-6)', color: 'var(--game-text-secondary)' }}>
        {task.description}
      </p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Skriv ditt svar här..."
        rows={10}
        style={{ marginBottom: 'var(--spacing-4)', width: '100%' }}
        minLength={minLength}
      />

      {minLength && (
        <div style={{ marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--game-text-secondary)' }}>
          Minsta längd: {minLength} tecken ({text.length}/{minLength})
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isSubmitting || (minLength ? text.trim().length < minLength : false)}
          variant="primary"
        >
          {isSubmitting ? 'Skickar...' : 'Skicka'}
        </Button>
      </div>
    </Card>
  );
}

