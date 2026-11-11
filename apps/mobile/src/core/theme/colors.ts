/**
 * TunePay brand tokens — white / ink / blue-as-shade only, the same system as
 * Taarvy. Blue is an accent shade (links, focus rings, one status dot); it is
 * never a button, dock, or section fill. The violet and yellow of the old
 * design are retired.
 */
export const Colors = {
  ink: '#0A0A0B',
  inkSoft: '#5B6470',
  muted: '#8A94A4',

  blue: '#4DA9FC',
  blue600: '#2E90F0',
  blueSoft: '#EAF4FF',

  page: '#F6F8FB',
  page2: '#EDF1F7',
  white: '#FFFFFF',
  surface2: '#F1F4F9',

  soft: 'rgba(10,10,11,0.055)',
  soft2: 'rgba(10,10,11,0.085)',
  line: 'rgba(10,10,11,0.08)',

  // The one dark "commitment" surface per screen (the wallet card).
  commit: '#101216',
  commitInk: '#F7F8F9',
  commitSoft: 'rgba(247,248,249,0.66)',

  // Avatar / tile tints — tonal greys first, no brand colour.
  g1: '#E8EBF0',
  g2: '#DDE1E8',
  g3: '#D0D5DE',
  g4: '#F0E7DC',

  // Full-bleed "field" grounds (unlock / sign-in): near black ink, shaded by
  // curved sheets of light blue rather than a soft gradient.
  fieldInkFrom: '#12151B',
  fieldInkTo: '#060709',
  fieldText: '#F7F8F9',
  fieldTextSoft: 'rgba(247,248,249,0.74)',
  fieldTextDim: 'rgba(247,248,249,0.58)',
  // The plain ground behind the app's screens.
  ground: '#0B0D11',

  // Liquid-glass layers for content sitting on the field: a faint fill,
  // a hairline rim, and a brighter top edge that reads as a light catch.
  glassFill: 'rgba(255,255,255,0.07)',
  glassFillStrong: 'rgba(255,255,255,0.13)',
  glassRim: 'rgba(255,255,255,0.12)',
  glassRimStrong: 'rgba(255,255,255,0.22)',
  glassCatch: 'rgba(255,255,255,0.16)',

  danger: '#E23D45',
  // Money that arrived. The one place a green is allowed: an amount, never a fill.
  credit: '#1F9D5C',
} as const;

export type ColorToken = keyof typeof Colors;

export type Scheme = 'light' | 'dark';

/** A full set of the tokens above for one scheme. `Colors` stays the fixed
 * brand set for content that never changes with the theme (a QR code, the
 * camera overlay); everything themable reads a palette via useColors(). */
export type Palette = { readonly [K in ColorToken]: string };

export const Palettes: Record<Scheme, Palette> = {
  light: {
    ...Colors,
    // The field (unlock, sign-in) in its light edition.
    fieldInkFrom: '#F7F9FC',
    fieldInkTo: '#E4E9F0',
    fieldText: '#0A0A0B',
    fieldTextSoft: 'rgba(10,10,11,0.68)',
    fieldTextDim: 'rgba(10,10,11,0.52)',
    ground: '#EEF2F7',
    glassFill: 'rgba(255,255,255,0.5)',
    glassFillStrong: 'rgba(255,255,255,0.78)',
    glassRim: 'rgba(10,10,11,0.08)',
    glassRimStrong: 'rgba(10,10,11,0.14)',
    glassCatch: 'rgba(255,255,255,0.95)',
  },
  dark: {
    ...Colors,
    // The app inverts: ink becomes the light type and fill, white the surface.
    ink: '#F2F4F7',
    inkSoft: '#A7B0BD',
    muted: '#7F8998',
    blue: '#4DA9FC',
    blue600: '#6CB8FF',
    blueSoft: 'rgba(77,169,252,0.14)',
    page: '#0A0C10',
    page2: '#101319',
    white: '#161A21',
    surface2: '#1C2129',
    soft: 'rgba(255,255,255,0.06)',
    soft2: 'rgba(255,255,255,0.11)',
    line: 'rgba(255,255,255,0.08)',
    commit: '#232934',
    g1: '#252A33',
    g2: '#2B313B',
    g3: '#333A45',
    g4: '#3A342C',
    danger: '#FF6B72',
    credit: '#4CC88A',
    // Fields and secondary buttons in the app: solid, the way iOS fills them
    // in dark, with a quiet edge and no light catch — not glass.
    glassFill: '#1B1F26',
    glassFillStrong: '#232831',
    glassRim: 'rgba(255,255,255,0.07)',
    glassRimStrong: 'rgba(255,255,255,0.12)',
    glassCatch: 'rgba(255,255,255,0)',
  },
};

/** `#RRGGBB` + alpha (0–1) → `rgba(...)`. */
export function alpha(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
