import React from 'react'

export const MetallicGoose: React.FC<{ className?: string }> = ({ className = 'w-[20px] h-[20px]' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className={className}>
    <defs>
      <linearGradient id="duck_SVGID_1_" x1="22.15" x2="86.65" y1="93.7" y2="18.2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#252525" offset=".1" />
        <stop stopColor="#AFAEAE" offset=".7" />
        <stop stopColor="#F0F0F0" offset="1" />
      </linearGradient>
      <linearGradient id="duck_SVGID_2_" x1="61.49" x2="79.6" y1="49.4" y2="49.4" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6D6D6D" offset="0" />
        <stop stopColor="#BEBEBE" offset="1" />
      </linearGradient>
      <linearGradient id="duck_SVGID_3_" x1="26.35" x2="70.71" y1="78.78" y2="78.78" gradientUnits="userSpaceOnUse">
        <stop stopColor="#333333" offset="0" />
        <stop stopColor="#E6E6E6" offset="1" />
      </linearGradient>
    </defs>
    <path
      fill="url(#duck_SVGID_1_)"
      d="m74.4 45.8c-0.5 7.8 11.8 13.6 16.6 22.3 3 5.3 3.6 10.4 2.2 16.1-1.9 8.2-11.3 21.5-34.2 22.3-11.9 0.2-24.5-3.3-32.5-10.2-8.7-7.5-13.5-19-13.4-31.3 0.1-4 0.3-6.9 2.3-7.6 2.1-0.6 2.8 1.1 6.6 2.6 9.5 3.9 17.8 3 24.9 1.6l10.4-2.3c-5-10.2-8.2-18.4-7.3-26.7 1-9.6 8.8-18.9 20.2-19.2 9.7-0.3 19.7 7 19.8 16.5l-2.3 3.8-3.9 9.1c-2.7 1.8-6 2.9-9.4 3z"
    />
    <path
      fill="url(#duck_SVGID_2_)"
      d="m61.5 41.2c1.4 5.2 5.9 11.3 14.4 14.4l3.7-0.5c-3-3.4-5.2-6.8-5.2-9.4-4.2 0.2-9-0.9-12.9-4.5z"
    />
    <path
      fill="url(#duck_SVGID_3_)"
      d="m57.9 64c-3.2 0.2-8.7 1.4-11.6 2.1-6.5 1.4-11.1 1.7-16.2 0.7-3.9-0.6-4.3 1.5-3.5 5.4 1.8 8.8 9 22 24 22.1 9.9 0 16.8-5.9 19.3-13.7l0.8-5.1c0.7-5.6-4.2-11.6-12.8-11.5z"
    />
    {/* Bill / beak highlight */}
    <ellipse cx="94" cy="36" rx="9" ry="4" fill="#F6AD55" />
    <circle cx="82" cy="28" r="2.5" fill="#FFFFFF" />
    <circle cx="82.5" cy="28" r="1.5" fill="#1A202C" />
  </svg>
)
