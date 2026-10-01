import React from 'react'

export const MetallicHouse: React.FC<{ className?: string }> = ({ className = 'w-[18px] h-[18px]' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <g fill="none">
      <defs>
        <linearGradient id="house_m0" x1="12" y1="11.5" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#686868" />
          <stop offset="1" stopColor="#181818" />
        </linearGradient>
        <linearGradient id="house_m1" x1="12" y1="1.383" x2="12" y2="21.998" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F5F7" stopOpacity="0.8" />
          <stop offset="1" stopColor="#A8A8B0" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="house_m2" x1="12" y1="1.383" x2="12" y2="13.322" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M6.5 17V21.5L8 22H16L17.5 21.5V17C17.5 15.6 17.5 14.9 17.3 14.3C16.9 13.1 15.9 12.1 14.7 11.7C14.1 11.5 13.4 11.5 12 11.5C10.6 11.5 9.9 11.5 9.3 11.7C8.1 12.1 7.1 13.1 6.7 14.3C6.5 14.9 6.5 15.6 6.5 17Z"
        fill="url(#house_m0)"
      />
      <path
        d="M11 1.5C11.7 1.3 12.3 1.3 13 1.5C13.7 1.7 14.3 2.1 15.7 3.1L19.3 5.6C20.3 6.3 20.8 6.6 21.1 7.1C21.4 7.5 21.7 8 21.8 8.4C22 9 22 9.6 22 10.8V15.6C22 17.8 22 19 21.6 19.8C21.2 20.6 20.6 21.2 19.8 21.6C19 22 18 22 16 22V17C16 15.6 16 14.9 15.7 14.4C15.5 13.9 15.1 13.5 14.6 13.3C14.1 13 13.4 13 12 13C10.6 13 9.9 13 9.4 13.3C8.9 13.5 8.5 13.9 8.3 14.4C8 14.9 8 15.6 8 17V22C6 22 5 22 4.2 21.6C3.4 21.2 2.8 20.6 2.4 19.8C2 19 2 17.8 2 15.6V10.8C2 9.6 2 9 2.2 8.4C2.3 8 2.6 7.5 2.9 7.1C3.2 6.6 3.7 6.3 4.7 5.6L8.3 3.1C9.7 2.1 10.3 1.7 11 1.5Z"
        fill="url(#house_m1)"
      />
      <path
        d="M12 2C12.3 2.1 12.6 2.1 12.8 2.2L16.4 4.7C17.4 5.4 17.8 5.7 18 6C18.2 6.3 18.3 6.6 18.4 7C18.5 7.4 18.5 7.9 18.5 8.8V15H17.5V8.8C17.5 8 17.5 7.6 17.4 7.3C17.3 7.1 17.2 6.9 17.1 6.8C16.9 6.6 16.7 6.4 15.9 5.8L12.3 3.3C12.1 3.2 11.9 3.2 11.7 3.3L8.1 5.8C7.3 6.4 7.1 6.6 6.9 6.8C6.8 6.9 6.7 7.1 6.6 7.3C6.5 7.6 6.5 8 6.5 8.8V15H5.5V8.8C5.5 7.9 5.5 7.4 5.6 7C5.7 6.6 5.8 6.3 6 6C6.2 5.7 6.6 5.4 7.6 4.7L11.2 2.2C11.4 2.1 11.7 2.1 12 2Z"
        fill="url(#house_m2)"
      />
    </g>
  </svg>
)
