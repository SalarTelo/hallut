/**
 * Dialogavatar-komponent
 * Renderar avatar-delen av dialogrutan
 * 
 * @deprecated This component is deprecated. Use FloatingAvatarBadge instead for the new floating avatar design.
 * This component is kept for backwards compatibility.
 */

import type { ReactNode } from 'react';

export type AvatarType = 'silhouette' | 'image' | 'icon';

export interface DialogueAvatarProps {
  /**
   * Avatartyp
   */
  type: AvatarType;

  /**
   * Avatardata (bild-URL eller ikonkomponent)
   */
  data?: string | ReactNode;

  /**
   * Talarens namn för alt-text
   */
  speaker: string;

  /**
   * Kantfärg för styling
   */
  borderColor: string;
}

/**
 * Dialogavatar-komponent
 */
export function DialogueAvatar({
  type,
  data,
  speaker,
  borderColor,
}: DialogueAvatarProps) {
  const renderContent = () => {
    switch (type) {
      case 'image':
        if (typeof data === 'string') {
          return (
            <div className="w-full h-full flex items-center justify-center p-1.5 sm:p-1">
              <img
                src={data}
                alt={speaker}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          );
        }
        return null;

      case 'icon':
        return (
          <div className="flex items-center justify-center w-full h-full p-2 sm:p-1.5">
            {data}
          </div>
        );

      case 'silhouette':
      default:
        return (
          <div className="w-full h-full bg-blue-400 flex items-center justify-center p-2 sm:p-1.5">
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex-shrink-0" />
          </div>
        );
    }
  };

  return (
    <div
      className="w-24 sm:w-20 border-r flex-shrink-0 overflow-hidden rounded-l-lg flex items-center justify-center self-stretch"
      style={{ borderColor }}
    >
      {renderContent()}
    </div>
  );
}
