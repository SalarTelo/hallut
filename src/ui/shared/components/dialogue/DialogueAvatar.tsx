/**
 * DialogueAvatar Component
 * Renders the avatar portion of the dialogue box
 */

import type { ReactNode } from 'react';

export type AvatarType = 'silhouette' | 'image' | 'icon';

export interface DialogueAvatarProps {
  /**
   * Avatar type
   */
  type: AvatarType;

  /**
   * Avatar data (image URL or icon component)
   */
  data?: string | ReactNode;

  /**
   * Speaker name for alt text
   */
  speaker: string;

  /**
   * Border color for styling
   */
  borderColor: string;
}

/**
 * DialogueAvatar component
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
            <div className="w-full h-full flex items-center justify-center p-2 min-h-[12rem]">
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
          <div className="flex items-center justify-center w-full min-h-[12rem] p-4">
            {data}
          </div>
        );

      case 'silhouette':
      default:
        return (
          <div className="w-full bg-blue-400 flex items-center justify-center p-4 min-h-[12rem]">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex-shrink-0" />
          </div>
        );
    }
  };

  return (
    <div
      className="w-32 border-r-2 flex-shrink-0 overflow-hidden rounded-l-lg flex items-center justify-center"
      style={{ borderColor }}
    >
      {renderContent()}
    </div>
  );
}

