import React from 'react';

export const CornerBotanical: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ position }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'none';
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
    }
  };

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'top-left':
        return { top: 0, left: 0 };
      case 'top-right':
        return { top: 0, right: 0 };
      case 'bottom-left':
        return { bottom: 0, left: 0 };
      case 'bottom-right':
        return { bottom: 0, right: 0 };
    }
  };

  return (
    <svg
      viewBox="0 0 140 140"
      className="corner-botanical"
      style={{
        position: 'absolute',
        width: '90px',
        height: '90px',
        pointerEvents: 'none',
        transform: getTransform(),
        zIndex: 2,
        ...getPositionStyles(),
      }}
      aria-hidden="true"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Sage green vine branch */}
        <path
          d="M 10 10 Q 50 20 85 45 Q 110 70 125 115"
          stroke="#8A9A86"
          strokeWidth="2"
          opacity="0.8"
        />
        {/* Secondary branch */}
        <path
          d="M 45 22 Q 75 18 100 35"
          stroke="#A3B19B"
          strokeWidth="1.5"
          opacity="0.75"
        />

        {/* Delicate leaves */}
        <path
          d="M 35 18 C 30 10 42 6 48 14 C 42 22 38 20 35 18 Z"
          fill="#A3B19B"
          stroke="#7A8D76"
          strokeWidth="0.8"
          opacity="0.85"
        />
        <path
          d="M 65 32 C 60 22 75 20 78 28 C 72 36 68 34 65 32 Z"
          fill="#8A9A86"
          stroke="#687B64"
          strokeWidth="0.8"
          opacity="0.85"
        />
        <path
          d="M 95 55 C 92 45 106 44 108 52 C 102 60 98 58 95 55 Z"
          fill="#A3B19B"
          stroke="#7A8D76"
          strokeWidth="0.8"
          opacity="0.85"
        />

        {/* Dusty rose flower bud */}
        <circle cx="28" cy="28" r="8" fill="#F7D6D0" stroke="#C87D74" strokeWidth="1" />
        <circle cx="28" cy="28" r="4.5" fill="#E8A598" />
        <path
          d="M 28 20 Q 34 26 28 32 Q 22 26 28 20"
          stroke="#C87D74"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Small gold sparkle accent */}
        <circle cx="50" cy="48" r="2.2" fill="#D4AF37" opacity="0.9" />
        <path
          d="M 50 43 L 50 53 M 45 48 L 55 48"
          stroke="#D4AF37"
          strokeWidth="0.7"
          opacity="0.75"
        />

        {/* Smaller delicate blossom */}
        <circle cx="112" cy="85" r="5" fill="#FCEEE9" stroke="#E8A598" strokeWidth="0.8" />
        <circle cx="112" cy="85" r="2" fill="#D4AF37" />
      </g>
    </svg>
  );
};

export const GoldDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`gold-divider-container ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px auto', width: '100%', maxWidth: '260px' }}>
    <svg viewBox="0 0 240 24" style={{ width: '100%', height: '24px' }} aria-hidden="true">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="25%" stopColor="#E5C158" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
          <stop offset="75%" stopColor="#E5C158" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="15" y1="12" x2="100" y2="12" stroke="url(#goldGrad)" strokeWidth="1" />
      {/* Center floral motif */}
      <circle cx="120" cy="12" r="3.5" fill="#D4AF37" />
      <circle cx="112" cy="12" r="2" fill="#E5C158" opacity="0.8" />
      <circle cx="128" cy="12" r="2" fill="#E5C158" opacity="0.8" />
      <path
        d="M 120 7 C 122 9 122 15 120 17 C 118 15 118 9 120 7 Z"
        fill="#D4AF37"
        opacity="0.85"
      />
      <line x1="140" y1="12" x2="225" y2="12" stroke="url(#goldGrad)" strokeWidth="1" />
    </svg>
  </div>
);

export const FloatingFloralIcon: React.FC<{ style?: React.CSSProperties; delay?: number }> = ({
  style,
  delay = 0,
}) => (
  <div
    className="floating-flower-decor"
    style={{
      position: 'absolute',
      animation: `floatGentle 4s ease-in-out infinite alternate`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
      ...style,
    }}
  >
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="4" fill="#E8A598" />
      <ellipse cx="16" cy="7" rx="3.5" ry="5.5" fill="#F7D6D0" opacity="0.85" />
      <ellipse cx="16" cy="25" rx="3.5" ry="5.5" fill="#F7D6D0" opacity="0.85" />
      <ellipse cx="7" cy="16" rx="5.5" ry="3.5" fill="#F7D6D0" opacity="0.85" />
      <ellipse cx="25" cy="16" rx="5.5" ry="3.5" fill="#F7D6D0" opacity="0.85" />
      <circle cx="16" cy="16" r="2" fill="#D4AF37" />
    </svg>
  </div>
);
