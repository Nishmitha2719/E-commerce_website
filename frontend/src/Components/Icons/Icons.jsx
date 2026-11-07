import React from 'react';

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

export const ArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowDown = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M6 13l6 6 6-6" /></svg>
);
export const Search = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const Bag = (p) => (
  <svg {...base} {...p}><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const Heart = ({ filled, ...p }) => (
  <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.6 3.8 4.5 7 4.5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.2 0 5.3 3.1 4.2 6.2C19.5 15.4 12 20 12 20Z" />
  </svg>
);
export const Plus = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const Minus = (p) => (
  <svg {...base} {...p}><path d="M5 12h14" /></svg>
);
export const Check = (p) => (
  <svg {...base} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const Close = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Menu = (p) => (
  <svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>
);
export const User = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
);
export const Chevron = (p) => (
  <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>
);
export const Instagram = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
);
export const Pinterest = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M10.5 20.5 12 14m0 0c-.8-2.6.2-6 3-6 2 0 3 1.6 2.6 3.6-.4 2.3-2.2 3.9-3.9 3.4-.7-.2-1.3-.6-1.7-1Z" /></svg>
);
export const Whatsapp = (p) => (
  <svg {...base} {...p}><path d="M4 20l1.3-3.8A8 8 0 1 1 8 19l-4 1Z" /><path d="M9 9.5c.3 2.3 2.2 4.3 4.5 4.8l1.2-1.2 1.8.8-.3 1.6c-3.6.4-7.4-3.4-7-7l1.6-.3.8 1.8L9 9.5Z" /></svg>
);
