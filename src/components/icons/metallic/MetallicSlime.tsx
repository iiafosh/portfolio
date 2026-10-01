import React from 'react'

export const MetallicSlime: React.FC<{ className?: string }> = ({ className = 'w-[20px] h-[20px]' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className={className}>
    <defs>
      {/* Outer Metallic Chrome / Cyan Sheen */}
      <linearGradient id="slime_metal_1" x1="20" y1="20" x2="100" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#67e8f9" offset="0%" />
        <stop stopColor="#06b6d4" offset="30%" />
        <stop stopColor="#2563eb" offset="70%" />
        <stop stopColor="#1e3a8a" offset="100%" />
      </linearGradient>

      {/* Gloss Highlight Arc */}
      <linearGradient id="slime_highlight" x1="35" y1="25" x2="55" y2="65" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.85" offset="0%" />
        <stop stopColor="#ffffff" stopOpacity="0.1" offset="80%" />
        <stop stopColor="#ffffff" stopOpacity="0" offset="100%" />
      </linearGradient>

      {/* Eye Gradient */}
      <linearGradient id="slime_eye_grad" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#0f172a" offset="0%" />
        <stop stopColor="#020617" offset="100%" />
      </linearGradient>

      {/* Ambient Blue Slime Glow */}
      <filter id="slime_glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Slime Main Body */}
    <path
      d="M 60 16 C 65 24 95 48 96 74 C 97 97 83 108 60 108 C 37 108 23 97 24 74 C 25 48 55 24 60 16 Z"
      fill="url(#slime_metal_1)"
      filter="url(#slime_glow)"
    />

    {/* Inner Rim Light / Shimmer */}
    <path
      d="M 60 21 C 64 28 90 50 91 73 C 92 92 79 103 60 103 C 41 103 28 92 29 73 C 30 50 56 28 60 21 Z"
      fill="none"
      stroke="#a5f3fc"
      strokeWidth="1.5"
      opacity="0.5"
    />

    {/* Top Left Specular Highlight */}
    <path
      d="M 52 26 C 42 35 34 50 34 66 C 34 71 35 75 36 78 C 35 72 35 60 41 46 C 45 36 50 30 52 26 Z"
      fill="url(#slime_highlight)"
    />

    {/* Cute Cheeks Blush */}
    <ellipse cx="40" cy="80" rx="5" ry="2.5" fill="#f43f5e" opacity="0.35" />
    <ellipse cx="80" cy="80" rx="5" ry="2.5" fill="#f43f5e" opacity="0.35" />

    {/* Left Eye */}
    <ellipse cx="48" cy="68" rx="4.5" ry="6.5" fill="url(#slime_eye_grad)" />
    <circle cx="46.5" cy="65.5" r="2" fill="#ffffff" />
    <circle cx="49.5" cy="70.5" r="0.9" fill="#ffffff" opacity="0.75" />

    {/* Right Eye */}
    <ellipse cx="72" cy="68" rx="4.5" ry="6.5" fill="url(#slime_eye_grad)" />
    <circle cx="70.5" cy="65.5" r="2" fill="#ffffff" />
    <circle cx="73.5" cy="70.5" r="0.9" fill="#ffffff" opacity="0.75" />

    {/* Cute Happy Smile */}
    <path
      d="M 56 76 Q 60 80 64 76"
      fill="none"
      stroke="#0f172a"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)
