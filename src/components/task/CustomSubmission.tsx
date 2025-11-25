/**
 * Custom submission component loader
 */

import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { Task } from '../../types/module.types.js';
import { LoadingSpinner } from '../ui/LoadingSpinner.js';
import { useModuleStore } from '../../store/moduleStore.js';

export interface CustomSubmissionProps {
  task: Task;
  onSubmit: (submission: { type: 'custom'; data: unknown }) => void;
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-4)' }}>⚠️</div>
      <div className="h2" style={{ marginBottom: 'var(--spacing-4)' }}>
        Kunde inte ladda komponent
      </div>
      <div className="text-base" style={{ color: 'var(--game-text-secondary)' }}>
        {error.message}
      </div>
    </div>
  );
}

export function CustomSubmission({ task, onSubmit }: CustomSubmissionProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const componentName = task.submission.component;
  if (!componentName) {
    return (
      <div style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
        <div className="text-base" style={{ color: 'var(--game-text-secondary)' }}>
          Ingen komponent angiven för denna uppgift.
        </div>
      </div>
    );
  }

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to load from module components
        const module = useModuleStore.getState().currentModule;
        if (module?.components[componentName]) {
          setComponent(() => module.components[componentName]);
          setLoading(false);
          return;
        }
        
        // Try dynamic import
        const moduleId = useModuleStore.getState().currentModuleId;
        if (moduleId) {
          try {
            const componentModule = await import(
              /* @vite-ignore */
              `../../modules/${moduleId}/components/${componentName}.tsx`
            );
            const LoadedComponent = componentModule.default || componentModule[componentName];
            if (LoadedComponent) {
              setComponent(() => LoadedComponent);
              setLoading(false);
              return;
            }
          } catch (importError) {
            // Ignore import errors, try next method
          }
        }
        
        throw new Error(`Komponent "${componentName}" hittades inte`);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Okänt fel'));
        setLoading(false);
      }
    };
    
    loadComponent();
  }, [componentName]);

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
        <LoadingSpinner size="lg" />
        <div className="text-base" style={{ marginTop: 'var(--spacing-4)', color: 'var(--game-text-secondary)' }}>
          Laddar komponent...
        </div>
      </div>
    );
  }

  if (error || !Component) {
    return (
      <div style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-4)' }}>⚠️</div>
        <div className="h2" style={{ marginBottom: 'var(--spacing-4)' }}>
          Kunde inte ladda komponent
        </div>
        <div className="text-base" style={{ color: 'var(--game-text-secondary)' }}>
          {error?.message || 'Komponent hittades inte'}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Component task={task} onSubmit={onSubmit} />
    </ErrorBoundary>
  );
}

