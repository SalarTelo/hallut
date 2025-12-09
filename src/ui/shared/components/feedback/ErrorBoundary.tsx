/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 * 
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <CustomErrorDisplay error={error} onReset={reset} />
 *   )}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */

import { Component, type ReactNode } from 'react';
import { ErrorDisplay } from './ErrorDisplay.js';
import { handleError } from '@services/errorService.js';

export interface ErrorBoundaryProps {
  /**
   * Child components to wrap
   */
  children: ReactNode;

  /**
   * Custom fallback UI renderer
   * If provided, this will be used instead of the default ErrorDisplay
   * 
   * @param error - The error that was caught
   * @param reset - Function to reset the error boundary state
   * @returns React node to render as fallback UI
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;

  /**
   * Error title (used only with default fallback)
   */
  title?: string;

  /**
   * Action label (used only with default fallback)
   */
  actionLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    handleError(error, { context: 'ErrorBoundary', errorInfo });
  }

  /**
   * Reset error boundary state
   * This will attempt to re-render the children
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Use default ErrorDisplay
      return (
        <ErrorDisplay
          error={this.state.error}
          title={this.props.title || 'Something went wrong'}
          actionLabel={this.props.actionLabel || 'Try Again'}
          onAction={this.handleReset}
          showDetails={import.meta.env.DEV}
        />
      );
    }

    return this.props.children;
  }
}

