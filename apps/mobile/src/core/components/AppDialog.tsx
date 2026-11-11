import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Keyframe } from 'react-native-reanimated';

import { Fonts, makeStyles } from '@/core/theme';

const RISE = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.96 }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
}).duration(200);

/**
 * The app's own alert: a solid card in the middle over a dimmed ground. The
 * words never sit on what is behind them. Put a DialogTitle, a DialogMessage
 * and DialogActions inside.
 */
export function AppDialog({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  const styles = useStyles();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.host}>
        <Animated.View entering={FadeIn.duration(180)} style={StyleSheet.absoluteFill}>
          <Pressable accessibilityLabel="Close" style={styles.scrim} onPress={onClose} />
        </Animated.View>
        <Animated.View entering={RISE} style={styles.plate} accessibilityViewIsModal>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return (
    <Text style={styles.title} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function DialogMessage({ children }: { children: ReactNode }) {
  return <Text style={useStyles().message}>{children}</Text>;
}

export interface DialogAction {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress: () => void;
}

/** Answers side by side when there are two, Cancel on the left; stacked when there are more. */
export function DialogActions({ actions }: { actions: DialogAction[] }) {
  const styles = useStyles();
  const ordered = [...actions.filter((a) => a.style === 'cancel'), ...actions.filter((a) => a.style !== 'cancel')];
  const row = ordered.length <= 2;
  return (
    <View style={[styles.actions, row && styles.actionsRow]}>
      {ordered.map((a) => {
        const kind = a.style === 'cancel' ? styles.quiet : a.style === 'destructive' ? styles.danger : styles.primary;
        const text = a.style === 'cancel' ? styles.quietText : a.style === 'destructive' ? styles.dangerText : styles.primaryText;
        return (
          <Pressable
            key={a.text}
            accessibilityRole="button"
            onPress={a.onPress}
            style={({ pressed }) => [styles.action, row && styles.actionGrow, kind, pressed && styles.pressed]}>
            <Text style={text} numberOfLines={1}>
              {a.text}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  host: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  scrim: { flex: 1, backgroundColor: 'rgba(8,10,14,0.55)' },
  plate: {
    width: '100%',
    maxWidth: 340,
    padding: 22,
    borderRadius: 22,
    borderCurve: 'continuous',
    backgroundColor: C.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    boxShadow: '0 30px 60px -24px rgba(0,0,0,0.55)',
  },
  title: { fontFamily: Fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2, color: C.ink },
  message: { fontFamily: Fonts.regular, fontSize: 14.5, lineHeight: 21, color: C.muted, marginTop: 6 },
  actions: { gap: 10, marginTop: 22 },
  actionsRow: { flexDirection: 'row' },
  action: {
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionGrow: { flex: 1 },
  primary: { backgroundColor: C.ink },
  // `C.white` is the scheme's surface, so on ink it is always the opposite tone.
  primaryText: { fontFamily: Fonts.semibold, fontSize: 15, color: C.white },
  danger: { backgroundColor: C.danger },
  // Literal white: this sits on red in both schemes.
  dangerText: { fontFamily: Fonts.semibold, fontSize: 15, color: '#FFFFFF' },
  quiet: { backgroundColor: C.soft },
  quietText: { fontFamily: Fonts.semibold, fontSize: 15, color: C.ink },
  pressed: { opacity: 0.75 },
}));
