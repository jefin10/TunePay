import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Fonts, makeStyles, Radius, Spacing, useColors } from '@/core/theme';

import { GlassChevron, GlassPressable } from './Glass';
import { useTone } from './Tone';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SWEEP_MS = 620;
const SWEEP_EASE = Easing.out(Easing.cubic);

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

const SWEEPS_ON: ButtonVariant[] = ['primary', 'danger'];

/**
 * Pill-shaped buttons — ink primary; blue is a link only. The primary carries
 * a sheen swept across it on press. The secondary is liquid glass; the ghost
 * is a link. Disabled and loading both block the tap.
 */
export function AppButton(props: AppButtonProps) {
  if (props.variant === 'secondary') return <GlassButton {...props} />;
  return <SolidButton {...props} />;
}

function GlassButton({ label, onPress, loading = false, disabled = false, style, leading, chevron, accessibilityLabel }: AppButtonProps) {
  const C = useColors();
  const styles = useStyles();
  const blocked = disabled || loading || !onPress;
  return (
    <GlassPressable
      disabled={blocked}
      onPress={onPress}
      reach={0.15}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: blocked, busy: loading }}
      style={[styles.base, styles.glassBase, style]}>
      {loading ? (
        <ActivityIndicator color={C.ink} />
      ) : (
        <>
          {leading}
          <Text style={[styles.label, { color: C.ink }]}>{label}</Text>
        </>
      )}
      {chevron && !loading ? (
        <View style={styles.chevron} pointerEvents="none">
          <GlassChevron />
        </View>
      ) : null}
    </GlassPressable>
  );
}

function SolidButton({ label, onPress, variant = 'primary', loading = false, disabled = false, style, accessibilityLabel }: AppButtonProps) {
  const C = useColors();
  const styles = useStyles();
  const dark = useTone() === 'dark';
  const blocked = disabled || loading || !onPress;
  const scale = useSharedValue(1);
  const sweep = useSharedValue(0);
  const [width, setWidth] = useState(0);
  const hasSweep = SWEEPS_ON.includes(variant);
  // The palette inverts in dark mode, so the ink primary is already a light
  // capsule there; it gains a soft blue glow, and its sheen turns blue.
  const sheen = dark && variant === 'primary' ? 'rgba(77,169,252,0.28)' : 'rgba(255,255,255,0.35)';

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -width * 0.7 + sweep.get() * width * 1.6 }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      onPressIn={() => scale.set(withTiming(0.97, { duration: 120 }))}
      onPressOut={() => scale.set(withTiming(1, { duration: 120 }))}
      onPress={() => {
        if (variant !== 'ghost') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (hasSweep && width > 0) {
          sweep.set(0);
          sweep.set(withTiming(1, { duration: SWEEP_MS, easing: SWEEP_EASE }));
        }
        onPress?.();
      }}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'danger' && styles.danger,
        variant === 'ghost' && styles.ghost,
        dark && variant === 'primary' && styles.glow,
        blocked && !loading && (dark ? styles.disabledDark : styles.disabled),
        animatedStyle,
        style,
      ]}>
      {hasSweep && width > 0 ? (
        <Animated.View style={[styles.sweepClip, sweepStyle]} pointerEvents="none">
          <LinearGradient
            colors={['transparent', sheen, 'transparent']}
            locations={[0.3, 0.5, 0.7]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: width * 0.9, height: '100%' }}
          />
        </Animated.View>
      ) : null}
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? C.ink : variant === 'danger' ? '#FFFFFF' : C.white} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'primary' && { color: C.white },
            variant === 'danger' && styles.dangerLabel,
            variant === 'ghost' && { color: C.blue600 },
          ]}>
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const useStyles = makeStyles((C, scheme) => ({
  base: {
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    flexDirection: 'row',
    gap: Spacing.two,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: C.ink,
    boxShadow: `0 22px 44px -24px ${scheme === 'dark' ? '#000000' : '#0A0A0B'}4D`,
  },
  danger: { backgroundColor: C.danger },
  ghost: { backgroundColor: 'transparent', height: 44 },
  disabled: { opacity: 0.42 },
  disabledDark: { opacity: 0.32, boxShadow: 'none' },
  glow: {
    boxShadow: '0 18px 40px -14px rgba(77,169,252,0.55), inset 0 -2px 0 rgba(10,10,11,0.06)',
  },
  // GlassPressable carries its own fill, rim and edge light.
  glassBase: { overflow: 'visible' },
  chevron: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  label: {
    fontSize: 15.5,
    fontFamily: Fonts.semibold,
    letterSpacing: -0.2,
  },
  // Literal white: this sits on red in both schemes.
  dangerLabel: { color: '#FFFFFF' },
  sweepClip: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
}));
