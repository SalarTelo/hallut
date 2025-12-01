/**
 * Modulinformationsmodal-komponent
 * Modaldialog som visar detaljerad modulinformation
 * JRPG-stilad modal
 */

import { useEffect, useState } from 'react';
import { Modal } from './Modal.js';
import { Button } from './Button.js';
import { PixelIcon } from './PixelIcon.js';
import { getThemeValue } from '@utils/theme.js';
import { getModule } from '../../../core/module/registry.js';
import type { ModuleDefinition } from '../../../core/types/module.js';

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
   * Modulnamn (fallback om config inte laddas)
   */
  moduleName: string;

  /**
   * Modulbeskrivning/sammanfattning (fallback)
   */
  description?: string;

  /**
   * Om modulen är upplåst
   */
  isUnlocked: boolean;

  /**
   * Om modulen är slutförd
   */
  isCompleted?: boolean;

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
  moduleName: fallbackName,
  description: fallbackDescription,
  isUnlocked,
  isCompleted = false,
  onEnterModule,
  borderColor,
}: ModuleInfoModalProps) {
  const [moduleDefinition, setModuleDefinition] = useState<ModuleDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const module = getModule(moduleId);
      setModuleDefinition(module);
      setLoading(false);
    }
  }, [isOpen, moduleId]);

  const displayName = moduleDefinition?.config.manifest.name || fallbackName;
  const displayDescription = moduleDefinition?.config.manifest.summary || fallbackDescription || '';
  const taskCount = moduleDefinition?.content.tasks.length || 0;
  const interactableCount = moduleDefinition?.content.interactables.length || 0;

  const getStatusInfo = () => {
    if (isCompleted) {
      return {
        text: 'Slutförd',
        iconType: 'check' as const,
        color: 'text-green-400',
        bgColor: 'bg-green-400/20',
        borderColor: 'border-green-400/50',
      };
    }
    if (isUnlocked) {
      return {
        text: 'Tillgänglig',
        iconType: 'play' as const,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/20',
        borderColor: 'border-yellow-400/50',
      };
    }
    return {
      text: 'Låst',
      iconType: 'lock' as const,
      color: 'text-red-400',
      bgColor: 'bg-red-400/20',
      borderColor: 'border-red-400/50',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnEscape
      closeOnOverlayClick
    >
      <div
        className="bg-black border-2 rounded-lg animate-scale-in overflow-hidden"
        style={{
          borderColor: borderColorValue,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 35, 0.98) 100%)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 16px ${borderColorValue}40`,
        }}
      >
        {/* Header med gradient */}
        <div
          className="px-5 py-4 border-b-2"
          style={{
            borderColor: borderColorValue,
            background: `linear-gradient(135deg, ${borderColorValue}15 0%, ${borderColorValue}05 100%)`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="pixelated text-yellow-300 text-lg font-bold mb-1 truncate">
                {displayName}
              </h2>
              <p className="text-gray-400 text-[10px] font-mono truncate">
                {moduleId}
              </p>
            </div>
            {/* Status badge */}
            <div
              className={`px-3 py-1.5 rounded border-2 flex items-center gap-1.5 flex-shrink-0 ${statusInfo.bgColor} ${statusInfo.borderColor}`}
            >
              <PixelIcon
                type={statusInfo.iconType}
                size={12}
                color="currentColor"
                className={statusInfo.color}
              />
              <span className={`text-xs ${statusInfo.color} font-semibold pixelated`}>
                {statusInfo.text}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4">
          {/* Beskrivning */}
          {displayDescription && (
            <div>
              <h3 className="text-xs font-bold text-yellow-400 mb-2 pixelated uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-1 h-4 bg-yellow-400"></span>
                Om modulen
              </h3>
              <p className="pixelated text-white text-xs leading-relaxed">
                {displayDescription}
              </p>
            </div>
          )}

          {/* Statistik */}
          {!loading && moduleDefinition && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700/50">
              <div className="bg-gray-900/50 rounded px-3 py-2 border border-gray-700/30">
                <div className="text-[10px] text-gray-400 mb-0.5 pixelated uppercase tracking-wide">
                  Uppgifter
                </div>
                <div className="text-base font-bold text-yellow-300 pixelated">
                  {taskCount}
                </div>
              </div>
              <div className="bg-gray-900/50 rounded px-3 py-2 border border-gray-700/30">
                <div className="text-[10px] text-gray-400 mb-0.5 pixelated uppercase tracking-wide">
                  Interaktiva objekt
                </div>
                <div className="text-base font-bold text-yellow-300 pixelated">
                  {interactableCount}
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="pt-3 border-t border-gray-700/50">
              <p className="text-xs text-gray-400 pixelated text-center py-2">
                Laddar modulinformation...
              </p>
            </div>
          )}
        </div>

        {/* Footer med knappar */}
        <div
          className="px-5 py-3 border-t-2 flex justify-end gap-2"
          style={{
            borderColor: borderColorValue,
            background: `linear-gradient(135deg, ${borderColorValue}05 0%, transparent 100%)`,
          }}
        >
          <Button
            variant="ghost"
            pixelated
            onClick={onClose}
            size="sm"
            className="text-xs"
          >
            Stäng
          </Button>
          {isUnlocked && (
            <Button
              variant="primary"
              pixelated
              onClick={onEnterModule}
              size="sm"
              className="text-xs"
            >
              {isCompleted ? 'Gå tillbaka' : 'Gå in i modul'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
