import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { ComponentRef, ReactNode, RefObject } from 'react';
import { createContext, useContext } from 'react';

import { Motion, Radius } from '@/core/theme';

import { Icon } from './Icon';
import { useTone, type Tone } from './Tone';

/**
 * The surfaces of Folio, kept behind the glass API the app already speaks:
 * flat fills a step or two above the page, one hairline rim, no sheen, no
 * shade, no blur, no drop shadow. `weight` picks the step — strong is the
 * card step (ink-1), regular the field step (ink-2) — and `tint` overrides
 * the fill (a mint-washed chip). The rest of the props are accepted and
 * ignored so callers never branch.
 */

export type GlassWeight = 'regular' | 'strong';

interface GlassLook {
  /** Corner radius; pills by default. */
  radius?: number;
  weight?: GlassWeight;
  /** Tints the fill — the selected chip, never a primary action. */
  tint?: string;
  bevel?: boolean;
  reach?: number;
  flat?: boolean;
  blur?: number;
  blurKey?: string;
  lit?: boolean;
}

/** Kept for the dock's blur plumbing; nothing samples a target any more. */
export const BlurTargetContext = createContext<RefObject<ComponentRef<typeof View> | null> | null>(null);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FILL: Record<Tone, Record<GlassWeight, string>> = {
  light: { regular: '#161616', strong: '#111111' },
  dark: { regular: '#161616', strong: '#111111' },
};

function surface({ radius = Radius.full, weight = 'regular', tint }: GlassLook, tone: Tone): ViewStyle {
  return {
    borderRadius: radius,
    backgroundColor: tint ?? FILL[tone][weight],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  };
}

interface LiquidGlassProps extends ViewProps, GlassLook {
  children?: ReactNode;
}

/** A flat Folio plate. */
export function LiquidGlass({ radius, weight, tint, bevel, reach, flat, blur, blurKey, lit, style, children, ...rest }: LiquidGlassProps) {
  const tone = useTone();
  return (
    <View style={[surface({ radius, weight, tint }, tone), style]} {...rest}>
      {children}
    </View>
  );
}

interface GlassPressableProps extends Omit<PressableProps, 'style' | 'children'>, GlassLook {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /** A light impact on press; off for selection controls that tick instead. */
  haptic?: boolean;
}

/** A plate that presses: sinks to 0.97 and brightens a step on touch-down. */
export function GlassPressable({
  radius,
  weight,
  tint,
  bevel,
  reach,
  flat,
  blur,
  blurKey,
  lit,
  style,
  children,
  haptic = true,
  disabled,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: GlassPressableProps) {
  const tone = useTone();
  const press = useSharedValue(0);

  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 - press.get() * 0.03 }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: press.get() }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={(e) => {
        press.set(withTiming(1, { duration: 110, easing: Motion.out }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        press.set(withTiming(0, { duration: 200, easing: Motion.out }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
      style={[surface({ radius, weight, tint }, tone), disabled && styles.disabled, pressStyle, style]}
      {...rest}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: '#1d1d1d', borderRadius: Math.max((radius ?? Radius.full) - 1, 0) },
          glowStyle,
        ]}
      />
      {children}
    </AnimatedPressable>
  );
}

/** A recessed round well with a chevron. */
export function GlassChevron({ size = 34 }: { size?: number }) {
  return (
    <View style={[styles.well, { width: size, height: size, borderRadius: size / 2 }]}>
      <Icon name="chevron-forward" size={Math.round(size * 0.44)} color="#c9c8c2" />
    </View>
  );
}

/** The selected chip: mint-washed, the accent's one tint job. */
export const GLASS_TINT = 'rgba(61,220,151,0.13)';

const styles = StyleSheet.create({
  well: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d1d1d',
  },
  disabled: {
    opacity: 0.4,
  },
});
