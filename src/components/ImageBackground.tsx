import React from 'react';

interface ImageBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'gaming' | 'tech' | 'neon';
  imageSrc?: string;
}

export const ImageBackground: React.FC<ImageBackgroundProps> = ({
  className = '',
  children,
  variant = 'gaming',
  imageSrc
}) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'gaming':
        return {
          background: `
            radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(217, 119, 6, 0.2) 0%, transparent 50%),
            linear-gradient(135deg,
              rgba(251, 191, 36, 0.1) 0%,
              rgba(245, 158, 11, 0.1) 25%,
              rgba(217, 119, 6, 0.1) 50%,
              rgba(180, 83, 9, 0.1) 75%,
              rgba(146, 64, 14, 0.1) 100%
            )
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
          backgroundPosition: '0% 0%, 100% 100%, 50% 50%, 0% 0%',
        };
      case 'tech':
        return {
          background: `
            radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
            linear-gradient(135deg,
              rgba(59, 130, 246, 0.1) 0%,
              rgba(147, 51, 234, 0.1) 50%,
              rgba(236, 72, 153, 0.1) 100%
            )
          `,
        };
      case 'neon':
        return {
          background: `
            radial-gradient(circle at 25% 75%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
            linear-gradient(45deg,
              rgba(34, 197, 94, 0.1) 0%,
              rgba(239, 68, 68, 0.1) 25%,
              rgba(168, 85, 247, 0.1) 50%,
              rgba(34, 197, 94, 0.1) 75%,
              rgba(239, 68, 68, 0.1) 100%
            )
          `,
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        ...getBackgroundStyle(),
        ...(imageSrc && {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        })
      }}
    >
      {/* Gaming pattern overlay */}
      {variant === 'gaming' && (
        <>
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 191, 36, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 191, 36, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-yellow-400/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-amber-400/20 rotate-45 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-orange-400/10 rounded-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-yellow-500/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}

      {/* Content overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/10" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};