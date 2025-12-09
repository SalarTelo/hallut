/**
 * Dialogruta-komponent
 * Nedre positionerad dialogruta med konfigurerbar avatar
 * JRPG-stil dialogsystem med skrivmaskineffekt
 */

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useThemeBorderColor } from '../hooks/useThemeBorderColor.js';
import { useTypewriter, useDialogueInteraction } from '../hooks/index.js';
import {
  FloatingAvatarBadge,
  DialogueText,
  DialogueChoices,
  type AvatarType,
  type DialogueChoice,
} from './dialogue/index.js';

// Återexportera typer för bakåtkompatibilitet
export type { AvatarType, DialogueChoice };

export interface DialogueBoxProps {
  /**
   * Talarens namn
   */
  speaker: string;

  /**
   * Avatartyp
   */
  avatarType?: AvatarType;

  /**
   * Avatardata (bild-URL, ikonkomponent, etc.)
   */
  avatarData?: string | ReactNode;

  /**
   * Dialograder
   */
  lines: string[];

  /**
   * Aktuellt radindex (0-baserat)
   */
  currentLineIndex: number;

  /**
   * Callback när man fortsätter till nästa rad
   */
  onContinue: () => void;

  /**
   * Val att visa i slutet av dialogen
   * Bör alltid tillhandahållas (auto-genereras om inte specificerat)
   */
  choices?: DialogueChoice[];

  /**
   * Kantfärg (standard från tema)
   */
  borderColor?: string;

  /**
   * Callback när dialogen stängs
   */
  onClose?: () => void;
}

/**
 * Dialogruta-komponent
 * Orkestrerar dialog-underkomponenter
 */
export function DialogueBox({
  speaker,
  avatarType = 'silhouette',
  avatarData,
  lines,
  currentLineIndex,
  onContinue,
  choices,
  borderColor,
  onClose,
}: DialogueBoxProps) {
  const currentLine = lines[currentLineIndex] || '';
  const maxLines = lines.length;
  const isLastLine = currentLineIndex >= maxLines - 1;
  const borderColorValue = useThemeBorderColor(borderColor);
  const choiceCount = choices?.length ?? 0;

  // Skrivmaskineffekt med anpassad hook
  const { displayedText, isTyping, skip } = useTypewriter({
    text: currentLine,
    speed: 30,
    autoStart: true,
  });

  // State for selection animation
  const [selectingIndex, setSelectingIndex] = useState<number | null>(null);

  // Handle choice selection with animation
  const handleChoiceSelect = (index: number) => {
    if (choices && choices[index]) {
      // Trigger animation immediately (use flushSync for instant state update)
      setSelectingIndex(index);
      // Execute action after animation
      setTimeout(() => {
        choices[index].action();
        setSelectingIndex(null);
      }, 150);
    }
  };

  // Tangentbords- och klickinteraktionshantering
  const { dialogueRef, handleClick, selectedChoiceIndex, setSelectedChoiceIndex } = useDialogueInteraction({
    isTyping,
    isLastLine,
    hasChoices: Boolean(choices && choices.length > 0),
    choiceCount,
    skipTypewriter: skip,
    onContinue,
    onChoiceSelect: handleChoiceSelect,
    onClose,
  });

  // Focus management: auto-focus dialogue box when it opens
  useEffect(() => {
    if (dialogueRef.current) {
      dialogueRef.current.focus();
    }
  }, [currentLineIndex]);

  // Focus trapping: keep focus within dialogue
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (dialogueRef.current && !dialogueRef.current.contains(e.target as Node)) {
        dialogueRef.current.focus();
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  // Bestäm om val ska visas
  const showChoices = isLastLine && !isTyping && choices && choices.length > 0;

  return (
    <div
      ref={dialogueRef}
      className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-1 outline-none"
      onClick={handleClick}
      tabIndex={0}
      role="dialog"
      aria-label={`Dialog med ${speaker}`}
      aria-modal="true"
      aria-live="polite"
      aria-atomic="true"
      style={{ outline: 'none' }}
    >
      <div className="max-w-5xl mx-auto relative pl-32 sm:pl-24">
        {/* Floating Avatar Badge */}
        <FloatingAvatarBadge
          type={avatarType}
          data={avatarData}
          speaker={speaker}
          borderColor={borderColorValue}
        />

        {/* Dialogue Box - offset to accommodate avatar */}
        <div
          className="bg-black border rounded-lg animate-scale-in overflow-hidden transition-all duration-200"
          style={{
            borderColor: borderColorValue,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 15, 35, 0.95) 100%)',
            willChange: 'height',
          }}
        >
          <div className="min-h-[8rem] sm:min-h-[6rem]">
            {/* Text och val */}
            <DialogueText
              speaker={speaker}
              displayedText={displayedText}
              isTyping={isTyping}
              currentLine={currentLineIndex}
              totalLines={maxLines}
              isLastLine={isLastLine}
              borderColor={borderColorValue}
            >
              {showChoices && (
                <DialogueChoices
                  choices={choices}
                  borderColor={borderColorValue}
                  selectedIndex={selectedChoiceIndex ?? undefined}
                  onSelectedIndexChange={setSelectedChoiceIndex}
                  selectingIndex={selectingIndex}
                  onChoiceClick={handleChoiceSelect}
                />
              )}
            </DialogueText>
          </div>
        </div>
      </div>
    </div>
  );
}
