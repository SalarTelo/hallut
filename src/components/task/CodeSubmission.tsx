/**
 * Code submission component
 */

import { useState } from 'react';
import type { Task } from '../../types/module.types.js';
import { Textarea } from '../ui/Textarea.js';
import { Button } from '../ui/Button.js';
import { Card } from '../ui/Card.js';

export interface CodeSubmissionProps {
  task: Task;
  onSubmit: (submission: { type: 'code'; code: string }) => void;
  initialValue?: string;
}

export function CodeSubmission({ task, onSubmit, initialValue = '' }: CodeSubmissionProps) {
  const [code, setCode] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!code.trim()) return;
    
    setIsSubmitting(true);
    onSubmit({ type: 'code', code: code.trim() });
    setIsSubmitting(false);
  };

  return (
    <Card>
      <h2 style={{ marginBottom: 'var(--spacing-4)' }}>{task.name}</h2>
      <p style={{ marginBottom: 'var(--spacing-6)', color: 'var(--game-text-secondary)' }}>
        {task.description}
      </p>

      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Skriv din kod här..."
        rows={15}
        style={{ 
          marginBottom: 'var(--spacing-4)', 
          width: '100%',
          fontFamily: 'monospace',
          fontSize: 'var(--font-size-sm)'
        }}
      />

      <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
        <Button
          onClick={handleSubmit}
          disabled={!code.trim() || isSubmitting}
          variant="primary"
        >
          {isSubmitting ? 'Skickar...' : 'Skicka'}
        </Button>
      </div>
    </Card>
  );
}

