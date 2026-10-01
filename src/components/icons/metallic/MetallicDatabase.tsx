import React from 'react'

export const MetallicDatabase: React.FC<{ className?: string }> = ({ className = 'w-[18px] h-[18px]' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <g fill="none">
      <defs>
        <linearGradient id="db_m0" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7B7" />
          <stop offset="0.5" stopColor="#10B981" />
          <stop offset="1" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="db_m1" x1="12" y1="2" x2="12" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#A7F3D0" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Top ellipse */}
      <ellipse cx="12" cy="5" rx="9" ry="3" fill="url(#db_m0)" />
      <ellipse cx="12" cy="5" rx="8" ry="2.2" fill="url(#db_m1)" />
      {/* Middle ring */}
      <path
        d="M21 5V12C21 13.66 16.97 15 12 15C7.03 15 3 13.66 3 12V5"
        stroke="url(#db_m0)"
        strokeWidth="2"
      />
      {/* Bottom ring */}
      <path
        d="M21 12V19C21 20.66 16.97 22 12 22C7.03 22 3 20.66 3 19V12"
        stroke="url(#db_m0)"
        strokeWidth="2"
      />
    </g>
  </svg>
)
