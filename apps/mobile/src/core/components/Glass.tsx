import { BlurView, type BlurTint } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { createContext, useContext, type ComponentRef, type ReactNode, type RefObject } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Motion, Radius } from '@/core/theme';

import { Icon } from './Icon';
import { useTone, type Tone } from './Tone';

/**
 * Liquid glass, in a light and a dark edition that follow the app's scheme:
 *
 * - box             → a faint fill, a hairline rim, and the stacked inset
 *                     shadows that light two opposite edges and corners
 * - sheen           → a diagonal specular sheen across those corners
 * - shade           → a soft shade in the lower half that gives the lens depth
 * - bevel           → a second rim inset inside the edge
 *
 * The web version gets its crispness from `filter: blur()` + `contrast(3)`;
 * native has neither filter, so the blurs are baked into the gradients and the
 * contrast into the stop values instead.
 */

export type GlassWeight = 'regular' | 'strong';

interface GlassLook {
  /** Corner radius; pills by default. */
  radius?: number;
  weight?: GlassWeight;
  /** Tints the fill — the selected chip or segment, never a primary action. */
  tint?: string;
  /** The inner rim; off for dense controls like inputs and OTP cells. */
  bevel?: boolean;
  /** How far the specular corners reach in, as a fraction. */
  reach?: number;
  /**
   * Drops the cast shadow, keeping the rims. For surfaces that sit in a row of
   * their own kind, where a shadow under each one turns an even row into a
   * line of separately floating objects.
   */
  flat?: boolean;
  /**
   * Blur intensity (1–100) for the backdrop, turning the fill from a film you
   * can read through into frosted glass. Off by default: it costs a real
   * compositing pass, so it is for surfaces that float over moving content —
   * the dock above all — not for cards sitting on a flat page.
   */
  blur?: number;
  /** Changes when the surface being blurred changes; the native blur only reads its target as it starts. */
  blurKey?: string;
  /**
   * Glass lit from within in the dark: a pale film over a smoky frost, with
   * bright rims, instead of the dark edition's near-black. For the chrome that
   * floats over the page — the dock — so it reads as glass on a black ground.
   * No change in light mode.
   */
  lit?: boolean;
}

/**
 * Android's blur samples a BlurTargetView, and a BlurView says which by ref —
 * and it cannot sit inside the view it samples, so the target is the page and
 * the blurred surface is a sibling above it. Whoever owns that pair supplies
 * the ref here. Without it — or below Android 12, where the library declines
 * to blur — the opaque fill does the work instead, which is why a blurred
 * surface should never rely on the blur alone to hide what is behind it.
 */
export const BlurTargetContext = createContext<RefObject<ComponentRef<typeof View> | null> | null>(null);

const ANDROID_CAN_BLUR = Platform.OS === 'android' && Number(Platform.Version) >= 31;

function useCanBlur() {
  const target = useContext(BlurTargetContext);
  return Platform.OS === 'ios' || (ANDROID_CAN_BLUR && !!target);
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** The scheme's edition, or the dark one's lit variant. */
type Edition = Tone | 'lit';

const editionOf = (tone: Tone, lit?: boolean): Edition => (lit && tone === 'dark' ? 'lit' : tone);

/** The material under a blurred surface's fill. */
const FROST: Record<Edition, BlurTint> = { light: 'light', dark: 'dark', lit: 'systemUltraThinMaterialDark' };

/** Everything that differs between the editions. Light is glass as designed
 * (on a light grey ground). Dark is not glass at all: on a black ground glass
 * read as smoked black, so it is the way iOS does dark — opaque raised
 * surfaces a step or two above the page, told apart by tone alone, with no
 * sheen, rim light or blur. Lit is dark's one exception, the chrome that
 * floats over everything: real glass, lighter than the page. */
const LOOK: Record<
  Edition,
  {
    /** Drawn flat: no sheen, lens shade, bevel or blur — just fill and edge. */
    solid?: boolean;
    /** The inset rims and bevel light — what makes it read as glass. */
    rims: string;
    /** The cast shadow — what makes it read as lifted off the page. */
    drop: string;
    fill: Record<GlassWeight, string>;
    /** The fill over a working blur, when it differs from the plain one. */
    frost?: Record<GlassWeight, string>;
    border: string;
    sheen: [string, string];
    shade: string;
    bevel: string;
    press: string;
    well: string;
    wellIcon: string;
  }
> = {
  light: {
    rims: [
      'inset 2px -2px 1px -1px rgba(255,255,255,0.95)',
      'inset -2px 2px 1px -1px rgba(255,255,255,0.95)',
      'inset 6px -6px 1px -6px rgba(255,255,255,0.6)',
      'inset -6px 6px 1px -6px rgba(255,255,255,0.6)',
      'inset 0 0 2px rgba(15,23,42,0.28)',
    ].join(', '),
    drop: '0 4px 8px rgba(15,23,42,0.07), 0 14px 28px -16px rgba(15,23,42,0.22)',
    fill: { regular: 'rgba(255,255,255,0.46)', strong: 'rgba(255,255,255,0.74)' },
    border: 'rgba(51,51,51,0.08)',
    sheen: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.42)'],
    shade: 'rgba(15,23,42,0.05)',
    bevel: 'rgba(255,255,255,0.7)',
    press: 'rgba(255,255,255,0.35)',
    well: '#3E3E3E',
    wellIcon: '#F5F5F5',
  },
  dark: {
    solid: true,
    rims: '',
    // A shadow does not show on black; height is told by the fill.
    drop: '',
    // Cards are the first step up from the page; the regular weight — chips,
    // fields, tracks — a second, so it still reads sitting inside a card.
    fill: { regular: '#20252D', strong: '#171B21' },
    border: 'rgba(255,255,255,0.06)',
    sheen: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'],
    shade: 'rgba(0,0,0,0)',
    bevel: 'rgba(255,255,255,0)',
    press: 'rgba(255,255,255,0.06)',
    well: '#2A3039',
    wellIcon: '#F7F8F9',
  },
  lit: {
    rims: [
      'inset 1.5px -1.5px 1px -1px rgba(255,255,255,0.5)',
      'inset -1.5px 1.5px 1px -1px rgba(255,255,255,0.5)',
      'inset 6px -6px 1px -6px rgba(255,255,255,0.22)',
      'inset -6px 6px 1px -6px rgba(255,255,255,0.22)',
      'inset 0 1px 0 rgba(255,255,255,0.12)',
      'inset 0 0 1px rgba(255,255,255,0.22)',
    ].join(', '),
    drop: '0 12px 28px -14px rgba(0,0,0,0.75)',
    // Without a blur the regular film still reads through to the page, which
    // a 42pt button can afford; the strong one (the dock, over scrolling
    // text) turns to a solid smoky grey so nothing reads through it.
    fill: { regular: 'rgba(255,255,255,0.12)', strong: 'rgba(48,52,60,0.94)' },
    frost: { regular: 'rgba(255,255,255,0.1)', strong: 'rgba(255,255,255,0.1)' },
    border: 'rgba(255,255,255,0.14)',
    sheen: ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.12)'],
    shade: 'rgba(0,0,0,0.1)',
    // iOS glass has one edge, not a ring inside a ring.
    bevel: 'rgba(255,255,255,0)',
    press: 'rgba(255,255,255,0.12)',
    well: 'rgba(5,8,14,0.6)',
    wellIcon: '#F7F8F9',
  },
};

/** The selected chip or segment: glass tinted with the brand blue. */
export const GLASS_TINT = 'rgba(77,169,252,0.26)';

function surface({ radius = Radius.full, weight = 'regular', tint, blur, flat }: GlassLook, tone: Edition, canBlur: boolean): ViewStyle {
  const look = LOOK[tone];
  const shadow = [look.rims, flat ? '' : look.drop].filter(Boolean).join(', ');
  return {
    borderRadius: radius,
    borderCurve: 'continuous',
    // With a blur the fill sits in its own layer above it, so the blur has raw
    // page content to sample rather than a backdrop already tinted by it.
    backgroundColor: blur && canBlur && !look.solid ? 'transparent' : (tint ?? look.fill[weight]),
    borderWidth: 1,
    borderColor: look.border,
    boxShadow: shadow || undefined,
  };
}

/** The frosted backdrop: the blur, then the fill laid over it, both clipped to
 * the surface so neither squares off the corners or eats the drop shadow. */
function GlassBackdrop({ radius = Radius.full, weight = 'regular', tint, blur, tone }: GlassLook & { tone: Edition }) {
  const target = useContext(BlurTargetContext);
  const canBlur = useCanBlur();
  const look = LOOK[tone];
  if (!blur || !canBlur || look.solid) return null;
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { borderRadius: Math.max(radius - 1, 0), overflow: 'hidden' }]}>
      <BlurView
        intensity={blur}
        tint={FROST[tone]}
        blurTarget={target ?? undefined}
        blurMethod="dimezisBlurViewSdk31Plus"
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: tint ?? (look.frost ?? look.fill)[weight] }]} />
    </View>
  );
}

/** The sheen, lens shade and bevel, laid over a glass surface. */
function GlassLayers({ radius = Radius.full, bevel = true, reach = 0.22, tone }: GlassLook & { tone: Edition }) {
  const look = LOOK[tone];
  if (look.solid) return null;
  const inner = Math.max(radius - 1, 0);
  return (
    <>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: inner, overflow: 'hidden' }]}>
        <LinearGradient
          colors={[look.sheen[0], 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', look.sheen[1]]}
          locations={[0, reach, 1 - reach, 1]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient colors={['rgba(0,0,0,0)', look.shade]} locations={[0.4, 1]} style={StyleSheet.absoluteFill} />
      </View>
      {bevel ? (
        <View
          pointerEvents="none"
          style={[styles.bevel, { borderRadius: Math.max(radius - 5, 0), borderColor: look.bevel }]}
        />
      ) : null}
    </>
  );
}

interface LiquidGlassProps extends ViewProps, GlassLook {
  children?: ReactNode;
}

/** A static glass surface — cards, pills, panels, tracks. */
export function LiquidGlass({ radius, weight, tint, bevel, reach, blur, blurKey, flat, lit, style, children, ...rest }: LiquidGlassProps) {
  const tone = editionOf(useTone(), lit);
  const canBlur = useCanBlur();
  const look = { radius, weight, tint, bevel, reach, blur, flat };
  return (
    <View style={[surface(look, tone, canBlur), style]} {...rest}>
      <GlassBackdrop key={blurKey} {...look} tone={tone} />
      <GlassLayers {...look} tone={tone} />
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

/** Glass that presses: sinks to 0.97 and brightens on touch-down. */
export function GlassPressable({
  radius,
  weight,
  tint,
  bevel,
  reach,
  blur,
  flat,
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
  const tone = editionOf(useTone(), lit);
  const canBlur = useCanBlur();
  const look = { radius, weight, tint, bevel, reach, blur, flat };
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
      style={[surface(look, tone, canBlur), disabled && styles.disabled, pressStyle, style]}
      {...rest}>
      <GlassBackdrop {...look} tone={tone} />
      <GlassLayers {...look} tone={tone} />
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: LOOK[tone].press, borderRadius: Math.max((radius ?? Radius.full) - 1, 0) },
          glowStyle,
        ]}
      />
      {children}
    </AnimatedPressable>
  );
}

/** The recessed round well with a chevron. */
export function GlassChevron({ size = 34 }: { size?: number }) {
  const look = LOOK[useTone()];
  return (
    <View style={[styles.well, { width: size, height: size, borderRadius: size / 2, backgroundColor: look.well }]}>
      <Icon name="chevron-forward" size={Math.round(size * 0.44)} color={look.wellIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  bevel: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  disabled: {
    opacity: 0.4,
  },
  well: {
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
  },
});
