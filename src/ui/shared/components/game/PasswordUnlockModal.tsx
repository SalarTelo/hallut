/**
 * Password Unlock Modal
 * Modal for entering password to unlock modules
 */

import { useState } from 'react';
import { Modal } from '../overlays/Modal.js';
import { Button } from '../primitives/Button.js';
import { Input } from '../primitives/Input.js';
import { ModalContent } from '../overlays/ModalContent.js';
import { useThemeBorderColor } from '../../hooks/useThemeBorderColor.js';

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
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
          {moduleName ? `Unlock ${moduleName}` : 'Unlock Module'}
        </h3>
        {hint && (
          <p className="text-sm text-gray-400 italic pixelated">
            Hint: {hint}
          </p>
        )}

        <div>
          <label htmlFor="password-input" className="block text-sm font-medium text-gray-300 mb-2 pixelated">
            Password
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
            placeholder="Enter password"
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
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!password.trim() || submitting}
            loading={submitting}
            pixelated
          >
            Unlock
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

