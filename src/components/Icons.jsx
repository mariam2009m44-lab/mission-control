export const MoonIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="moonG" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#f8f4e8" />
        <stop offset="60%" stopColor="#d8cfb8" />
        <stop offset="100%" stopColor="#8a7d65" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="26" fill="url(#moonG)" />
    <circle cx="24" cy="24" r="5" fill="#b8a98a" opacity="0.6" />
    <circle cx="40" cy="30" r="3" fill="#a89878" opacity="0.7" />
    <circle cx="28" cy="42" r="4" fill="#c8b898" opacity="0.5" />
    <circle cx="42" cy="44" r="2.5" fill="#9a8a6a" opacity="0.6" />
    <circle cx="32" cy="32" r="26" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

export const MarsIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="marsG" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#ff8a5c" />
        <stop offset="60%" stopColor="#d4562f" />
        <stop offset="100%" stopColor="#7a2510" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="26" fill="url(#marsG)" />
    <ellipse cx="32" cy="20" rx="18" ry="3" fill="#ffffff" opacity="0.15" />
    <ellipse cx="32" cy="46" rx="16" ry="2.5" fill="#ffffff" opacity="0.1" />
    <circle cx="22" cy="36" r="4" fill="#a03010" opacity="0.5" />
    <circle cx="42" cy="28" r="3" fill="#902010" opacity="0.4" />
    <circle cx="36" cy="42" r="2.5" fill="#a83818" opacity="0.5" />
  </svg>
);

export const EarthIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="earthG" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#7ec8ff" />
        <stop offset="60%" stopColor="#2d7fc4" />
        <stop offset="100%" stopColor="#0a2d52" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="26" fill="url(#earthG)" />
    <path d="M18 24 Q24 22 28 26 T36 28 Q40 26 44 30 L42 36 Q38 38 34 34 T24 34 Z" fill="#3a9b5c" opacity="0.8" />
    <path d="M26 44 Q32 42 38 46 T46 48 L44 52 Q36 50 30 50 Z" fill="#3a9b5c" opacity="0.7" />
    <ellipse cx="32" cy="10" rx="20" ry="3" fill="#ffffff" opacity="0.15" />
    <ellipse cx="32" cy="54" rx="20" ry="3" fill="#ffffff" opacity="0.15" />
  </svg>
);

export const RocketIcon = ({ size = 48, color = '#00d4ff' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="rocketG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e8e8e8" />
        <stop offset="100%" stopColor="#a0a0a0" />
      </linearGradient>
      <linearGradient id="flameG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffdd00" />
        <stop offset="50%" stopColor="#ff6600" />
        <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M32 6 C40 18 44 30 42 42 L22 42 C20 30 24 18 32 6 Z" fill="url(#rocketG)" stroke="#666" strokeWidth="1" />
    <circle cx="32" cy="26" r="6" fill="#00d4ff" stroke="#0088aa" strokeWidth="1.5" />
    <circle cx="32" cy="26" r="3" fill="#0a0e1a" />
    <path d="M22 42 L16 50 L24 48 Z" fill="#cc3333" stroke="#882222" strokeWidth="1" />
    <path d="M42 42 L48 50 L40 48 Z" fill="#cc3333" stroke="#882222" strokeWidth="1" />
    <path d="M28 42 L32 58 L36 42 Z" fill="url(#flameG)" />
  </svg>
);

export const SatelliteIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect x="26" y="24" width="12" height="16" rx="2" fill="#d0d0d0" stroke="#666" strokeWidth="1" />
    <rect x="6" y="28" width="16" height="8" rx="1" fill="#1a5fb4" stroke="#0a3a70" strokeWidth="1" />
    <rect x="42" y="28" width="16" height="8" rx="1" fill="#1a5fb4" stroke="#0a3a70" strokeWidth="1" />
    <line x1="22" y1="32" x2="26" y2="32" stroke="#666" strokeWidth="1.5" />
    <line x1="38" y1="32" x2="42" y2="32" stroke="#666" strokeWidth="1.5" />
    <circle cx="32" cy="20" r="3" fill="#ff6b35" stroke="#a03010" strokeWidth="1" />
    <path d="M28 40 L32 56 L36 40 Z" fill="url(#flameG)" opacity="0.7" />
  </svg>
);

export const SmallRocketIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M32 14 C38 22 40 32 38 42 L26 42 C24 32 26 22 32 14 Z" fill="#d0d0d0" stroke="#666" strokeWidth="1" />
    <circle cx="32" cy="28" r="4" fill="#00d4ff" />
    <path d="M26 42 L22 50 L28 48 Z" fill="#cc3333" />
    <path d="M38 42 L42 50 L36 48 Z" fill="#cc3333" />
    <path d="M29 42 L32 52 L35 42 Z" fill="#ff8800" opacity="0.8" />
  </svg>
);

export const HeavyRocketIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M32 4 C42 16 46 30 44 44 L20 44 C18 30 22 16 32 4 Z" fill="#e0e0e0" stroke="#666" strokeWidth="1" />
    <rect x="20" y="20" width="24" height="3" fill="#cc3333" />
    <rect x="20" y="34" width="24" height="3" fill="#cc3333" />
    <circle cx="32" cy="28" r="5" fill="#00d4ff" stroke="#0088aa" strokeWidth="1" />
    <path d="M20 44 L14 54 L22 52 Z" fill="#aa2222" />
    <path d="M44 44 L50 54 L42 52 Z" fill="#aa2222" />
    <path d="M26 44 L32 60 L38 44 Z" fill="#ff8800" />
  </svg>
);

export const SolarPanelIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="6" y="12" width="36" height="24" rx="2" fill="#1a5fb4" stroke="#0a3a70" strokeWidth="1.5" />
    <line x1="6" y1="20" x2="42" y2="20" stroke="#0a3a70" strokeWidth="1" />
    <line x1="6" y1="28" x2="42" y2="28" stroke="#0a3a70" strokeWidth="1" />
    <line x1="18" y1="12" x2="18" y2="36" stroke="#0a3a70" strokeWidth="1" />
    <line x1="30" y1="12" x2="30" y2="36" stroke="#0a3a70" strokeWidth="1" />
    <circle cx="24" cy="6" r="4" fill="#ffdd00" opacity="0.8" />
  </svg>
);

export const RTGIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="10" fill="#c0c0c0" stroke="#666" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="5" fill="#ffcc00" />
    <circle cx="24" cy="24" r="2" fill="#ff6600" />
    <path d="M14 24 Q8 18 6 24 Q8 30 14 24" fill="#ffcc00" opacity="0.5" />
    <path d="M34 24 Q40 18 42 24 Q40 30 34 24" fill="#ffcc00" opacity="0.5" />
    <path d="M24 14 Q18 8 24 6 Q30 8 24 14" fill="#ffcc00" opacity="0.5" />
    <path d="M24 34 Q18 40 24 42 Q30 40 24 34" fill="#ffcc00" opacity="0.5" />
  </svg>
);

export const CameraIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="6" y="14" width="36" height="24" rx="3" fill="#333" stroke="#666" strokeWidth="1.5" />
    <circle cx="24" cy="26" r="9" fill="#111" stroke="#00d4ff" strokeWidth="2" />
    <circle cx="24" cy="26" r="5" fill="#00d4ff" opacity="0.6" />
    <circle cx="24" cy="26" r="2" fill="#ffffff" />
    <rect x="30" y="10" width="8" height="6" rx="1" fill="#555" />
  </svg>
);

export const SpectrometerIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="10" y="20" width="28" height="16" rx="2" fill="#4a4a5a" stroke="#888" strokeWidth="1.5" />
    <rect x="14" y="24" width="20" height="8" fill="#0a0e1a" />
    <line x1="16" y1="26" x2="16" y2="30" stroke="#ff0000" strokeWidth="1" />
    <line x1="19" y1="26" x2="19" y2="30" stroke="#ff8800" strokeWidth="1" />
    <line x1="22" y1="26" x2="22" y2="30" stroke="#ffff00" strokeWidth="1" />
    <line x1="25" y1="26" x2="25" y2="30" stroke="#00ff00" strokeWidth="1" />
    <line x1="28" y1="26" x2="28" y2="30" stroke="#00ddff" strokeWidth="1" />
    <line x1="31" y1="26" x2="31" y2="30" stroke="#0066ff" strokeWidth="1" />
    <circle cx="24" cy="12" r="4" fill="#00d4ff" opacity="0.7" />
    <line x1="24" y1="16" x2="24" y2="20" stroke="#00d4ff" strokeWidth="1.5" />
  </svg>
);

export const DrillIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="14" y="6" width="20" height="14" rx="2" fill="#888" stroke="#555" strokeWidth="1.5" />
    <rect x="16" y="8" width="16" height="4" fill="#333" />
    <rect x="22" y="20" width="4" height="18" fill="#c0c0c0" stroke="#666" strokeWidth="1" />
    <path d="M22 38 L24 46 L26 38 Z" fill="#c0c0c0" stroke="#666" strokeWidth="1" />
    <circle cx="24" cy="13" r="2" fill="#ff3333" />
  </svg>
);

export const RadiometerIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="14" fill="#222" stroke="#666" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="8" fill="#0a0e1a" stroke="#444" strokeWidth="1" />
    <line x1="24" y1="24" x2="32" y2="18" stroke="#ff3333" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="24" r="2" fill="#00d4ff" />
    <line x1="24" y1="10" x2="24" y2="14" stroke="#666" strokeWidth="1" />
    <line x1="24" y1="34" x2="24" y2="38" stroke="#666" strokeWidth="1" />
    <line x1="10" y1="24" x2="14" y2="24" stroke="#666" strokeWidth="1" />
    <line x1="34" y1="24" x2="38" y2="24" stroke="#666" strokeWidth="1" />
  </svg>
);

export const HighAntennaIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <ellipse cx="24" cy="20" rx="12" ry="16" fill="#ddd" stroke="#666" strokeWidth="1.5" />
    <ellipse cx="24" cy="20" rx="8" ry="12" fill="#aaa" />
    <circle cx="24" cy="20" r="3" fill="#333" />
    <line x1="24" y1="36" x2="24" y2="44" stroke="#666" strokeWidth="1.5" />
    <line x1="16" y1="44" x2="32" y2="44" stroke="#666" strokeWidth="1.5" />
    <circle cx="24" cy="20" r="1.5" fill="#00d4ff" />
  </svg>
);

export const MediumAntennaIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <ellipse cx="24" cy="22" rx="8" ry="12" fill="#ddd" stroke="#666" strokeWidth="1.5" />
    <ellipse cx="24" cy="22" rx="5" ry="8" fill="#aaa" />
    <circle cx="24" cy="22" r="2" fill="#333" />
    <line x1="24" y1="34" x2="24" y2="42" stroke="#666" strokeWidth="1.5" />
    <line x1="18" y1="42" x2="30" y2="42" stroke="#666" strokeWidth="1.5" />
  </svg>
);

export const PropulsionIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="18" y="8" width="12" height="22" rx="3" fill="#888" stroke="#555" strokeWidth="1.5" />
    <rect x="18" y="12" width="12" height="3" fill="#cc3333" />
    <rect x="18" y="24" width="12" height="3" fill="#cc3333" />
    <path d="M20 30 L18 40 L24 36 L30 40 L28 30 Z" fill="#ff8800" opacity="0.9" />
    <path d="M22 32 L21 38 L24 36 L27 38 L26 32 Z" fill="#ffdd00" />
    <circle cx="24" cy="20" r="2" fill="#00d4ff" />
  </svg>
);

export const ShieldIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 6 L40 14 L40 26 Q40 38 24 44 Q8 38 8 26 L8 14 Z" fill="#4a4a5a" stroke="#888" strokeWidth="1.5" />
    <path d="M24 10 L36 16 L36 26 Q36 35 24 40 Q12 35 12 26 L12 16 Z" fill="#2a2a3a" />
    <path d="M16 20 L32 20 M16 26 L32 26 M16 32 L32 32" stroke="#555" strokeWidth="1.5" />
    <circle cx="24" cy="22" r="3" fill="#00d4ff" opacity="0.7" />
  </svg>
);

export const componentIcons = {
  solar_panel: SolarPanelIcon,
  rtg: RTGIcon,
  camera: CameraIcon,
  spectrometer: SpectrometerIcon,
  drill: DrillIcon,
  radiometer: RadiometerIcon,
  high_gain_antenna: HighAntennaIcon,
  medium_gain_antenna: MediumAntennaIcon,
  propulsion: PropulsionIcon,
  heat_shield: ShieldIcon,
};

export const objectiveIcons = {
  lunar: MoonIcon,
  mars: MarsIcon,
  earth: EarthIcon,
};

export const rocketIcons = {
  small: SmallRocketIcon,
  medium: RocketIcon,
  heavy: HeavyRocketIcon,
};
