import { useI18n } from '../../i18n/context.js';
import { Button } from '../ui/Button.js';
import '../../styles/game-theme.css';

export interface FridgeModalProps {
  onNext?: () => void;
  imageUrl?: string;
}

export function FridgeModal({ onNext, imageUrl }: FridgeModalProps) {
  const { t } = useI18n();

  return (
    <div
      className="game-surface-elevated"
      style={{
        padding: 'var(--spacing-5)',
        border: '3px solid var(--game-world-border)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          marginBottom: 'var(--spacing-4)',
          color: 'var(--game-world-border)',
          fontFamily: 'var(--font-family-pixel)',
          fontSize: 'var(--font-size-lg)',
        }}
      >
        {t.fridge.title}
      </h2>
      
      <p
        className="text-base"
        style={{
          marginBottom: 'var(--spacing-4)',
          color: 'var(--game-text-primary)',
          lineHeight: 'var(--line-height-relaxed)',
        }}
      >
        {t.fridge.description}
      </p>
      
      {imageUrl ? (
        <div
          style={{
            width: '100%',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '2px solid var(--game-world-border-light)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          <img
            src={imageUrl}
            alt={t.fridge.imageAlt}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      ) : (
        <div
          className="game-surface"
          style={{
            padding: 'var(--spacing-8)',
            textAlign: 'center',
            border: '2px dashed var(--game-world-border-light)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--game-text-secondary)',
            marginBottom: 'var(--spacing-4)',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {t.fridge.noImage}
        </div>
      )}
      
      {onNext && (
        <div style={{ textAlign: 'right', marginTop: 'var(--spacing-4)' }}>
          <Button
            onClick={onNext}
            variant="primary"
            style={{
              backgroundColor: 'var(--game-world-border)',
              color: 'var(--game-text-primary)',
              fontFamily: 'var(--font-family-pixel)',
            }}
          >
            {t.common.close || 'Stäng'}
          </Button>
        </div>
      )}
    </div>
  );
}

