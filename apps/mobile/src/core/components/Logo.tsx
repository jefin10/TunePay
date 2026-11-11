import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { Colors, Fonts, makeStyles, useColors } from '@/core/theme';

/** The five bars of the sound wave, on a 24-unit grid: x, height. */
const BARS = [
  [2.6, 6],
  [7.3, 11.5],
  [12, 18],
  [16.7, 11.5],
  [21.4, 6],
] as const;
const BAR_WIDTH = 2.9;

export type LogoTone = 'brand' | 'mono';

/**
 * The TunePay mark — the same sound wave as the app icon, drawn as a vector
 * in the house palette: ink bars with the tallest one in blue. 'mono' draws
 * every bar in one passed-in colour.
 */
export function LogoMark({ size = 28, tone = 'brand', color }: { size?: number; tone?: LogoTone; color?: string }) {
  const C = useColors();
  const ink = color ?? C.ink;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="TunePay">
      {BARS.map(([x, h], i) => (
        <Rect
          key={x}
          x={x - BAR_WIDTH / 2}
          y={12 - h / 2}
          width={BAR_WIDTH}
          height={h}
          rx={BAR_WIDTH / 2}
          fill={tone === 'brand' && i === 2 ? Colors.blue : ink}
        />
      ))}
    </Svg>
  );
}

/** The mark and the name, side by side. */
export function Wordmark({ size = 22, style }: { size?: number; style?: StyleProp<ViewStyle> }) {
  const styles = useStyles();
  return (
    <View style={[styles.row, style]}>
      <LogoMark size={size * 1.15} />
      <Text style={[styles.name, { fontSize: size, lineHeight: size * 1.2 }]}>TunePay</Text>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontFamily: Fonts.medium, color: C.ink, letterSpacing: -0.6 },
}));
