import { ReactNode, useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  icon?: ReactNode;
}

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  icon,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      backgroundColor: 'var(--color-success)',
      color: 'white',
    },
    error: {
      backgroundColor: 'var(--color-error)',
      color: 'white',
    },
    warning: {
      backgroundColor: 'var(--color-warning)',
      color: 'white',
    },
    info: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
    },
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'var(--spacing-6)',
        right: 'var(--spacing-6)',
        minWidth: '300px',
        maxWidth: '500px',
        padding: 'var(--spacing-4) var(--spacing-6)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-3)',
        zIndex: 'var(--z-tooltip)',
        animation: 'slideInRight var(--transition-base)',
        ...typeStyles[type],
      }}
    >
      {icon || <span aria-hidden="true">{icons[type]}</span>}
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: 'var(--spacing-1)',
          fontSize: 'var(--font-size-lg)',
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

