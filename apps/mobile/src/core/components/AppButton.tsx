import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import type { ReactNode } from 'react';

import { Fonts, makeStyles, useColors } from '@/core/theme';

import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Secondary only: an icon set before the label. */
  leading?: ReactNode;
  /** Secondary only: the recessed chevron well pinned to the trailing edge. */
  chevron?: boolean;
  accessibilityLabel?: string;
}

/**
 * Folio's pop button: a flat face with hard right and bottom edge strips,
 * that sinks into them on press. Chalk is the primary face (ink type), ink-3
 * the secondary, coral the destructive one; the ghost is a quiet link.
 */
export function AppButton(props: AppButtonProps) {
  if (props.variant === 'ghost') return <Ghost {...props} />;
  return <PopButton {...props} />;
}

const TONES = {
  primary: { face: '#f4f3ee', r: '#9a9994', b: '#6b6a66', ink: '#0b0b0b' },
  secondary: { face: '#1d1d1d', r: '#343432', b: '#262624', ink: '#f4f3ee' },
  danger: { face: '#ff6b57', r: '#c24636', b: '#8a2c20', ink: '#1d0603' },
} as const;

const DEPTH = 5;

function PopButton({ label, onPress, variant = 'primary', loading = false, disabled = false, style, leading, chevron, accessibilityLabel }: AppButtonProps) {
  const C = useColors();
  const t = disabled || loading ? { face: '#1d1d1d', r: '#2a2a28', b: '#222220', ink: C.muted } : TONES[variant];
  const press = useSharedValue(0);
  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: press.value * DEPTH }, { translateY: press.value * DEPTH }],
  }));
  const blocked = disabled || loading || !onPress;
  return (
    <Pressable
      disabled={blocked}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: blocked, busy: loading }}
      onPressIn={() => {
        press.value = withTiming(1, { duration: 70 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      }}
      onPressOut={() => (press.value = withSpring(0, { damping: 14, stiffness: 420 }))}
      onPress={onPress}
      style={[{ paddingRight: DEPTH, paddingBottom: DEPTH }, style]}>
      {/* Hard edges: a bottom strip and a right strip, offset by the depth. */}
      <View style={{ position: 'absolute', left: DEPTH, right: DEPTH, bottom: 0, height: DEPTH, backgroundColor: t.b }} />
      <View style={{ position: 'absolute', right: 0, top: DEPTH, bottom: 0, width: DEPTH, backgroundColor: t.r }} />
      <Animated.View style={[{ height: 48, backgroundColor: t.face, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, gap: 8 }, faceStyle]}>
        {loading ? (
          <ActivityIndicator color={t.ink} />
        ) : (
          <>
            {leading}
            <Text style={{ color: t.ink, fontFamily: Fonts.extrabold, fontSize: 14, letterSpacing: 0.2 }}>{label}</Text>
          </>
        )}
      </Animated.View>
      {chevron && !loading ? (
        <View style={{ position: 'absolute', right: 8, top: DEPTH, bottom: DEPTH, justifyContent: 'center' }}>
          <Icon name="chevron-forward" size={16} color={t.ink} />
        </View>
      ) : null}
    </Pressable>
  );
}

/** A quiet link, Folio's ghost: chalk-dim label that brightens when pressed. */
function Ghost({ label, onPress, loading = false, disabled = false, style, accessibilityLabel }: AppButtonProps) {
  const C = useColors();
  const s = useStyles();
  const blocked = disabled || loading || !onPress;
  return (
    <Pressable
      disabled={blocked}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: blocked, busy: loading }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => undefined);
        onPress?.();
      }}
      style={({ pressed }) => [s.ghost, pressed && { backgroundColor: C.surface2 }, style]}>
      {loading ? <ActivityIndicator color={C.muted} /> : <Text style={[s.ghostText, blocked && { color: C.muted }]}>{label}</Text>}
    </Pressable>
  );
}

const useStyles = makeStyles((C) => ({
  ghost: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 34, borderRadius: 17, justifyContent: 'center' },
  ghostText: { color: C.inkSoft, fontFamily: Fonts.bold, fontSize: 13 },
}));
