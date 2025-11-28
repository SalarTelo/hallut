/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */

import { Component, type ReactNode } from 'react';
import { ErrorDisplay } from './ErrorDisplay.js';
import { handleError } from '@services/errorService.js';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    handleError(error, { context: 'ErrorBoundary', errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <ErrorDisplay
          error={this.state.error}
          title="Something went wrong"
          actionLabel="Try Again"
          onAction={this.handleReset}
          showDetails={import.meta.env.DEV}
        />
      );
    }

    return this.props.children;
  }
}

