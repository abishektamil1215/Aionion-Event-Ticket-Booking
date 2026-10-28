/* Thin-line financial icon set (24px grid, 1.4 stroke) */
const P = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowL: <path d="M19 12H5M11 6l-6 6 6 6" />,
  arrowUR: <path d="M7 17L17 7M8 7h9v9" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></>,
  ticket: <><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" /><path d="M14 6v12" strokeDasharray="2 2" /></>,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" /></>,
  home: <><path d="M4 10.5L12 4l8 6.5" /><path d="M6 9.5V20h12V9.5" /><path d="M10 20v-5h4v5" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  menu: <path d="M4 8h16M4 16h10" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  pin: <><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  share: <><circle cx="18" cy="6" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" /></>,
  directions: <><path d="M12 3l9 9-9 9-9-9z" /><path d="M9.5 13.5V11h5M12.5 8.5L15 11l-2.5 2.5" /></>,
  shield: <><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6z" /><path d="M9 12l2 2 4-4" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  bolt: <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />,
  qr: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chart: <><path d="M4 19h16" /><path d="M5 15l4-4 3 3 6-7" /><path d="M15 7h3v3" /></>,
  candles: <><path d="M7 4v16M12 7v13M17 3v14" /><rect x="5.5" y="8" width="3" height="7" rx=".6" /><rect x="10.5" y="10" width="3" height="5" rx=".6" /><rect x="15.5" y="6" width="3" height="6" rx=".6" /></>,
  pie: <><path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5H12z" /><path d="M15 3.8A8.5 8.5 0 0 1 20.2 9H15z" /></>,
  diamond: <><path d="M6 4h12l3 5-9 11L3 9z" /><path d="M3 9h18M9 4l3 16 3-16" /></>,
  book: <><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z" /><path d="M12 6v13.5" /></>,
  cap: <><path d="M2.5 9.5L12 5l9.5 4.5L12 14z" /><path d="M6.5 11.5V16c3 2.2 8 2.2 11 0v-4.5" /></>,
  chat: <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z" /><path d="M8.5 9h7M8.5 12h4" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2" /></>,
  broadcast: <><circle cx="12" cy="12" r="2" /><path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7M5.6 18.4a9 9 0 0 1 0-12.8M18.4 5.6a9 9 0 0 1 0 12.8" /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2.5" /><path d="M16 10.5l5-3v9l-5-3" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  building: <><path d="M4 20V6l8-3v17M12 20V9l8 3v8M2.5 20h19" /><path d="M7 9h2M7 12h2M7 15h2M15 14h2M15 17h2" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" /></>,
  review: <><rect x="4" y="3.5" width="16" height="17" rx="2.5" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  support: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.5" /><path d="M6 6l3.5 3.5M18 6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5" /></>,
  users: <><circle cx="9" cy="9" r="3" /><path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" /><circle cx="17" cy="8" r="2.5" /><path d="M16 13.5c2.3 0 4 1.2 4.5 3.5" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>,
  sparkle: <><circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="12" cy="17" r="3" /><path d="m9.5 7h5M8.5 9.5l2 5m5-5-2 5" /></>,
  card: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M3 10h18M7 15h4" /></>,
  upi: <><path d="M7 4l5 8-5 8" /><path d="M12 4l5 8-5 8" /></>,
  bank: <><path d="M3 9.5L12 4l9 5.5H3z" /><path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 20h18" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  crosshair: <><circle cx="12" cy="12" r="7" /><path d="M12 2v5M12 17v5M2 12h5M17 12h5" /><circle cx="12" cy="12" r="1" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z" /></>,
  linkedin: <><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V16M8 7.8v.2M11.5 16v-3.2a2.3 2.3 0 0 1 4.5 0V16M11.5 10.5V16" /></>,
  x: <path d="M4 4l16 16M20 4L4 20" />,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.5l5 2.5-5 2.5z" /></>,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17 7v.01" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  mute: <><path d="M5 9h3l4-4v14l-4-4H5z" /><path d="M16 9.5c1.3 1.4 1.3 3.6 0 5" /></>,
  end: <path d="M3 13c5-4.5 13-4.5 18 0l-2.5 2.5-3-1.5v-2.5c-2.3-.7-4.7-.7-7 0V14l-3 1.5z" />,
  wallet: <><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" /><rect x="3.5" y="8" width="17" height="11.5" rx="2.5" /><path d="M16 13.8h1.5" /></>,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M4 7l8 6 8-6" /></>,
  login: <><path d="M14 4h3.5A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14" /><path d="M4 12h11M11 8l4 4-4 4" /></>,
  logout: <><path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10" /><path d="M9 12h11M16 8l4 4-4 4" /></>,
  scan: <><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" /><path d="M4 12h16" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M4.2 6.5l2.6 1.5M17.2 16l2.6 1.5M4.2 17.5L6.8 16M17.2 8l2.6-1.5" /></>,
  rupee: <path d="M7 4.5h10M7 9h10M7 4.5h3a4.5 4.5 0 0 1 0 9H7l8 6.5" />,
  percent: <><path d="M19 5L5 19" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /></>,
  file: <><path d="M6.5 3h7L19 8.5v11A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3z" /><path d="M13 3v6h6M9 13h6M9 17h4" /></>,
  verified: <><path d="M12 2.8l2.4 1.8 3 .1.9 2.8 2.4 1.8-.9 2.9.9 2.8-2.4 1.8-.9 2.8-3 .1L12 21.2l-2.4-1.8-3-.1-.9-2.8-2.4-1.8.9-2.8-.9-2.9 2.4-1.8.9-2.8 3-.1z" /><path d="M8.5 12l2.4 2.4 4.6-4.8" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8v.01" /></>,
  camera: <><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z" /><circle cx="12" cy="12.5" r="3.5" /></>,
  star: <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />,
  plusCircle: <><circle cx="12" cy="12" r="8.5" /><path d="M12 8v8M8 12h8" /></>,
  wifi: <><path d="M4 9.5a12 12 0 0 1 16 0M7 13a7.5 7.5 0 0 1 10 0M10 16.4a3 3 0 0 1 4 0" /><circle cx="12" cy="19" r=".6" /></>,
  parking: <><rect x="4" y="4" width="16" height="16" rx="3.5" /><path d="M10 17V8h3a2.5 2.5 0 0 1 0 5h-3" /></>,
  coffee: <><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" /><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2M11 3.5v2M14 3.5v2" /></>,
  access: <><circle cx="12" cy="4.8" r="1.8" /><path d="M7 9h10M12 9v5l-3 6M12 14l3 6" /></>,
  translate: <><path d="M4 6h9M8.5 4v2c0 4-2 7-4.5 8.5M6 10c1.5 2 3.5 3.5 6 4.5" /><path d="M13 20l3.5-8 3.5 8M14.2 17.3h4.6" /></>
};

export default function Icon({ name, className = 'icon', ...rest }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...rest}>
      {P[name] || null}
    </svg>
  );
}

export const CATEGORY_ICON = {
  'investor-meets': 'users',
  'stock-markets': 'candles',
  'mutual-funds': 'pie',
  wealth: 'diamond',
  literacy: 'book',
  hni: 'key',
  client: 'chat',
  workshops: 'cap',
  networking: 'share',
  general: 'sparkle'
};

export const AMENITY_ICON = { parking: 'parking', wifi: 'wifi', refreshments: 'coffee', lunch: 'coffee', accessible: 'access', recording: 'video', kit: 'book', lounge: 'chat', translation: 'translate' };

export const INTEREST_ICON = { Stocks: 'candles', 'Mutual Funds': 'pie', 'Global Markets': 'globe', Tax: 'percent', Retirement: 'clock', Wealth: 'diamond', Entrepreneurship: 'briefcase' };
