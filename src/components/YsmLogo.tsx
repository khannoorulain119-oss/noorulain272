import React from 'react';

interface YsmLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const YsmLogo: React.FC<YsmLogoProps> = ({
  className = '',
  size = 'md',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13',
    lg: 'w-18 h-18',
  };

  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer select-none transition-transform duration-300 hover:scale-105 ${className}`}
      title="Younas & Sons Mini Mart - YSM"
    >
      {/* Outer Glow Halo */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/30 via-emerald-500/20 to-amber-600/30 blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* SVG Heraldic Mart Crest */}
      <svg
        viewBox="0 0 100 100"
        className={`${sizeClasses[size]} relative drop-shadow-xl`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Metallic Gradient */}
          <linearGradient id="ysmGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Deep Royal Emerald Gradient */}
          <linearGradient id="ysmEmeraldBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="50%" stopColor="#022C22" />
            <stop offset="100%" stopColor="#042F2E" />
          </linearGradient>

          {/* Shimmer Border Gradient */}
          <linearGradient id="ysmBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer Beveled Shield / Octagon */}
        <polygon
          points="50,4 88,18 96,62 50,96 4,62 12,18"
          fill="url(#ysmEmeraldBg)"
          stroke="url(#ysmBorderGrad)"
          strokeWidth="3.5"
          filter="url(#shadowGlow)"
        />

        {/* Inner Delicate Inset Border */}
        <polygon
          points="50,10 82,22 89,59 50,89 11,59 18,22"
          fill="none"
          stroke="url(#ysmGoldGrad)"
          strokeWidth="1.2"
          strokeDasharray="3 1.5"
          opacity="0.85"
        />

        {/* Crown & Shopping Mart Cart Motif at Top */}
        <path
          d="M38,20 L44,24 L50,18 L56,24 L62,20 L59,28 L41,28 Z"
          fill="url(#ysmGoldGrad)"
        />

        {/* Mini Mart Golden Cart Wheels Accent */}
        <circle cx="44" cy="29" r="1.5" fill="#FDE68A" />
        <circle cx="56" cy="29" r="1.5" fill="#FDE68A" />

        {/* Central Master Monogram YSM */}
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fontFamily="'Outfit', sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="1.5"
          fill="url(#ysmGoldGrad)"
          filter="url(#shadowGlow)"
        >
          YSM
        </text>

        {/* Subtle Horizontal Divider */}
        <line x1="30" y1="63" x2="70" y2="63" stroke="url(#ysmGoldGrad)" strokeWidth="1" opacity="0.6" />

        {/* Subtitle Ribbon: MINI MART */}
        <text
          x="50"
          y="72"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="7.5"
          letterSpacing="2.2"
          fill="#A7F3D0"
        >
          MINI MART
        </text>

        {/* Tiny Star at Bottom Crest */}
        <path
          d="M50,78 L51.5,82 L55,82 L52,84.5 L53,88 L50,86 L47,88 L48,84.5 L45,82 L48.5,82 Z"
          fill="url(#ysmGoldGrad)"
        />
      </svg>
    </div>
  );
};
