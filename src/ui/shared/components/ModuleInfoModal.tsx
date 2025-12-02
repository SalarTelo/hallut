/**
 * Modulinformationsmodal-komponent
 * Modaldialog som visar detaljerad modulinformation
 * JRPG-stilad modal
 */

import { useEffect, useState } from 'react';
import { Modal } from './Modal.js';
import { PixelIcon } from './PixelIcon.js';
import { getThemeValue } from '@utils/theme.js';
import { getModule } from '@core/module/registry.js';
import type { ModuleDefinition } from '@core/types/module.js';

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
      size="xl"
      closeOnEscape
      closeOnOverlayClick
      showCloseButton={false}
      className="max-w-2xl"
    >
      <div
        className="bg-black border-2 rounded-lg animate-scale-in overflow-hidden"
        style={{
          borderColor: borderColorValue,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 35, 0.98) 100%)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.9), 0 0 24px ${borderColorValue}50, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }}
      >
        {/* Header with improved styling */}
        <div
          className="px-6 py-4 border-b-2"
          style={{
            borderColor: borderColorValue,
            background: `linear-gradient(135deg, ${borderColorValue}20 0%, ${borderColorValue}08 100%)`,
            boxShadow: `inset 0 1px 0 ${borderColorValue}30`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="pixelated text-yellow-300 text-xl font-bold mb-1.5 truncate leading-tight" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>
                {displayName}
              </h2>
              <p className="text-gray-300 text-[10px] font-mono truncate opacity-80" style={{ textShadow: '0 1px 1px rgba(0, 0, 0, 0.6)' }}>
                {moduleId}
              </p>
            </div>
            {/* Status badge - improved */}
            <div
              className={`px-3 py-1.5 rounded-lg border-2 flex items-center gap-1.5 flex-shrink-0 ${statusInfo.bgColor} ${statusInfo.borderColor}`}
              style={{
                boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
              }}
            >
              <PixelIcon
                type={statusInfo.iconType}
                size={12}
                color="currentColor"
                className={statusInfo.color}
              />
              <span className={`text-xs ${statusInfo.color} font-bold pixelated`}>
                {statusInfo.text}
              </span>
            </div>
          </div>
        </div>

        {/* Content - improved spacing and styling */}
        <div className="px-6 py-4 space-y-4">
          {/* Description - enhanced */}
          {displayDescription && (
            <div>
              <h3 className="text-xs font-bold text-yellow-400 mb-2 pixelated uppercase tracking-wider flex items-center gap-2" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>
                <span className="w-1 h-4 bg-yellow-400 rounded-full" style={{ boxShadow: `0 0 6px ${borderColorValue}60` }}></span>
                Om modulen
              </h3>
              <p className="pixelated text-gray-100 text-xs leading-relaxed" style={{ textShadow: '0 1px 1px rgba(0, 0, 0, 0.7)' }}>
                {displayDescription}
              </p>
            </div>
          )}

          {/* Statistics - improved cards */}
          {!loading && moduleDefinition && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: `${borderColorValue}30` }}>
              <div 
                className="bg-gray-900/60 rounded-lg px-3 py-2.5 border backdrop-blur-sm"
                style={{
                  borderColor: `${borderColorValue}20`,
                  background: `linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 2px 8px rgba(0, 0, 0, 0.4)`,
                }}
              >
                <div className="text-[10px] text-gray-300 mb-1 pixelated uppercase tracking-wide" style={{ textShadow: '0 1px 1px rgba(0, 0, 0, 0.6)' }}>
                  Uppgifter
                </div>
                <div className="text-xl font-bold text-yellow-300 pixelated" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>
                  {taskCount}
                </div>
              </div>
              <div 
                className="bg-gray-900/60 rounded-lg px-3 py-2.5 border backdrop-blur-sm"
                style={{
                  borderColor: `${borderColorValue}20`,
                  background: `linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 2px 8px rgba(0, 0, 0, 0.4)`,
                }}
              >
                <div className="text-[10px] text-gray-300 mb-1 pixelated uppercase tracking-wide" style={{ textShadow: '0 1px 1px rgba(0, 0, 0, 0.6)' }}>
                  Interaktiva objekt
                </div>
                <div className="text-xl font-bold text-yellow-300 pixelated" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>
                  {interactableCount}
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="pt-3 border-t" style={{ borderColor: `${borderColorValue}30` }}>
              <p className="text-xs text-gray-300 pixelated text-center py-2" style={{ textShadow: '0 1px 1px rgba(0, 0, 0, 0.6)' }}>
                Laddar modulinformation...
              </p>
            </div>
          )}
        </div>

        {/* Footer - improved */}
        <div
          className="px-6 py-3 border-t-2 flex justify-end gap-3"
          style={{
            borderColor: borderColorValue,
            background: `linear-gradient(135deg, ${borderColorValue}08 0%, transparent 100%)`,
            boxShadow: `inset 0 1px 0 ${borderColorValue}20`,
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 rounded pixelated text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: borderColorValue,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: '#d1d5db',
              boxShadow: `0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
              e.currentTarget.style.borderColor = borderColorValue;
              e.currentTarget.style.color = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = borderColorValue;
              e.currentTarget.style.color = '#d1d5db';
            }}
          >
            Stäng
          </button>
          {isUnlocked && (
            <button
              onClick={onEnterModule}
              className="px-5 py-2 border-2 rounded pixelated text-xs font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                borderColor: borderColorValue,
                backgroundColor: `${borderColorValue}20`,
                color: '#fbbf24',
                boxShadow: `0 2px 8px rgba(0, 0, 0, 0.4), 0 0 12px ${borderColorValue}40, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${borderColorValue}30`;
                e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 16px ${borderColorValue}60, inset 0 1px 0 rgba(255, 255, 255, 0.2)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${borderColorValue}20`;
                e.currentTarget.style.boxShadow = `0 2px 8px rgba(0, 0, 0, 0.4), 0 0 12px ${borderColorValue}40, inset 0 1px 0 rgba(255, 255, 255, 0.15)`;
              }}
            >
              {isCompleted ? 'Gå tillbaka' : 'Gå in i modul'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
