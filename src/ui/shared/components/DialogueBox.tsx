/**
 * Dialogruta-komponent
 * Nedre positionerad dialogruta med konfigurerbar avatar
 * JRPG-stil dialogsystem med skrivmaskineffekt
 */

import type { ReactNode } from 'react';
import { getThemeValue } from '@utils/theme.js';
import { useTypewriter, useDialogueInteraction } from '../hooks/index.js';
import {
  DialogueAvatar,
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
}: DialogueBoxProps) {
  const currentLine = lines[currentLineIndex] || '';
  const maxLines = lines.length;
  const isLastLine = currentLineIndex >= maxLines - 1;
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');

  // Skrivmaskineffekt med anpassad hook
  const { displayedText, isTyping, skip } = useTypewriter({
    text: currentLine,
    speed: 30,
    autoStart: true,
  });

  // Tangentbords- och klickinteraktionshantering
  const { dialogueRef, handleClick } = useDialogueInteraction({
    isTyping,
    isLastLine,
    hasChoices: Boolean(choices && choices.length > 0),
    skipTypewriter: skip,
    onContinue,
  });

  // Bestäm om val ska visas
  const showChoices = isLastLine && !isTyping && choices && choices.length > 0;

  return (
    <div
      ref={dialogueRef}
      className="fixed bottom-0 left-0 right-0 z-50 p-2 outline-none"
      onClick={handleClick}
      tabIndex={-1}
      role="dialog"
      aria-label={`Dialog med ${speaker}`}
      style={{ outline: 'none' }}
    >
      <div
        className="max-w-5xl mx-auto bg-black border-2 rounded-lg animate-scale-in cursor-pointer overflow-hidden"
        style={{
          borderColor: borderColorValue,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 15, 35, 0.95) 100%)',
        }}
      >
        <div className="flex min-h-[8rem]">
          {/* Avatar */}
          <DialogueAvatar
            type={avatarType}
            data={avatarData}
            speaker={speaker}
            borderColor={borderColorValue}
          />

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
              />
            )}
          </DialogueText>
        </div>
      </div>
    </div>
  );
}
