import { useEffect, useState } from 'react';

export interface CharacterPortraitProps {
  imageUrl?: string;
  name: string;
  avatar?: string; // Fallback emoji/icon
  role?: string; // Character role to display
}

export function CharacterPortrait({ imageUrl, name, avatar, role }: CharacterPortraitProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = imageUrl;
    }
  }, [imageUrl]);

  return (
    <div className="dialogue-portrait-container">
      <div className="dialogue-portrait">
        {imageUrl && !imageError && imageLoaded ? (
          <img
            src={imageUrl}
            alt={name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{
              fontSize: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            {avatar || '👤'}
          </div>
        )}
      </div>
      <div className="dialogue-name-banner">
        {name}
      </div>
      {role && (
        <div className="dialogue-role-banner">
          {role}
        </div>
      )}
    </div>
  );
}

