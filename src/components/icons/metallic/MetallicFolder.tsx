import React from 'react'

export const MetallicFolder: React.FC<{ className?: string }> = ({ className = 'w-[18px] h-[18px]' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g fill="none">
      <defs>
        <linearGradient id="folder_m0" x1="12" y1="2" x2="12" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6E6E72" />
          <stop offset="1" stopColor="#1C1C1E" />
        </linearGradient>
        <linearGradient id="folder_m1" x1="23" y1="15.5" x2="1" y2="15.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F5F7" stopOpacity="0.8" />
          <stop offset="1" stopColor="#A8A8B0" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="folder_m2" x1="12" y1="9" x2="12" y2="16.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M16.2 5H13L11.9 3.4C11.6 2.9 11.4 2.6 11.2 2.5C11 2.3 10.8 2.2 10.5 2.1C10.2 2 9.9 2 9.3 2H7.8C6.1 2 5.3 2 4.6 2.3C4.1 2.6 3.6 3.1 3.3 3.6C3 4.3 3 5.1 3 6.8V11.2C3 12.9 3 13.7 3.3 14.4C3.6 14.9 4.1 15.4 4.6 15.7C5.3 16 6.1 16 7.8 16H16.2C17.9 16 18.7 16 19.4 15.7C19.9 15.4 20.4 14.9 20.7 14.4C21 13.7 21 12.9 21 11.2V9.8C21 8.1 21 7.3 20.7 6.6C20.4 6.1 19.9 5.6 19.4 5.3C18.7 5 17.9 5 16.2 5Z"
        fill="url(#folder_m0)"
      />
      <path
        d="M17.4 9H6.6C4.7 9 3.7 9 3 9.4C2.4 9.7 1.9 10.3 1.7 10.9C1.4 11.7 1.6 12.6 1.9 14.5L2.4 17.9C2.6 19.4 2.7 20.1 3.1 20.6C3.4 21.1 3.8 21.5 4.3 21.7C4.9 22 5.7 22 7.1 22H16.9C18.3 22 19.1 22 19.7 21.7C20.2 21.5 20.6 21.1 20.9 20.6C21.3 20.1 21.4 19.4 21.6 17.9L22.1 14.5C22.4 12.6 22.6 11.7 22.3 10.9C22.1 10.3 21.6 9.7 21 9.4C20.3 9 19.3 9 17.4 9Z"
        fill="url(#folder_m1)"
      />
      <path
        d="M17.4 9.5H6.6C5.6 9.5 5 9.5 4.4 9.5C3.9 9.6 3.6 9.7 3.4 9.8C3 10 2.6 10.4 2.4 10.8C2.3 11.1 2.3 11.4 2.3 11.9C2.4 12.4 2.5 13.1 2.6 14.1L3.1 17.5C3.2 18.2 3.3 18.7 3.4 19.1C3.5 19.5 3.6 19.7 3.7 19.9C3.9 20.3 4.2 20.6 4.6 20.8C4.8 20.9 5.1 21 5.5 21C5.9 21.1 6.4 21.1 7.1 21.1H16.9C17.6 21.1 18.1 21.1 18.5 21C18.9 21 19.2 20.9 19.4 20.8C19.8 20.6 20.1 20.3 20.3 19.9C20.4 19.7 20.5 19.5 20.6 19.1C20.7 18.7 20.8 18.2 20.9 17.5L21.4 14.1C21.5 13.1 21.6 12.4 21.7 11.9C21.7 11.4 21.7 11.1 21.6 10.8C21.4 10.4 21 10 20.6 9.8C20.4 9.7 20.1 9.6 19.6 9.5C19 9.5 18.4 9.5 17.4 9.5Z"
        fill="url(#folder_m2)"
      />
    </g>
  </svg>
)
