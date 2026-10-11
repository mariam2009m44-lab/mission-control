// Customizable rocket SVG icons - accept color props

// ELECTRON (Rocket Lab) - Small Lifter
export const SmallRocketIcon = ({ size = 40, className = '', primary = '#3a3a3a', secondary = '#ff3333' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
    <defs>
      <linearGradient id={`electronBody-${primary}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={primary} stopOpacity="0.7" />
        <stop offset="50%" stopColor={primary} />
        <stop offset="100%" stopColor={primary} stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="electronFlame" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fff5a0" />
        <stop offset="50%" stopColor="#ff8800" />
        <stop offset="100%" stopColor="#ff2200" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g transform="translate(18, 5) scale(0.8)">
      <path d="M 15 3 L 20 12 L 10 12 Z" fill={primary} stroke="#555" strokeWidth="0.5" />
      <rect x="10" y="12" width="10" height="35" fill={`url(#electronBody-${primary})`} stroke="#000" strokeWidth="0.5" />
      <rect x="10" y="22" width="10" height="2" fill={secondary} />
      <path d="M 10 47 L 8 52 L 22 52 L 20 47 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.5" />
      <path d="M 10 52 L 15 60 L 20 52 Z" fill="url(#electronFlame)">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="0.2s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
);

// FALCON 9 (SpaceX) - Medium Lifter
export const MediumRocketIcon = ({ size = 40, className = '', primary = '#f0f0f0', secondary = '#0a0a0a' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
    <defs>
      <linearGradient id={`falconBody-${primary}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={primary} stopOpacity="0.75" />
        <stop offset="50%" stopColor={primary} />
        <stop offset="100%" stopColor={primary} stopOpacity="0.65" />
      </linearGradient>
      <linearGradient id="falconFlame" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#ffdd00" />
        <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g transform="translate(18, 4) scale(0.75)">
      <path d="M 15 2 L 21 12 L 9 12 Z" fill={primary} stroke="#888" strokeWidth="0.5" />
      <rect x="9" y="12" width="12" height="8" fill={`url(#falconBody-${primary})`} stroke="#666" strokeWidth="0.5" />
      <rect x="9" y="20" width="12" height="4" fill={secondary} />
      <rect x="9" y="24" width="12" height="20" fill={`url(#falconBody-${primary})`} stroke="#666" strokeWidth="0.5" />
      <rect x="9" y="34" width="12" height="1.5" fill={secondary} />
      <rect x="7" y="13" width="2" height="3" fill="#2a2a2a" />
      <rect x="21" y="13" width="2" height="3" fill="#2a2a2a" />
      <line x1="9" y1="44" x2="5" y2="50" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="21" y1="44" x2="25" y2="50" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 9 44 L 8 48 L 22 48 L 21 44 Z" fill="#2a2a2a" stroke="#000" strokeWidth="0.5" />
      <path d="M 10 48 L 15 59 L 20 48 Z" fill="url(#falconFlame)">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="0.15s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
);

// SLS (NASA) - Heavy Lifter
export const HeavyRocketIcon = ({ size = 40, className = '', primary = '#e89a50', secondary = '#f0f0f0' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
    <defs>
      <linearGradient id={`slsCore-${primary}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={primary} stopOpacity="0.75" />
        <stop offset="50%" stopColor={primary} />
        <stop offset="100%" stopColor={primary} stopOpacity="0.65" />
      </linearGradient>
      <linearGradient id={`slsBooster-${secondary}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={secondary} stopOpacity="0.85" />
        <stop offset="50%" stopColor={secondary} />
        <stop offset="100%" stopColor={secondary} stopOpacity="0.75" />
      </linearGradient>
      <linearGradient id="slsFlame" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#ffaa00" />
        <stop offset="100%" stopColor="#ff2200" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g transform="translate(14, 4) scale(0.75)">
      <rect x="3" y="10" width="6" height="38" rx="0.5" fill={`url(#slsBooster-${secondary})`} stroke="#666" strokeWidth="0.5" />
      <path d="M 3 10 L 6 5 L 9 10 Z" fill={secondary} stroke="#888" strokeWidth="0.5" />
      <rect x="21" y="10" width="6" height="38" rx="0.5" fill={`url(#slsBooster-${secondary})`} stroke="#666" strokeWidth="0.5" />
      <path d="M 21 10 L 24 5 L 27 10 Z" fill={secondary} stroke="#888" strokeWidth="0.5" />
      <rect x="10" y="8" width="10" height="42" fill={`url(#slsCore-${primary})`} stroke="#5a2808" strokeWidth="0.5" />
      <path d="M 10 8 L 15 2 L 20 8 Z" fill={secondary} stroke="#888" strokeWidth="0.5" />
      <rect x="10" y="20" width="10" height="1.5" fill="#0033a0" />
      <rect x="10" y="30" width="10" height="1.5" fill="#cc0000" />
      <path d="M 4 48 L 3 51 L 9 51 L 8 48 Z" fill="#2a2a2a" />
      <path d="M 10 50 L 9 53 L 21 53 L 20 50 Z" fill="#2a2a2a" />
      <path d="M 22 48 L 21 51 L 27 51 L 26 48 Z" fill="#2a2a2a" />
      <path d="M 5 51 L 6.5 58 L 8 51 Z" fill="url(#slsFlame)">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="0.18s" repeatCount="indefinite" />
      </path>
      <path d="M 11 53 L 15 60 L 19 53 Z" fill="url(#slsFlame)">
        <animate attributeName="opacity" values="1;0.85;1" dur="0.15s" repeatCount="indefinite" />
      </path>
      <path d="M 22 51 L 23.5 58 L 25 51 Z" fill="url(#slsFlame)">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="0.18s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
);

export const RocketIcons = {
  small: SmallRocketIcon,
  medium: MediumRocketIcon,
  heavy: HeavyRocketIcon,
};
