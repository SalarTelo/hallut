/**
 * Pixel Icon Component
 * Uses the Pixelarticons library for pixel art icons
 * https://pixelarticons.com
 * 
 * @example
 * ```tsx
 * <PixelIcon type="check" size={24} color="#FFD700" />
 * ```
 */

import { memo } from 'react';
import CheckIcon from 'pixelarticons/svg/check.svg?react';
import LockIcon from 'pixelarticons/svg/lock.svg?react';
import PlayIcon from 'pixelarticons/svg/play.svg?react';
import PinIcon from 'pixelarticons/svg/pin.svg?react';
import CloseIcon from 'pixelarticons/svg/close.svg?react';
import ArrowRightIcon from 'pixelarticons/svg/arrow-right.svg?react';
import ArrowLeftIcon from 'pixelarticons/svg/arrow-left.svg?react';
import MoonStarIcon from 'pixelarticons/svg/moon-star.svg?react';
import ShieldIcon from 'pixelarticons/svg/shield.svg?react';
import AvatarIcon from 'pixelarticons/svg/avatar.svg?react';
import BoxIcon from 'pixelarticons/svg/add-box.svg?react';
import ChatIcon from 'pixelarticons/svg/chat.svg?react';
import ReloadIcon from 'pixelarticons/svg/reload.svg?react';
import HumanIcon from 'pixelarticons/svg/human.svg?react';
import ClipboardIcon from 'pixelarticons/svg/clipboard.svg?react';
import ImageIcon from 'pixelarticons/svg/image.svg?react';
import NoteIcon from 'pixelarticons/svg/note.svg?react';
import BookIcon from 'pixelarticons/svg/book.svg?react';
import MessageIcon from 'pixelarticons/svg/message.svg?react';
import ArticleIcon from 'pixelarticons/svg/article.svg?react';

export type PixelIconType =
  | 'lock'
  | 'check'
  | 'play'
  | 'star'
  | 'pin'
  | 'close'
  | 'arrow-right'
  | 'arrow-left'
  | 'shield'
  | 'avatar'
  | 'box'
  | 'chat'
  | 'reload'
  | 'human'
  | 'clipboard'
  | 'image'
  | 'note'
  | 'book'
  | 'message'
  | 'article';

export interface PixelIconProps {
  /**
   * Icon type
   */
  type: PixelIconType;

  /**
   * Size in pixels (default: 24, recommended: 24, 48, 72, 96)
   * For smaller sizes, 24px is used and scaled down with CSS
   */
  size?: number;

  /**
   * Color (default: currentColor)
   */
  color?: string;

  /**
   * CSS classes
   */
  className?: string;
}

/**
 * Convert desired size to nearest recommended size
 * Pixelarticons recommends 24, 48, 72, 96px for sharp rendering
 */
function getOptimalSize(desiredSize: number): { renderSize: number; scale: number } {
  const recommendedSizes = [24, 48, 72, 96];
  
  // For small sizes, use 24px and scale down
  if (desiredSize < 24) {
    return { renderSize: 24, scale: desiredSize / 24 };
  }
  
  // Find nearest recommended size
  const closest = recommendedSizes.reduce((prev, curr) => {
    return Math.abs(curr - desiredSize) < Math.abs(prev - desiredSize) ? curr : prev;
  });
  
  return { renderSize: closest, scale: desiredSize / closest };
}

const iconComponents: Record<PixelIconType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  lock: LockIcon,
  check: CheckIcon,
  play: PlayIcon,
  star: MoonStarIcon, // Using moon-star as star alternative
  pin: PinIcon,
  close: CloseIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-left': ArrowLeftIcon,
  shield: ShieldIcon,
  avatar: AvatarIcon,
  box: BoxIcon,
  chat: ChatIcon,
  reload: ReloadIcon,
  human: HumanIcon,
  clipboard: ClipboardIcon,
  image: ImageIcon,
  note: NoteIcon,
  book: BookIcon,
  message: MessageIcon,
  article: ArticleIcon,
};

/**
 * Pixel Icon component
 * Renders pixel art icons from Pixelarticons
 */
export const PixelIcon = memo(function PixelIcon({
  type,
  size = 24,
  color = 'currentColor',
  className = '',
}: PixelIconProps) {
  const IconComponent = iconComponents[type];

  if (!IconComponent) {
    console.warn(`PixelIcon: Unknown icon type "${type}"`);
    return null;
  }

  const { renderSize, scale } = getOptimalSize(size);
  const needsScaling = scale !== 1;

  return (
    <IconComponent
      width={renderSize}
      height={renderSize}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        color,
        fill: 'currentColor',
        ...(needsScaling && {
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }),
      }}
    />
  );
});
