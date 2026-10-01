import React from 'react'

export const MetallicTrophy: React.FC<{ className?: string }> = ({ className = 'w-[18px] h-[18px]' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <g fill="none">
      <defs>
        <linearGradient id="trophy_m0" x1="12" y1="2" x2="12" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBD38D" />
          <stop offset="0.5" stopColor="#D69E2E" />
          <stop offset="1" stopColor="#744210" />
        </linearGradient>
        <linearGradient id="trophy_m1" x1="12" y1="15" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#4A5568" />
        </linearGradient>
        <linearGradient id="trophy_m2" x1="12" y1="2" x2="12" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Cup bowl */}
      <path
        d="M6 3H18V9C18 12.3 15.3 15 12 15C8.7 15 6 12.3 6 9V3Z"
        fill="url(#trophy_m0)"
      />
      {/* Handles */}
      <path
        d="M6 4H3C2.4 4 2 4.4 2 5V7C2 8.7 3.3 10 5 10H6V8H5C4.4 8 4 7.6 4 7V6H6V4Z"
        fill="url(#trophy_m0)"
      />
      <path
        d="M18 4H21C21.6 4 22 4.4 22 5V7C22 8.7 20.7 10 19 10H18V8H19C19.6 8 20 7.6 20 7V6H18V4Z"
        fill="url(#trophy_m0)"
      />
      {/* Base stem and pedestal */}
      <path
        d="M10 15H14V18H10V15Z"
        fill="url(#trophy_m1)"
      />
      <path
        d="M7 18H17L18 21H6L7 18Z"
        fill="url(#trophy_m1)"
      />
      {/* Rim highlight */}
      <path
        d="M6.5 3.5H17.5V4.5H6.5V3.5Z"
        fill="url(#trophy_m2)"
      />
    </g>
  </svg>
)
