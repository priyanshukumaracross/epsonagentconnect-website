const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const VideoIcon = (p) => (<svg {...base} {...p}><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>);
export const VideoOffIcon = (p) => (<svg {...base} {...p}><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" /><path d="M1 1l22 22" /></svg>);
export const PhoneIcon = (p) => (<svg {...base} {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
export const MicIcon = (p) => (<svg {...base} {...p}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" /></svg>);
export const MicOffIcon = (p) => (<svg {...base} {...p}><path d="M1 1l22 22M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8" /></svg>);
export const FlipIcon = (p) => (<svg {...base} {...p}><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /></svg>);
export const LockIcon = (p) => (<svg {...base} strokeWidth="2.4" {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
export const PinIcon = (p) => (<svg {...base} {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
export const ClockIcon = (p) => (<svg {...base} strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>);
export const ShieldIcon = (p) => (<svg {...base} strokeWidth="1.8" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
export const ArrowIcon = (p) => (<svg {...base} strokeWidth="2.4" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const CheckIcon = (p) => (<svg {...base} strokeWidth="2.6" {...p}><path d="M20 6L9 17l-5-5" /></svg>);
export const AlertIcon = (p) => (<svg {...base} strokeWidth="2.2" {...p}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>);
export const DocIcon = (p) => (<svg {...base} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></svg>);
export const BagIcon = (p) => (<svg {...base} {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>);
export const UserIcon = (p) => (<svg {...base} strokeWidth="1.8" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
export const HangupIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.996.996 0 0 1 0-1.41C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
  </svg>
);

export const PrinterArt = (p) => (
  <svg viewBox="0 0 92 72" fill="none" {...p}>
    <rect x="18" y="4" width="56" height="16" rx="2" fill="#f1f4fa" stroke="#c9d2e3" />
    <rect x="6" y="18" width="80" height="34" rx="6" fill="#1b2438" />
    <rect x="6" y="18" width="80" height="10" rx="5" fill="#2a3550" />
    <rect x="62" y="34" width="16" height="6" rx="2" fill="#003399" />
    <circle cx="16" cy="38" r="2.5" fill="#12a150" />
    <rect x="10" y="44" width="4" height="10" rx="1" fill="#00b4e6" /><rect x="15" y="44" width="4" height="10" rx="1" fill="#e6007e" />
    <rect x="20" y="44" width="4" height="10" rx="1" fill="#ffd400" /><rect x="25" y="44" width="4" height="10" rx="1" fill="#111" />
    <rect x="22" y="50" width="48" height="16" rx="1" fill="#fff" stroke="#c9d2e3" />
    <rect x="28" y="55" width="30" height="2" rx="1" fill="#c9d2e3" /><rect x="28" y="59" width="22" height="2" rx="1" fill="#c9d2e3" />
  </svg>
);
