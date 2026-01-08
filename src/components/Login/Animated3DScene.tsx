import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import * as styles from './Animated3DScene.styles';

interface Animated3DSceneProps {
  isVideo: boolean;
  videoUrl?: string;
}

export const Animated3DScene = ({ isVideo, videoUrl }: Animated3DSceneProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if video exists, otherwise show 3D CSS animation
  const hasVideo = videoUrl && videoUrl !== '';

  useEffect(() => {
    if (isVideo && videoRef.current && hasVideo) {
      const video = videoRef.current;

      // Set video source
      video.src = videoUrl || '';
      video.load();

      let isPlayingAttempted = false;

      // Try to play the video
      const attemptPlay = async () => {
        if (isPlayingAttempted) return;
        isPlayingAttempted = true;

        try {
          await video.play();
          console.log('Video playing successfully');
        } catch (err) {
          console.log('Video autoplay prevented:', err);
          // Set up user interaction fallback
          const handleUserInteraction = async () => {
            try {
              await video.play();
              console.log('Video started after user interaction');
            } catch (playErr) {
              console.log('Video play failed even after interaction:', playErr);
            }
            // Clean up listeners
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
          };

          document.addEventListener('click', handleUserInteraction, { once: true });
          document.addEventListener('touchstart', handleUserInteraction, { once: true });
          document.addEventListener('keydown', handleUserInteraction, { once: true });
        }
      };

      // Wait for video to be ready, then attempt to play
      const handleCanPlayThrough = () => {
        attemptPlay();
      };

      video.addEventListener('canplaythrough', handleCanPlayThrough);

      // Fallback: try to play when metadata is loaded
      const handleLoadedMetadata = () => {
        // Small delay to ensure video is fully ready
        setTimeout(() => {
          if (!isPlayingAttempted) {
            attemptPlay();
          }
        }, 100);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        isPlayingAttempted = false;
      };
    }
  }, [isVideo, hasVideo, videoUrl]);

  if (!isVideo) {
    return null; // Show regular image background instead
  }

  return (
    <Box ref={containerRef} sx={styles.container}>
      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
              backgroundColor: '#000',
              display: 'block',
            }}
            onError={(e) => {
              console.error('Video failed to load:', e);
              console.error('Video element:', videoRef.current);
              console.error('Video URL was:', videoUrl);
              console.error('Video error details:', videoRef.current?.error);
            }}
            onLoadStart={() => {
              console.log('Video loading started:', videoUrl);
            }}
            onLoadedMetadata={() => {
              console.log('Video metadata loaded');
              console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            }}
            onCanPlay={() => {
              console.log('Video can play');
            }}
            onPlaying={() => {
              console.log('Video is playing!');
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Debug: Show video URL */}
          {import.meta.env.DEV && (
            <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, color: 'white', fontSize: '12px', background: 'rgba(0,0,0,0.7)', padding: 1 }}>
              Video URL: {videoUrl}
            </Box>
          )}
        </>
      ) : (
        <Box sx={styles.placeholder3D}>
          {/* 3D CSS Animation - Gaming Pads and Laptop */}
          {/* Replace with actual 3D video when ready: place video at /assets/videos/3d-gaming-scene.mp4 */}
          <Box sx={styles.gamingPad3D} className="pad-left" />
          <Box sx={styles.laptop3D} />
          <Box sx={styles.gamingPad3D} className="pad-right" />
        </Box>
      )}
      <Box sx={styles.overlay} />
    </Box>
  );
};
