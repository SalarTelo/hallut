import type { WorldNode } from '../../types/WorldMap.types.js';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { useI18n } from '../../i18n/context.js';
import '../../styles/game-theme.css';

export interface TaskDetailsPopupProps {
  node: WorldNode;
  onBeginTask: () => void;
  onClose: () => void;
}

export function TaskDetailsPopup({ node, onBeginTask, onClose }: TaskDetailsPopupProps) {
  const { t } = useI18n();
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={node.title || `Task ${node.levelNumber}`}
      size="md"
      closeOnEscape={true}
      closeOnBackdropClick={true}
      aria-label={`Task details: ${node.title || `Task ${node.levelNumber}`}`}
    >
      {node.description && (
        <div
          className="game-surface"
          style={{
            padding: 'var(--spacing-5)',
            marginBottom: 'var(--spacing-6)',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          <p
            className="text-base"
            style={{
              margin: 0,
              color: 'var(--game-text-primary)',
            }}
          >
            {node.description}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
        <Button
          variant="outline"
          onClick={onClose}
          style={{
            borderColor: 'var(--game-world-border)',
            color: 'var(--game-world-border)',
            fontFamily: 'var(--font-family-pixel)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {t.taskDetails.cancel}
        </Button>
        <Button
          variant="primary"
          onClick={onBeginTask}
          style={{
            backgroundColor: 'var(--game-world-border)',
            color: 'var(--game-world-bg)',
            borderColor: 'var(--game-world-border)',
            fontFamily: 'var(--font-family-pixel)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {t.taskDetails.beginTask}
        </Button>
      </div>
    </Modal>
  );
}
