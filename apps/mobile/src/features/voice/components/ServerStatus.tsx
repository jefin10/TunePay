import { Text, View } from 'react-native';

import { GlassPressable } from '@/core/components';
import { Fonts, makeStyles, useColors } from '@/core/theme';

import { useVoiceServerHealth } from '../hooks';

/** Online/offline pill for the intent server; tap to re-check. The dot is
 * the one blue status mark on the screen; offline is red and says so. */
export function ServerStatus() {
  const C = useColors();
  const styles = useStyles();
  const health = useVoiceServerHealth();
  const online = health.data === true;
  const color = health.isLoading ? C.muted : online ? C.blue : C.danger;
  return (
    <GlassPressable
      bevel={false}
      haptic={false}
      onPress={() => health.refetch()}
      style={styles.pill}
      accessibilityLabel={`Voice server ${online ? 'online' : 'offline'}. Tap to re-check.`}>
      <View style={[styles.dot, { backgroundColor: color }, online && styles.glow]} />
      <Text style={styles.text}>{health.isLoading ? 'Checking' : online ? 'Online' : 'Offline'}</Text>
    </GlassPressable>
  );
}

const useStyles = makeStyles((C) => ({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 7, height: 34, paddingHorizontal: 13 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  glow: { boxShadow: '0 0 8px rgba(77,169,252,0.8)' },
  text: { fontFamily: Fonts.semibold, fontSize: 13, color: C.ink },
}));
