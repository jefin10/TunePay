import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authenticate } from '@/core/biometrics';
import { AppButton, LiquidGlass, LogoMark, Stagger } from '@/core/components';
import { useSession } from '@/core/storage/session';
import { Fonts, makeStyles, MaxContentWidth, Motion, useColors, useScheme } from '@/core/theme';
import { useReduceMotion } from '@/core/use-reduce-motion';

/** Unlock gate shown on every launch while logged in. */
export default function BiometricScreen() {
  const C = useColors();
  const styles = useStyles();
  const scheme = useScheme();
  const insets = useSafeAreaInsets();
  const setUnlocked = useSession((s) => s.setUnlocked);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Tap to authenticate');
  const reduce = useReduceMotion();
  const breath = useSharedValue(0);

  useEffect(() => {
    if (!reduce) breath.set(withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [reduce, breath]);

  const markStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + breath.get() * 0.035 }] }));

  const unlock = async () => {
    setBusy(true);
    setStatus('Authenticating');
    const outcome = await authenticate('Authenticate to access TunePay');
    if (outcome === 'success') {
      setStatus('Welcome back');
      setTimeout(() => setUnlocked(true), 300);
    } else if (outcome === 'unavailable') {
      setStatus('Biometric not available');
      setTimeout(() => setUnlocked(true), 800);
    } else {
      setStatus('Authentication cancelled');
      setBusy(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(unlock, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.column}>
        <View style={styles.flex} />
        <Stagger>
          <Animated.View style={markStyle}>
            <LiquidGlass radius={34} weight="strong" style={styles.markWell}>
              <LogoMark size={54} />
            </LiquidGlass>
          </Animated.View>
          <Text style={styles.title}>{'Pay smarter,\nspeak faster.'}</Text>
        </Stagger>
        <View style={styles.flex} />

        <Animated.View
          entering={reduce ? undefined : FadeInDown.delay(260).duration(560).easing(Motion.out)}
          style={styles.footer}>
          <LiquidGlass bevel={false} style={styles.status}>
            {busy ? <ActivityIndicator size="small" color={C.fieldText} /> : <View style={styles.dot} />}
            <Text style={styles.statusText}>{status}</Text>
          </LiquidGlass>
          <AppButton label="Authenticate" loading={busy} onPress={unlock} />
        </Animated.View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  root: { flex: 1, paddingHorizontal: 24 },
  column: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  flex: { flex: 1 },
  markWell: { width: 104, height: 104, alignItems: 'center', justifyContent: 'center' },
  title: {
    marginTop: 34,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -1,
    color: C.fieldText,
    fontFamily: Fonts.light,
  },
  footer: { gap: 12 },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
    height: 38,
    paddingHorizontal: 16,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.blue, boxShadow: '0 0 8px rgba(77,169,252,0.7)' },
  statusText: { fontFamily: Fonts.medium, fontSize: 13.5, color: C.fieldText },
}));
