// Small inline SVG icon set (no external icon library needed)

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function Icon({ name, size = 22 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', ...base };
  switch (name) {
    case 'passport':
      return (
        <svg {...p}>
          <rect x="5" y="2.5" width="14" height="19" rx="2" />
          <circle cx="12" cy="10" r="3.2" />
          <path d="M8.5 16.5h7" />
        </svg>
      );
    case 'certificate':
      return (
        <svg {...p}>
          <rect x="3.5" y="4" width="17" height="14" rx="2" />
          <path d="M7 8.5h6M7 11.5h4" />
          <circle cx="16.5" cy="13.5" r="2.2" />
          <path d="M15.5 15.5 14.8 19l1.7-1 1.7 1-.7-3.5" />
        </svg>
      );
    case 'building':
      return (
        <svg {...p}>
          <path d="M4 21h16M6 21V5.5L12 3v18M12 8l6 2v11" />
          <path d="M8.5 8h.01M8.5 11h.01M8.5 14h.01M8.5 17h.01M15 13h.01M15 16h.01" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.8 2.6 4 5.7 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.7-4-9s1.2-6.4 4-9z" />
        </svg>
      );
    case 'support':
      return (
        <svg {...p}>
          <path d="M4.5 13v-2a7.5 7.5 0 0 1 15 0v2" />
          <rect x="3" y="12.5" width="4" height="6" rx="1.6" />
          <rect x="17" y="12.5" width="4" height="6" rx="1.6" />
          <path d="M19 18.5v1a2 2 0 0 1-2 2h-4" />
        </svg>
      );
    case 'star':
      return (
        <svg {...p} fill="currentColor" strokeWidth="0">
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      );
    case 'people':
      return (
        <svg {...p}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 19.5c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8" />
          <path d="M15.5 5.2a3.2 3.2 0 1 1 1.6 6.1M17.5 14.9c2 .5 3.4 2 3.9 4.4" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...p}>
          <path d="M5 3.5h3.5l1.5 4.5-2.2 1.6a13 13 0 0 0 6.1 6.1l1.6-2.2 4.5 1.5V19a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 6.5 8.5 6 8.5-6" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...p}>
          <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.6" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...p}>
          <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
        </svg>
      );
    case 'chevron-left':
      return (
        <svg {...p}>
          <path d="M14.5 5.5 8 12l6.5 6.5" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg {...p}>
          <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...p} width={12} height={12}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...p}>
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case 'guidance':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5z" />
        </svg>
      );
        case 'clock':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...p} fill="currentColor" strokeWidth="0">
          <path d="M4.98 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2zM3.2 9.2h3.6V21H3.2zM9.3 9.2h3.4v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6V21h-3.6v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9.3z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...p} fill="currentColor" strokeWidth="0">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.3.5-.4.5c-.2.1-.3.3-.1.6.1.3.7 1.1 1.5 1.8 1 .9 1.8 1.2 2.1 1.3.3.1.4.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.4 0 .1 0 .7-.2 1.4z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="3.8" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" strokeWidth="0" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...p} fill="currentColor" strokeWidth="0">
          <path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.2c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.2H8v2.9h2.5v7z" />
        </svg>
      );
    case 'target':
    case 'mission':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'check':
      return (
        <svg {...p}>
          <path d="M20 6 9 17l-5-5" strokeWidth="2.2" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...p}>
          <path d="M4 5.5h16v11H8.5L4 20.5v-4H4z" />
          <path d="M8 9.5h8M8 13h5" />
        </svg>
      );
    case 'close':
      return (
        <svg {...p}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...p}>
          <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'eye-off':
      return (
        <svg {...p}>
          <path d="M3 3l18 18" />
          <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.2 0 10 7 10 7a17.7 17.7 0 0 1-3.4 4.3M6.3 6.5C3.9 8 2 12 2 12s3.8 7 10 7c1.4 0 2.7-.3 3.8-.8" />
          <path d="M9.5 9.8A3 3 0 0 0 12 15a3 3 0 0 0 2.2-.9" />
        </svg>
      );
    case 'search':
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...p}>
          <rect x="2.5" y="6" width="19" height="12.5" rx="3.5" />
          <path d="m10.2 9.5 4.6 2.7-4.6 2.7z" fill="currentColor" strokeWidth="0" />
        </svg>
      );
    default:
      return null;
  }
}
