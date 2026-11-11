import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';

import { Icon, Lab, Notice, RowSp, Screen, Sec, TopNav } from '@/core/components';
import { makeStyles, Palettes, Radius, useTheme, type Palette, type ThemePreference } from '@/core/theme';

const THEMES: { key: ThemePreference; label: string }[] = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'system', label: 'System' },
];

/** A small preview of one scheme's surfaces, not a coloured square. */
function Swatch({ palette, half }: { palette: Palette; half?: 'left' | 'right' }) {
  const styles = useStyles();
  return (
    <View
      style={[
        styles.swatch,
        { backgroundColor: palette.fieldInkFrom },
        half === 'left' && styles.halfLeft,
        half === 'right' && styles.halfRight,
      ]}>
      <View style={[styles.line, { backgroundColor: palette.ink, width: '60%' }]} />
      <View style={[styles.line, { backgroundColor: palette.ink, width: '35%', opacity: 0.4 }]} />
      <View style={[styles.row, { backgroundColor: palette.commit, borderColor: palette.glassRim }]} />
      <View style={[styles.row, { backgroundColor: palette.glassFillStrong, borderColor: palette.glassRim }]} />
    </View>
  );
}

function Preview({ theme }: { theme: ThemePreference }) {
  const styles = useStyles();
  if (theme === 'system') {
    return (
      <View style={styles.split}>
        <Swatch palette={Palettes.light} half="left" />
        <Swatch palette={Palettes.dark} half="right" />
      </View>
    );
  }
  return <Swatch palette={Palettes[theme]} />;
}

export default function AppearanceScreen() {
  const styles = useStyles();
  const { preference, setPreference } = useTheme();

  const choose = (key: ThemePreference) => {
    if (key === preference) return;
    Haptics.selectionAsync();
    setPreference(key);
  };

  return (
    <Screen>
      <TopNav title="Appearance" />
      <Sec title="Theme" kicker />
      <View style={styles.gallery} accessibilityRole="radiogroup">
        {THEMES.map((th) => {
          const on = th.key === preference;
          return (
            <Pressable
              key={th.key}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${th.label} theme`}
              onPress={() => choose(th.key)}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
              <View style={[styles.ring, on && styles.ringOn]}>
                <Preview theme={th.key} />
              </View>
              <RowSp style={styles.caption}>
                <Lab>{th.label}</Lab>
                {on ? <Icon name="checkmark" size={16} /> : null}
              </RowSp>
            </Pressable>
          );
        })}
      </View>
      <Notice icon="color-palette-outline" style={styles.note}>
        System follows your phone’s light and dark setting and switches with it. Your choice stays on this device.
      </Notice>
    </Screen>
  );
}

const useStyles = makeStyles((C) => ({
  gallery: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1 },
  pressed: { opacity: 0.8 },
  ring: { borderRadius: Radius.tile, padding: 3 },
  ringOn: { boxShadow: `0 0 0 2.5px ${C.ink}` },
  split: { flexDirection: 'row' },
  swatch: {
    flex: 1,
    aspectRatio: 0.72,
    borderRadius: Radius.tile - 3,
    borderCurve: 'continuous',
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: C.line,
  },
  halfLeft: { aspectRatio: 0.36, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0 },
  halfRight: { aspectRatio: 0.36, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0 },
  line: { height: 6, borderRadius: 3 },
  row: { height: 18, borderRadius: 7, marginTop: 4, borderWidth: 1 },
  caption: { marginTop: 10 },
  note: { marginTop: 18 },
}));
