/**
 * Image submission component
 */

import { useState } from 'react';
import type { Task } from '../../types/module.types.js';
import { Button } from '../ui/Button.js';
import { Card } from '../ui/Card.js';

export interface ImageSubmissionProps {
  task: Task;
  onSubmit: (submission: { type: 'image'; image: File | string }) => void;
}

export function ImageSubmission({ task, onSubmit }: ImageSubmissionProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const maxSize = task.submission.config?.maxFileSize;
  const allowedFormats = task.submission.config?.allowedFormats;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    
    // Validate file size
    if (maxSize && file.size > maxSize) {
      setError(`Filen är för stor. Max storlek: ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }
    
    // Validate format
    if (allowedFormats) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedFormats.includes(ext)) {
        setError(`Fel filformat. Tillåtna format: ${allowedFormats.join(', ')}`);
        return;
      }
    }
    
    setImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!image) return;
    
    setIsSubmitting(true);
    onSubmit({ type: 'image', image });
    setIsSubmitting(false);
  };

  return (
    <Card>
      <h2 style={{ marginBottom: 'var(--spacing-4)' }}>{task.name}</h2>
      <p style={{ marginBottom: 'var(--spacing-6)', color: 'var(--game-text-secondary)' }}>
        {task.description}
      </p>

      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <input
          type="file"
          accept={allowedFormats?.map(f => `.${f}`).join(',')}
          onChange={handleFileChange}
          style={{ marginBottom: 'var(--spacing-4)' }}
        />
        
        {error && (
          <div style={{ 
            padding: 'var(--spacing-3)',
            backgroundColor: '#ffebee',
            border: '2px solid #f44336',
            borderRadius: 'var(--radius-md)',
            color: '#c62828',
            marginBottom: 'var(--spacing-4)'
          }}>
            {error}
          </div>
        )}
        
        {preview && (
          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--game-world-border)'
              }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
        <Button
          onClick={handleSubmit}
          disabled={!image || isSubmitting}
          variant="primary"
        >
          {isSubmitting ? 'Skickar...' : 'Skicka'}
        </Button>
      </div>
    </Card>
  );
}

