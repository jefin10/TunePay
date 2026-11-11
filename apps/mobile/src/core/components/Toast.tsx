import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { Fonts, makeStyles, Radius } from '@/core/theme';

type ToastKind = 'info' | 'success' | 'error';

interface ToastState {
  id: number;
  message: string | null;
  kind: ToastKind;
  show(message: string, kind?: ToastKind): void;
  hide(): void;
}

const useToastStore = create<ToastState>()((set) => ({
  id: 0,
  message: null,
  kind: 'info',
  show: (message, kind = 'info') => set((s) => ({ id: s.id + 1, message, kind })),
  hide: () => set({ message: null }),
}));

/** Show a short message in an ink pill at the top. Callable from anywhere. */
export const toast = (message: string, kind: ToastKind = 'info') => useToastStore.getState().show(message, kind);

/** Mount once near the root. */
export function Toaster() {
  const { id, message, kind, hide } = useToastStore();
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hide, 2400);
    return () => clearTimeout(timer);
  }, [id, message, hide]);

  if (!message) return null;
  return (
    <View pointerEvents="none" style={[styles.host, { top: insets.top + 8 }]}>
      <Animated.View
        key={id}
        entering={FadeInUp.duration(220)}
        exiting={FadeOutUp.duration(180)}
        style={styles.toast}
        accessibilityLiveRegion="polite">
        {/* An error carries a red dot as well as its words — never colour alone. */}
        {kind === 'error' ? <View style={styles.dot} /> : null}
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  host: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: C.ink,
    borderRadius: Radius.full,
    paddingHorizontal: 18,
    paddingVertical: 11,
    boxShadow: '0 18px 34px -20px #0A0A0BAA',
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.danger },
  text: { color: C.white, fontFamily: Fonts.semibold, fontSize: 14, flexShrink: 1 },
}));
