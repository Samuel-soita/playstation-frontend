import React, { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  src?: string;
  poster?: string;
  className?: string;
  children?: React.ReactNode;
  opacity?: number;
  blur?: number;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  poster,
  className = '',
  children,
  opacity = 0.4,
  blur = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video && src) {
      console.log('VideoBackground: Loading video:', src);

      // Try to play the video
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('VideoBackground: Video started playing successfully');
          setIsPlaying(true);
        }).catch((error) => {
          console.log('VideoBackground: Video autoplay failed (normal for modern browsers):', error);
          // This is normal - browsers block autoplay
          // Video will still be visible as a poster/frame
          setIsPlaying(false);
        });
      }

      video.addEventListener('play', () => setIsPlaying(true));
      video.addEventListener('pause', () => setIsPlaying(false));

      // Add event listeners for debugging
      const handleLoadStart = () => console.log('VideoBackground: Video load started');
      const handleLoadedData = () => console.log('VideoBackground: Video data loaded');
      const handleError = (e: Event) => {
        console.error('VideoBackground: Error loading video:', e);
        // Try to load as image fallback
        if (video) {
          video.style.display = 'none';
          console.log('VideoBackground: Video hidden due to error');
        }
      };
      const handleCanPlay = () => console.log('VideoBackground: Video can play');

      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      video.addEventListener('canplay', handleCanPlay);

      // Cleanup
      return () => {
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [src]);

  if (!src) {
    return (
      <div className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        style={{
          filter: `brightness(0.4) contrast(1.2) ${blur > 0 ? `blur(${blur}px)` : ''}`,
          opacity: opacity
        }}
        onError={(e) => {
          console.error('Video failed to load:', src);
          setVideoError(true);
          // Hide video and show fallback
          e.currentTarget.style.display = 'none';
        }}
        onClick={() => {
          const video = videoRef.current;
          if (video && !isPlaying) {
            video.play().then(() => {
              setIsPlaying(true);
              console.log('Video started playing after click');
            }).catch(console.error);
          }
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback background when video fails */}
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-400/20 via-amber-500/20 to-orange-500/20"
        style={{
          opacity: opacity,
          display: 'block' // Will be visible if video fails
        }}
      />

      {/* Play button overlay */}
      {!isPlaying && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const video = videoRef.current;
              if (video) {
                video.play().then(() => {
                  setIsPlaying(true);
                  console.log('Video started playing after button click');
                }).catch(console.error);
              }
            }}
            className="bg-yellow-500/80 hover:bg-yellow-500 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            title="Click to play video background"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Error message */}
      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-red-500/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            Video failed to load
          </div>
        </div>
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};