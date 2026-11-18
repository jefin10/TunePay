/** Folio's spacing rhythm: 4 / 8 / 14 / 16 / 20 / 24 / 34. */
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 14,
  four: 20,
  five: 28,
  six: 44,
  seven: 64,
} as const;

/** Folio's radii: fields 14, plates 22, sheets 24, pills full. */
export const Radius = {
  min: 14,
  field: 14,
  tile: 22,
  panel: 22,
  card: 22,
  sheet: 24,
  hero: 22,
  full: 999,
} as const;

/** One readable column, centred on tablets. */
export const MaxContentWidth = 480;
