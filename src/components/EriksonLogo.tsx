import React from 'react';

interface EriksonLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  glow?: boolean;
}

const SIZES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
  hero: 'w-28 h-28 sm:w-36 sm:h-36',
};

/**
 * Erikson Official Brand Logo
 * Black squircle with the two crisp white angled bars, exactly as provided.
 */
export const EriksonLogo: React.FC<EriksonLogoProps> = ({
  className = '',
  size = 'md',
  glow = false,
}) => {
  const sizeClass = SIZES[size] || size;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group ${sizeClass} ${className}`}
      aria-label="Erikson Logo"
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-2xl bg-white/20 dark:bg-white/10 blur-xl transition-opacity duration-500 opacity-60 group-hover:opacity-100"
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.03]"
      >
        {/* Black squircle container */}
        <rect
          width="100"
          height="100"
          rx="23"
          ry="23"
          fill="#000000"
          className="stroke-neutral-800/80 dark:stroke-neutral-700/60"
          strokeWidth="1.2"
        />
        {/* Subtle top inner edge highlight */}
        <rect
          x="1.5"
          y="1.5"
          width="97"
          height="97"
          rx="22"
          ry="22"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
        {/* Left long diagonal slash */}
        <polygon
          points="52.5,31.8 60.5,31.8 32.7,67.8 24.5,67.8"
          fill="#FFFFFF"
        />
        {/* Right branch slash */}
        <polygon
          points="49.8,49.7 59.4,49.7 75.8,67.8 65.4,67.8"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
