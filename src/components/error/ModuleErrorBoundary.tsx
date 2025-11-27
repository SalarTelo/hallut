/**
 * ModuleErrorBoundary - Error boundary for module loading and execution
 * Catches errors in module components and provides error recovery UI
 */

import { Component, type ReactNode } from 'react';
import { Button } from '../ui/Button.js';
import { useI18n } from '../../i18n/context.js';

export interface ModuleErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ModuleErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ModuleErrorBoundary extends Component<ModuleErrorBoundaryProps, ModuleErrorBoundaryState> {
  constructor(props: ModuleErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ModuleErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    // Log error to console for debugging
    console.error('Module error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    
    // Call optional reset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return <ModuleErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Error fallback UI component
 */
function ModuleErrorFallback({ 
  error, 
  onReset 
}: { 
  error: Error | null; 
  onReset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div 
      className="game-bg" 
      style={{ 
        padding: 'var(--spacing-12)', 
        textAlign: 'center', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-4)', color: 'var(--game-accent-error)' }}>
        ⚠️
      </div>
      <div className="h2" style={{ marginBottom: 'var(--spacing-4)', color: 'var(--game-accent-error)' }}>
        {t.module.error}
      </div>
      <div className="text-base" style={{ color: 'var(--game-text-secondary)', marginBottom: 'var(--spacing-6)', maxWidth: '600px' }}>
        {error?.message || 'An unexpected error occurred while loading the module.'}
      </div>
      {error && process.env.NODE_ENV === 'development' && (
        <details style={{ marginBottom: 'var(--spacing-6)', textAlign: 'left', maxWidth: '800px' }}>
          <summary style={{ cursor: 'pointer', marginBottom: 'var(--spacing-2)', color: 'var(--game-text-muted)' }}>
            Error Details (Development Only)
          </summary>
          <pre
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: 'var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              overflow: 'auto',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--game-text-secondary)',
            }}
          >
            {error.stack || error.toString()}
          </pre>
        </details>
      )}
      <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
        <Button variant="primary" onClick={onReset}>
          {t.common.back}
        </Button>
      </div>
    </div>
  );
}

