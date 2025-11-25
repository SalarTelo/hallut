export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'var(--color-primary)',
  className = '',
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: '20px',
    md: '40px',
    lg: '60px',
  };

  return (
    <div
      className={className}
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: sizeMap[size],
        height: sizeMap[size],
      }}
    >
      <svg
        style={{
          animation: 'spin 1s linear infinite',
          width: '100%',
          height: '100%',
        }}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
          strokeOpacity="0.25"
        />
        <path
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill={color}
          fillOpacity="0.75"
        />
      </svg>
    </div>
  );
}

