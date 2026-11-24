import React, { useState } from 'react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  variant?: 'photo' | 'avatar';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  variant = 'photo'
}) => {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    const initials = (fallbackLabel || alt || 'F')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('');

    if (variant === 'avatar') {
      return (
        <div
          className={`flex items-center justify-center bg-[#596044] text-[#F5F0E7] font-semibold select-none ${className}`}
          aria-label={alt}
        >
          {initials || 'F'}
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#E7DFD1] to-[#D6CCB9] text-[#303528] font-editorial font-semibold text-sm p-4 text-center ${className}`}
        aria-label={alt}
      >
        <span>{fallbackLabel || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
