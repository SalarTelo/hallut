/**
 * Modulinformationsmodal-komponent
 * Modaldialog som visar detaljerad modulinformation
 * JRPG-stilad modal
 */

import { Modal } from './Modal.js';
import { Button } from './Button.js';
import { getThemeValue } from '@utils/theme.js';

export interface ModuleInfoModalProps {
  /**
   * Om modalen är öppen
   */
  isOpen: boolean;

  /**
   * Callback för att stänga modalen
   */
  onClose: () => void;

  /**
   * Modul-ID
   */
  moduleId: string;

  /**
   * Modulnamn
   */
  moduleName: string;

  /**
   * Modulbeskrivning/sammanfattning
   */
  description?: string;

  /**
   * Om modulen är upplåst
   */
  isUnlocked: boolean;

  /**
   * Callback när "Gå in i modul" klickas
   */
  onEnterModule: () => void;

  /**
   * Kantfärg (standard från tema)
   */
  borderColor?: string;
}

/**
 * Modulinformationsmodal-komponent
 */
export function ModuleInfoModal({
  isOpen,
  onClose,
  moduleId,
  moduleName,
  description,
  isUnlocked,
  onEnterModule,
  borderColor,
}: ModuleInfoModalProps) {
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnEscape
      closeOnOverlayClick
    >
      <div
        className="bg-black border-2 rounded-lg p-6 animate-scale-in"
        style={{
          borderColor: borderColorValue,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 15, 35, 0.95) 100%)',
        }}
      >
        <div className="space-y-4">
          {/* Rubrik */}
          <div className="pb-3 border-b" style={{ borderColor: borderColorValue, opacity: 0.3 }}>
            <h2 className="pixelated text-yellow-400 text-xl font-bold mb-1">{moduleName}</h2>
            <p className="text-gray-400 text-xs">Modul: {moduleId}</p>
          </div>

          {/* Beskrivning */}
          {description && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-bold text-yellow-400 mb-2 pixelated uppercase tracking-wide">Beskrivning</h3>
              <p className="pixelated text-white text-sm leading-relaxed">{description}</p>
            </div>
          )}

          {/* Status */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-sm font-bold text-yellow-400 mb-2 pixelated uppercase tracking-wide">Status</h3>
            <p className="pixelated text-gray-300 text-sm">
              {isUnlocked ? 'Tillgänglig' : 'Låst'}
            </p>
          </div>

          {/* Åtgärder */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
            <Button variant="ghost" pixelated onClick={onClose} size="sm">
              Stäng
            </Button>
            {isUnlocked && (
            <Button variant="primary" pixelated onClick={onEnterModule} size="sm">
              Gå in i modul
            </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
