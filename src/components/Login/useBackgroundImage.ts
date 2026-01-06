import { useState, useEffect } from 'react';

/**
 * Hook to check if a background image exists and is loaded
 * Falls back gracefully if image doesn't exist
 */
export const useBackgroundImage = (imagePath: string) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageExists, setImageExists] = useState(false);

  useEffect(() => {
    if (!imagePath) {
      setImageExists(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageExists(true);
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageExists(false);
      setImageLoaded(true);
    };
    img.src = imagePath;
  }, [imagePath]);

  return { imageLoaded, imageExists, imagePath: imageExists ? imagePath : undefined };
};
