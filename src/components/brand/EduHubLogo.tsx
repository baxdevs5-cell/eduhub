import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const EduHubLogo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Original geometric knowledge crystal icon */}
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:rotate-6"
        >
          <defs>
            <linearGradient id="eduhub_grad_primary" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0d9488" />
              <stop offset="0.5" stopColor="#0284c7" />
              <stop offset="1" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="eduhub_grad_accent" x1="12" y1="10" x2="28" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#34d399" />
            </linearGradient>
          </defs>
          {/* Hexagonal Outer Frame */}
          <path
            d="M20 2L35.5885 11V29L20 38L4.41154 29V11L20 2Z"
            fill="url(#eduhub_grad_primary)"
            fillOpacity="0.15"
            stroke="url(#eduhub_grad_primary)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner Facet / Ascending Book & Prism Layer */}
          <path
            d="M20 8L30 14V26L20 32L10 26V14L20 8Z"
            fill="url(#eduhub_grad_primary)"
            fillOpacity="0.85"
          />
          <path
            d="M20 8V32M10 14L20 20L30 14M10 26L20 20L30 26"
            stroke="#ffffff"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Core Knowledge Beacon Dot */}
          <circle cx="20" cy="20" r="3" fill="#ffffff" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-display tracking-tight font-extrabold">
            <span className="text-slate-900 dark:text-white text-lg tracking-wide">Edu</span>
            <span className="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent text-lg">Hub</span>
          </div>
        </div>
      )}
    </div>
  );
};
