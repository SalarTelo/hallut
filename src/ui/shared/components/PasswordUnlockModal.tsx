/**
 * Password Unlock Modal
 * Modal for entering password to unlock modules
 */

import { useState } from 'react';
import { Modal } from './Modal.js';
import { Button } from './Button.js';
import { Input } from './Input.js';
import { ModalContent } from './ModalContent.js';
import { useThemeBorderColor } from '../hooks/useThemeBorderColor.js';

export interface PasswordUnlockModalProps {
  /**
   * Whether modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Callback when password is submitted
   * Returns true if password is correct, false otherwise
   */
  onUnlock: (password: string) => Promise<boolean>;

  /**
   * Optional hint for the password
   */
  hint?: string;

  /**
   * Module name to display
   */
  moduleName?: string;
}

/**
 * Password Unlock Modal component
 */
export function PasswordUnlockModal({
  isOpen,
  onClose,
  onUnlock,
  hint,
  moduleName,
}: PasswordUnlockModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim()) return;

    setError(null);
    setSubmitting(true);

    try {
      const correct = await onUnlock(password);

      if (correct) {
        setPassword('');
        setError(null);
        onClose();
      } else {
        setError('Fel lösenord. Försök igen.');
        setPassword('');
      }
    } catch (err) {
      setError('Ett fel uppstod. Försök igen.');
      console.error('Password unlock error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !submitting && password.trim()) {
      handleSubmit();
    }
  };

  const borderColorValue = useThemeBorderColor();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      closeOnOverlayClick={true}
      closeOnEscape={true}
    >
      <ModalContent borderColor={borderColorValue} className="space-y-4">
        <h3 className="pixelated text-yellow-400 text-lg font-bold mb-4">
          {moduleName ? `Lås upp ${moduleName}` : 'Lås upp modul'}
        </h3>
        {hint && (
          <p className="text-sm text-gray-400 italic pixelated">
            Ledtråd: {hint}
          </p>
        )}

        <div>
          <label htmlFor="password-input" className="block text-sm font-medium text-gray-300 mb-2 pixelated">
            Lösenord
          </label>
          <Input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ange lösenord"
            autoFocus
            disabled={submitting}
            className="w-full"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 pixelated">{error}</p>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button
            onClick={handleClose}
            variant="secondary"
            disabled={submitting}
            pixelated
          >
            Avbryt
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!password.trim() || submitting}
            loading={submitting}
            pixelated
          >
            Lås upp
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

