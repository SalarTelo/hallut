/**
 * Error Service
 * Centralized error handling and user-friendly error messages
 */

/**
 * Handle an error (log and optionally report)
 * @param error - Error object or message
 * @param context - Additional context information
 */
export function handleError(
  error: Error | string,
  context?: Record<string, unknown>
): void {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObj = typeof error === 'string' ? new Error(error) : error;

  // Log error in development
  if (import.meta.env.DEV) {
    console.error('Error:', errorMessage, context || '');
    if (errorObj.stack) {
      console.error('Stack:', errorObj.stack);
    }
  }

  // In production, you might want to send to error tracking service
  // e.g., Sentry, LogRocket, etc.
}

/**
 * Get user-friendly error message
 * @param error - Error object
 * @returns User-friendly message
 */
export function getUserFriendlyMessage(error: Error): string {
  // Map common error types to user-friendly messages
  if (error.message.includes('Network') || error.message.includes('fetch')) {
    return 'Nätverksfel. Kontrollera din internetanslutning.';
  }

  if (error.message.includes('404') || error.message.includes('Not Found')) {
    return 'Resursen kunde inte hittas.';
  }

  if (error.message.includes('500') || error.message.includes('Internal Server')) {
    return 'Ett serverfel uppstod. Försök igen senare.';
  }

  if (error.message.includes('timeout')) {
    return 'Begäran tog för lång tid. Försök igen.';
  }

  // Return the error message if it's already user-friendly
  // Otherwise return a generic message
  return error.message || 'Ett oväntat fel uppstod.';
}

