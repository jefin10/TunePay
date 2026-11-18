import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import Svg, { Path } from 'react-native-svg';

import { useColors } from '@/core/theme';

/**
 * Folio's icon set (24px grid, stroked) with the paths taken as-is. Names
 * TunePay inherited from Ionicons are mapped onto it; anything unmapped
 * still renders through Ionicons.
 */
export const ICONS: Record<string, string> = {
  bank: 'M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18M12 3l9 5H3l9-5z',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3',
  repeat: 'M4 9h13l-3-3M20 15H7l3 3',
  cash: 'M3 7h18v10H3zM12 12m-2.5 0a2.5 2.5 0 105 0 2.5 2.5 0 10-5 0M6 10v4M18 10v4',
  wallet: 'M4 7h15a1 1 0 011 1v10a1 1 0 01-1 1H4V7zm0 0l11-3v3M16 13h.01',
  card: 'M3 6h18v12H3zM3 10h18M7 15h4',
  shield: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z',
  clock: 'M12 12m-8 0a8 8 0 1016 0 8 8 0 10-16 0M12 8v4l3 2',
  loan: 'M4 18l5-5 3 3 8-8M15 8h5v5',
  sprout: 'M12 21v-9M12 12c-3.5 0-6-2.5-6-6 3.5 0 6 2.5 6 6zM12 10c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6z',
  cap: 'M2 9l10-5 10 5-10 5-10-5zM6 11v5c3 2 9 2 12 0v-5',
  car: 'M5 16l1.5-5h11L19 16M4 16h16v3H4zM7 19v1M17 19v1M7.5 13.5h.01M16.5 13.5h.01',
  home: 'M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  gem: 'M6 4h12l3 5-9 11L3 9l3-5zM3 9h18M12 20L8 9l4-5 4 5-4 11',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  food: 'M7 3v8m-2-8v5a2 2 0 004 0V3M7 11v10M17 21V3c-2 0-3.5 3-3.5 7h3.5',
  basket: 'M3 10h18l-2 10H5L3 10zM8 10l3-6M16 10l-3-6M9 14v3M15 14v3',
  fuel: 'M5 20V5a1 1 0 011-1h7a1 1 0 011 1v15M4 20h11M5 10h9M14 8h2l2 2v7a1.5 1.5 0 003 0V9l-3-3',
  bag: 'M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 016 0v2',
  bolt: 'M13 3L5 14h6l-1 7 8-11h-6l1-7z',
  key: 'M14 10m-4 0a4 4 0 108 0 4 4 0 10-8 0M10.5 12.5L4 19l2 2M7 16l2 2',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z',
  film: 'M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4',
  plane: 'M10.5 13.5L3 11l1.5-1.5 7.5 1L17 5.5a1.8 1.8 0 012.5 2.5L14.5 13l1 7.5L14 22l-2.5-7.5',
  gift: 'M4 10h16v4H4zM5 14h14v7H5zM12 10v11M12 10S9 3 6.5 6 12 10 12 10zm0 0s3-7 5.5-4S12 10 12 10z',
  percent: 'M19 5L5 19M7 7m-2 0a2 2 0 104 0 2 2 0 10-4 0M17 17m-2 0a2 2 0 104 0 2 2 0 10-4 0',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6M9 16h3',
  dots: 'M6 12h.01M12 12h.01M18 12h.01',
  laptop: 'M5 6h14v9H5zM3 18h18',
  store: 'M4 9l1.5-5h13L20 9M4 9h16v2a2.7 2.7 0 01-5.3 0 2.7 2.7 0 01-5.4 0A2.7 2.7 0 014 11V9zM5 13v7h14v-7M10 20v-4h4v4',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  swap: 'M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7',
  users: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.5M18 14a6 6 0 014 6',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 21a7.5 7.5 0 0115 0',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  pie: 'M12 3a9 9 0 109 9h-9V3zM15 3.5A8 8 0 0120.5 9H15V3.5z',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
  bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4l2-2zM10 20a2 2 0 004 0',
  settings: 'M12 9a3 3 0 100 6 3 3 0 000-6zM19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  eyeOff: 'M3 3l18 18M10.6 5.1A10 10 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3 3.9M6.6 6.6A17 17 0 002 12s3.5 7 10 7a9.7 9.7 0 005.4-1.6M9.9 9.9a3 3 0 004.2 4.2',
  search: 'M11 11m-7 0a7 7 0 1014 0 7 7 0 10-14 0M21 21l-5-5',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  archive: 'M3 5h18v4H3zM5 9v11h14V9M10 13h4',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
  download: 'M12 4v12M7 11l5 5 5-5M4 20h16',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11',
  grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  chevronRight: 'M9 5l7 7-7 7',
  chevronDown: 'M5 9l7 7 7-7',
  chevronUp: 'M5 15l7-7 7 7',
  history: 'M3 12a9 9 0 103-6.7M3 4v5h5M12 7v5l3 2',
  doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',
  link: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
  mic: 'M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM5 11a7 7 0 0014 0M12 18v3',
  watch: 'M8 6l1-4h6l1 4M8 18l1 4h6l1 4M12 12m-6 0a6 6 0 1012 0 6 6 0 10-12 0M12 10v2l1.5 1',
  flash: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  filter: 'M4 5h16l-6 8v6l-4 2v-8L4 5z',
  layout: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  info: 'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 11v5M12 8h.01',
  alert: 'M12 3l10 18H2L12 3zM12 10v4M12 17h.01',
  wifiOff: 'M3 3l18 18M8.5 16.5a5 5 0 017 0M5 13a10 10 0 015.2-2.8M19 13a10 10 0 00-2-1.6M2 8.8A15 15 0 016.6 6M22 8.8A15 15 0 0011 5.1M12 20h.01',
};

/** Ionicons names in the screens → Folio names. */
const ALIASES: Record<string, string> = {
  'chevron-forward': 'chevronRight',
  'chevron-back': 'arrowLeft',
  'chevron-down': 'chevronDown',
  'chevron-up': 'chevronUp',
  checkmark: 'check',
  'receipt-outline': 'receipt',
  'copy-outline': 'doc',
  'business-outline': 'bank',
  refresh: 'repeat',
  'alert-circle-outline': 'alert',
  'information-circle-outline': 'info',
  'help-circle-outline': 'info',
  'person-outline': 'user',
  people_outline: 'users',
  'people-outline': 'users',
  'notifications-outline': 'bell',
  'options-outline': 'settings',
  'log-out-outline': 'logout',
  'lock-closed-outline': 'lock',
  'wallet-outline': 'wallet',
  'share-outline': 'upload',
  'gift-outline': 'gift',
  'arrow-forward': 'arrowRight',
  'arrow-up': 'arrowUp',
  'arrow-down': 'arrowDown',
  add: 'plus',
  close: 'close',
  search: 'search',
  home: 'home',
  mic: 'mic',
  voice: 'mic',
  profile: 'user',
  sparkle: 'sparkle',
  history: 'history',
  eye: 'eye',
  'eye-off': 'eyeOff',
  calendar: 'calendar',
  edit: 'edit',
  trash: 'trash',
  plus: 'plus',
  minus: 'minus',
  card: 'card',
  bank: 'bank',
  bell: 'bell',
  clock: 'clock',
  key: 'key',
  shield: 'shield',
  wallet2: 'wallet',
  'finger-print': 'lock',
  biometric: 'lock',
  'shield-checkmark-outline': 'shield',
  'scan-outline': 'layout',
  'qr-code-outline': 'layout',
  'at-outline': 'link',
  'phone-portrait-outline': 'smartphone',
  'color-palette-outline': 'settings',
  'images-outline': 'archive',
  'sunny-outline': 'bolt',
  help: 'info',
};

export type IconName = keyof typeof ICONS | (string & {});

export function Icon({ name, size = 20, color, strokeWidth = 1.7 }: { name: IconName; size?: number; color?: string; strokeWidth?: number }) {
  const C = useColors();
  const path = ICONS[name] ?? ICONS[ALIASES[name as string] ?? ''] ?? null;
  if (!path) {
    return <Ionicons name={name as ComponentProps<typeof Ionicons>['name']} size={size} color={color ?? C.ink} />;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={path} stroke={color ?? C.ink} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
