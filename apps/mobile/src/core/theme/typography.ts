import { Manrope_500Medium } from '@expo-google-fonts/manrope/500Medium';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';
import { Manrope_800ExtraBold } from '@expo-google-fonts/manrope/800ExtraBold';

/**
 * Manrope throughout, the Folio system: headings and figures lean on the
 * heavy weights (700 display / 800 display-bold), body runs in 500, labels
 * in 600. One family per weight — styles pick the family and never set
 * fontWeight, which on Android would swap Manrope for the system font.
 */
export const fontAssets = {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
};

export const Fonts = {
  light: 'Manrope_500Medium',
  regular: 'Manrope_500Medium',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;
