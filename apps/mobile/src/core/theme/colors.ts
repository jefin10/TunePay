/**
 * Folio's brand tokens, in a dark and a light edition that follow the
 * device: flat surfaces with hairline rims, chalk-or-ink type, one mint
 * accent, coral for danger, gold and sky as quiet category tints.
 *
 * Dark is Folio as shipped — the ink ladder (#0b0b0b page → #111111 →
 * #161616 → #1d1d1d) with chalk type. Light is the same language on
 * paper: the ground turns to Folio's chalk, plates to white, and the type
 * to ink. The wallet card is the one commitment surface: black with chalk
 * type in both editions.
 */
export const Colors = {
  // Type: chalk on ink (dark), ink on paper (light).
  ink: '#f4f3ee',
  inkSoft: '#c9c8c2',
  muted: '#8b8a85',

  // The one accent: mint for focus rings, links and money that arrived.
  blue: '#3ddc97',
  blue600: '#3ddc97',
  blueSoft: 'rgba(61,220,151,0.13)',

  // Surfaces: the ground, then the plate, then the tile.
  page: '#0b0b0b',
  page2: '#111111',
  white: '#111111',
  surface2: '#161616',

  soft: '#161616',
  soft2: 'rgba(255,255,255,0.08)',
  line: 'rgba(255,255,255,0.08)',

  // The wallet card: black with chalk type in both editions.
  commit: '#0b0b0b',
  commitInk: '#f4f3ee',
  commitSoft: '#c9c8c2',

  // Avatar / tile tints — steps of ink plus one gold-tinted step.
  g1: '#1d1d1d',
  g2: '#262626',
  g3: '#161616',
  g4: '#2e2a20',

  // Full-bleed "field" grounds (unlock / sign-in).
  fieldInkFrom: '#0b0b0b',
  fieldInkTo: '#0b0b0b',
  fieldText: '#f4f3ee',
  fieldTextSoft: 'rgba(244,243,238,0.72)',
  fieldTextDim: 'rgba(244,243,238,0.55)',
  // The plain ground behind the app's screens.
  ground: '#0b0b0b',

  // Flat surfaces: a fill a step or two above the page, hairline rim.
  glassFill: '#161616',
  glassFillStrong: '#111111',
  glassRim: 'rgba(255,255,255,0.08)',
  glassRimStrong: 'rgba(255,255,255,0.14)',
  glassCatch: 'rgba(255,255,255,0)',

  danger: '#ff6b57',
  // Money that arrived: mint, the accent's own job.
  credit: '#3ddc97',

  // Folio's category tints.
  gold: '#e8c27a',
  sky: '#6aa8ff',

  // The pop button: the face the ground is not, with hard right/bottom edges.
  popFace: '#f4f3ee',
  popR: '#9a9994',
  popB: '#6b6a66',
  popInk: '#0b0b0b',
  // The quiet pop: a tile face a step above the page.
  pop2Face: '#1d1d1d',
  pop2R: '#343432',
  pop2B: '#262624',
  pop2Ink: '#f4f3ee',
  // The pressed fill, and icon tiles inside rows.
  tile: '#1d1d1d',
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
    // Paper edition: chalk ground, white plates, ink type.
    ink: '#0b0b0b',
    inkSoft: '#5d5c58',
    muted: '#8b8a85',
    blue600: '#146642',
    blueSoft: 'rgba(61,220,151,0.2)',
    page: '#f2f1ec',
    page2: '#f7f6f2',
    white: '#ffffff',
    surface2: '#f4f3ee',
    soft: '#f4f3ee',
    soft2: 'rgba(11,11,11,0.08)',
    line: 'rgba(11,11,11,0.08)',
    g1: '#e8e7e2',
    g2: '#dedcd6',
    g3: '#f4f3ee',
    g4: '#e9e0cd',
    fieldInkFrom: '#f7f6f2',
    fieldInkTo: '#eae9e4',
    fieldText: '#0b0b0b',
    fieldTextSoft: 'rgba(11,11,11,0.66)',
    fieldTextDim: 'rgba(11,11,11,0.5)',
    ground: '#f2f1ec',
    glassFill: '#f4f3ee',
    glassFillStrong: '#ffffff',
    glassRim: 'rgba(11,11,11,0.08)',
    glassRimStrong: 'rgba(11,11,11,0.14)',
    danger: '#e2452f',
    credit: '#146642',
    popFace: '#0b0b0b',
    popR: '#2e2e2b',
    popB: '#111110',
    popInk: '#f4f3ee',
    pop2Face: '#ecebe6',
    pop2R: '#d9d8d2',
    pop2B: '#c6c5bf',
    pop2Ink: '#0b0b0b',
    tile: '#ecebe6',
  },
  dark: {
    ...Colors,
    // The app's ink edition: Folio as shipped.
    fieldInkFrom: '#111111',
    fieldInkTo: '#0b0b0b',
  },
};

/** `#RRGGBB` + alpha (0–1) → `rgba(...)`. */
export function alpha(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
