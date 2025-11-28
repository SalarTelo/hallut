/**
 * Pixelikon-komponent
 * Använder Pixelarticons-biblioteket för pixelgrafikikoner
 * https://pixelarticons.com
 */

import CheckIcon from 'pixelarticons/svg/check.svg?react';
import LockIcon from 'pixelarticons/svg/lock.svg?react';
import PlayIcon from 'pixelarticons/svg/play.svg?react';
import PinIcon from 'pixelarticons/svg/pin.svg?react';
import CloseIcon from 'pixelarticons/svg/close.svg?react';
import ArrowRightIcon from 'pixelarticons/svg/arrow-right.svg?react';
import ArrowLeftIcon from 'pixelarticons/svg/arrow-left.svg?react';
import MoonStarIcon from 'pixelarticons/svg/moon-star.svg?react';

export type PixelIconType =
  | 'lock'
  | 'check'
  | 'play'
  | 'star'
  | 'pin'
  | 'close'
  | 'arrow-right'
  | 'arrow-left';

export interface PixelIconProps {
  /**
   * Ikontyp
   */
  type: PixelIconType;

  /**
   * Storlek i pixlar (standard: 24, rekommenderat: 24, 48, 72, 96)
   * För mindre storlekar används 24px och skalas med CSS
   */
  size?: number;

  /**
   * Färg (standard: currentColor)
   */
  color?: string;

  /**
   * CSS-klasser
   */
  className?: string;
}

/**
 * Konvertera önskad storlek till närmaste rekommenderad storlek
 * Pixelarticons rekommenderar 24, 48, 72, 96px för skarp rendering
 */
function getOptimalSize(desiredSize: number): { renderSize: number; scale: number } {
  const recommendedSizes = [24, 48, 72, 96];
  
  // För små storlekar, använd 24px och skala ner
  if (desiredSize < 24) {
    return { renderSize: 24, scale: desiredSize / 24 };
  }
  
  // Hitta närmaste rekommenderad storlek
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
};

/**
 * Pixelikon-komponent
 * Renderar pixelgrafikikoner från Pixelarticons
 */
export function PixelIcon({
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
}
