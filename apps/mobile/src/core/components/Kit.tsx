/**
 * The surfaces of the design system as React Native primitives.
 *
 * Every surface is liquid glass over the ground — cards, lists, rows, chips,
 * notices, secondary buttons — in the light or dark edition of the current
 * scheme. Only primary actions (and the one dark Commit panel per screen)
 * stay solid.
 */
import * as Haptics from 'expo-haptics';
import { useEffect, type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useReduceMotion } from '@/core/use-reduce-motion';
import { Fonts, makeStyles, Radius, useColors, useScheme, type Palette } from '@/core/theme';
import { initials } from '@/core/utils/format';

import { Cap, Kick, T3, T4, useText } from './AppText';
import { GLASS_TINT, GlassPressable, LiquidGlass } from './Glass';
import { Icon, type IconName } from './Icon';

/* ------------------------------------------------------------ surfaces */

/** A glass card. */
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = useKit();
  return (
    <LiquidGlass radius={Radius.card} weight="strong" reach={0.18} style={[s.card, style]}>
      {children}
    </LiquidGlass>
  );
}

/** A pressable glass surface row. */
export function Surface({
  children,
  style,
  onPress,
  accessibilityLabel,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const s = useKit();
  if (!onPress) {
    return (
      <LiquidGlass radius={Radius.tile} weight="strong" bevel={false} style={[s.sur, style]}>
        {children}
      </LiquidGlass>
    );
  }
  return (
    <GlassPressable
      radius={Radius.tile}
      weight="strong"
      bevel={false}
      haptic={false}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[s.sur, style]}>
      {children}
    </GlassPressable>
  );
}

/** A grouped list of rows on one pane of glass, with inset hairlines. */
export function List({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = useKit();
  const items = (Array.isArray(children) ? children : [children]).flat().filter(Boolean);
  return (
    <LiquidGlass radius={Radius.panel} weight="strong" bevel={false} reach={0.16} style={style}>
      {/* Clip pressed rows to the panel's corners. */}
      <View style={s.lstClip}>
        {items.map((child, i) => (
          <View key={i}>
            {i > 0 ? <View style={s.divider} /> : null}
            {child}
          </View>
        ))}
      </View>
    </LiquidGlass>
  );
}

/** One row of a List. */
export function Row({
  left,
  title,
  subtitle,
  right,
  chevron,
  onPress,
  accessibilityLabel,
}: {
  left?: ReactNode;
  title: string;
  subtitle?: string | null;
  right?: ReactNode;
  chevron?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const s = useKit();
  const t = useText();
  const C = useColors();
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [s.row, pressed && s.rowPressed]}>
      {left}
      <View style={s.grow}>
        <Text style={t.r1} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={t.r2} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
      {chevron ? <Icon name="chevron-forward" size={17} color={C.muted} /> : null}
    </Pressable>
  );
}

/** A row's leading icon: a quiet round tile. */
export function RowIcon({ name }: { name: IconName }) {
  const s = useKit();
  return (
    <View style={s.rowIcon}>
      <Icon name={name} size={19} />
    </View>
  );
}

/** A label on the left, its value on the right. */
export function InfoRow({ icon, label, value }: { icon?: IconName; label: string; value: string }) {
  const s = useKit();
  const t = useText();
  return (
    <View style={s.row}>
      {icon ? <RowIcon name={icon} /> : null}
      <Text style={[t.sm, s.grow, { color: useColors().inkSoft }]}>{label}</Text>
      <Text style={[t.r1, s.value]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

/** A row with a switch. */
export function ToggleRow({
  icon,
  title,
  value,
  onValueChange,
}: {
  icon?: IconName;
  title: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <Row
      left={icon ? <RowIcon name={icon} /> : undefined}
      title={title}
      right={<Toggle value={value} onChange={onValueChange} accessibilityLabel={title} />}
    />
  );
}

/** The one dark panel per screen. */
export function Commit({
  kicker,
  title,
  children,
  right,
  style,
}: {
  kicker: string;
  title?: string;
  children?: ReactNode;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const s = useKit();
  const C = useColors();
  return (
    <View style={[s.commit, style]}>
      <View style={s.rowsp}>
        <View style={s.grow}>
          <Kick style={{ color: C.commitSoft }}>{kicker}</Kick>
          {title ? <T4 style={{ color: C.commitInk, marginTop: 6 }}>{title}</T4> : null}
        </View>
        {right}
      </View>
      {children ? <View style={{ marginTop: 14 }}>{children}</View> : null}
    </View>
  );
}

/** A small pill button inside a Commit panel. */
export function CommitButton({ label, icon, onPress }: { label: string; icon?: IconName; onPress: () => void }) {
  const s = useKit();
  const C = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.commitBtn, pressed && s.pressed]}>
      {icon ? <Icon name={icon} size={16} color={C.commitInk} /> : null}
      <Text style={s.commitBtnText}>{label}</Text>
    </Pressable>
  );
}

/** A small pill button: glass by default, solid ink when primary, red-tinted when destructive. */
export function SmallButton({
  label,
  icon,
  onPress,
  variant = 's',
  style,
  disabled,
}: {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  variant?: 's' | 'p' | 'd';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const s = useKit();
  const C = useColors();
  const fg = variant === 'p' ? C.white : variant === 'd' ? C.danger : C.ink;
  const content = (
    <>
      {icon ? <Icon name={icon} size={16} color={fg} /> : null}
      <Text style={[s.smBtnText, { color: fg }]}>{label}</Text>
    </>
  );
  if (variant === 's') {
    return (
      <GlassPressable bevel={false} haptic={false} onPress={onPress} disabled={disabled} style={[s.smBtn, style]}>
        {content}
      </GlassPressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.smBtn,
        variant === 'p' && s.smBtnP,
        variant === 'd' && s.smBtnD,
        (pressed || disabled) && s.pressed,
        style,
      ]}>
      {content}
    </Pressable>
  );
}

/* ------------------------------------------------------------ avatars */

/** Tonal grey per person — stable, never a brand colour. */
function tintFor(name: string, C: Palette) {
  const tints = [C.g1, C.g2, C.g3, C.g4];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return tints[Math.abs(h) % tints.length]!;
}

/** A round initials avatar; `dark` makes it the ink one. */
export function Avatar({ name, size = 40, dark }: { name: string | null | undefined; size?: number; dark?: boolean }) {
  const s = useKit();
  const C = useColors();
  return (
    <View
      style={[
        s.av,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: dark ? C.ink : tintFor(name ?? '', C) },
      ]}>
      <Text style={[s.avText, { fontSize: size * 0.36 }, dark && { color: C.white }]}>{initials(name ?? '')}</Text>
    </View>
  );
}

/* ------------------------------------------------------- small pieces */

/** A small status pill; the fill carries the state, not the colour. */
export function Badge({ label, variant = 'soft' }: { label: string; variant?: 'soft' | 'ink' | 'line' | 'danger' }) {
  const s = useKit();
  const C = useColors();
  return (
    <View style={[s.badge, variant === 'ink' && s.badgeInk, variant === 'line' && s.badgeLine, variant === 'danger' && s.badgeDanger]}>
      <Text style={[s.badgeText, variant === 'ink' && { color: C.white }, variant === 'danger' && { color: C.danger }]}>
        {label}
      </Text>
    </View>
  );
}

/** A glass chip; a chosen chip is tinted with the brand blue. */
export function Chip({ label, on, icon, onPress }: { label: string; on?: boolean; icon?: IconName; onPress?: () => void }) {
  const s = useKit();
  const C = useColors();
  const content = (
    <>
      {icon ? <Icon name={icon} size={14} color={C.ink} /> : null}
      <Text style={[s.chipText, { color: C.ink }]}>{label}</Text>
    </>
  );
  const look = { bevel: false, tint: on ? GLASS_TINT : undefined, style: s.chip } as const;
  return onPress ? (
    <GlassPressable {...look} haptic={false} accessibilityState={{ selected: !!on }} onPress={onPress}>
      {content}
    </GlassPressable>
  ) : (
    <LiquidGlass {...look}>{content}</LiquidGlass>
  );
}

/**
 * One choice among a few, as a pill: solid ink when it is the one chosen,
 * glass when it is not — never glass with an ink fill behind it, which
 * leaves the lit rims drawing an outline.
 */
export function PillChoice({
  label,
  on,
  onPress,
  icon,
  role = 'button',
}: {
  label: string;
  on: boolean;
  onPress: () => void;
  icon?: IconName;
  role?: 'button' | 'tab';
}) {
  const s = useKit();
  const C = useColors();
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ selected: on }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [s.pill, on && s.pillOn, pressed && s.pressed]}>
      {!on ? (
        <LiquidGlass pointerEvents="none" radius={Radius.full} weight="strong" bevel={false} flat style={StyleSheet.absoluteFill} />
      ) : null}
      {icon ? <Icon name={icon} size={14} color={on ? C.white : C.inkSoft} /> : null}
      <Text style={[s.pillText, on && { color: C.white }]}>{label}</Text>
    </Pressable>
  );
}

/** A row of pills that scrolls sideways, bleeding to the screen edges. */
export function PillRail({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = useKit();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
      style={[s.bleed, style]}
      contentContainerStyle={s.rail}>
      {children}
    </ScrollView>
  );
}

/** A glass track with an ink thumb on the chosen option. */
export function Seg<K extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const s = useKit();
  const C = useColors();
  return (
    <LiquidGlass bevel={false} style={[s.seg, style]} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable
            key={o.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              if (!on) Haptics.selectionAsync();
              onChange(o.key);
            }}
            style={s.segBtn}>
            {on ? <View style={[StyleSheet.absoluteFill, s.segOn]} /> : null}
            <Text style={[s.segText, on && { color: C.white }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </LiquidGlass>
  );
}

/** A round icon button: solid glass by default, ink for the one primary action,
 * `lit` glass for a button that floats over a picture. */
export function IconButton({
  icon,
  onPress,
  variant = 'solid',
  size = 42,
  color,
  accessibilityLabel,
}: {
  icon: IconName;
  onPress?: () => void;
  variant?: 'solid' | 'plain' | 'ink' | 'lit';
  size?: number;
  color?: string;
  accessibilityLabel: string;
}) {
  const s = useKit();
  const C = useColors();
  const fg = color ?? (variant === 'ink' ? C.white : C.ink);
  const box = { width: size, height: size, borderRadius: size / 2 };
  const glyph = <Icon name={icon} size={Math.round(size * 0.46)} color={fg} />;

  if (variant === 'plain' || variant === 'ink') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        hitSlop={6}
        style={({ pressed }) => [s.iconBtn, box, variant === 'ink' && s.iconBtnInk, pressed && s.pressed]}>
        {glyph}
      </Pressable>
    );
  }
  return (
    <GlassPressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      haptic={false}
      hitSlop={6}
      lit={variant === 'lit'}
      style={[s.iconBtn, box]}>
      {glyph}
    </GlassPressable>
  );
}

/** A small section header: a kicker or a title, and something on the right. */
export function Sec({ title, right, kicker }: { title: string; right?: ReactNode; kicker?: boolean }) {
  const s = useKit();
  return (
    <View style={s.sec}>
      {kicker ? <Kick>{title}</Kick> : <T4>{title}</T4>}
      {typeof right === 'string' ? <Cap>{right}</Cap> : right}
    </View>
  );
}

/** Nothing to show: an icon in a glass well, a line, and what to do next. */
export function Empty({ icon, title, children }: { icon: IconName; title: string; children?: ReactNode }) {
  const s = useKit();
  const C = useColors();
  return (
    <View style={s.empty}>
      <LiquidGlass style={s.emptyIc}>
        <Icon name={icon} size={25} color={C.muted} />
      </LiquidGlass>
      <T3 style={s.center}>{title}</T3>
      {children ? <View style={s.emptyAction}>{children}</View> : null}
    </View>
  );
}

/** A quiet note, or an error with an optional retry. */
export function Notice({
  icon,
  children,
  tone = 'soft',
  onRetry,
  style,
}: {
  icon?: IconName;
  children: ReactNode;
  tone?: 'soft' | 'err';
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const s = useKit();
  const C = useColors();
  const err = tone === 'err';
  return (
    <LiquidGlass
      radius={Radius.field}
      bevel={false}
      reach={0.3}
      tint={err ? 'rgba(226,61,69,0.1)' : undefined}
      style={[s.notice, style]}
      accessibilityRole={err ? 'alert' : undefined}>
      <Icon name={icon ?? (err ? 'alert-circle-outline' : 'information-circle-outline')} size={18} color={err ? C.danger : C.inkSoft} />
      <Text style={[s.noticeText, err && { color: C.danger }]}>{children}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} accessibilityRole="button" hitSlop={8}>
          <Text style={[s.noticeAction, err && { color: C.danger }]}>Retry</Text>
        </Pressable>
      ) : null}
    </LiquidGlass>
  );
}

/** An ink toggle. In dark the `white` token is a dark surface, which an
 * Android thumb (wider than its track) melts into: the thumb stays white, and
 * on is blue there, as white on pale ink would not read as on. */
export function Toggle({
  value,
  onChange,
  disabled,
  accessibilityLabel,
}: {
  value: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const C = useColors();
  const dark = useScheme() === 'dark';
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      trackColor={{ false: C.soft2, true: dark ? C.blue : C.ink }}
      thumbColor="#FFFFFF"
      ios_backgroundColor={C.soft2}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

/* ---------------------------------------------------------- skeleton */

/** A placeholder that breathes at 1.6s — never a spinner over layout. */
export function Skeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  const s = useKit();
  const reduce = useReduceMotion();
  const o = useSharedValue(1);
  useEffect(() => {
    if (reduce) return;
    o.set(
      withRepeat(
        withSequence(withTiming(0.45, { duration: 800, easing: Easing.inOut(Easing.ease) }), withTiming(1, { duration: 800 })),
        -1,
      ),
    );
  }, [reduce, o]);
  const a = useAnimatedStyle(() => ({ opacity: o.get() }));
  return <Animated.View style={[s.sk, a, style]} />;
}

/* ------------------------------------------------------------ layout */

export function RowSp({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = useKit();
  return <View style={[s.rowsp, style]}>{children}</View>;
}

export function RowFl({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = useKit();
  return <View style={[s.rowfl, style]}>{children}</View>;
}

const useKit = makeStyles((C, scheme) => {
  // Shadows stay dark in both schemes — ink turns light in dark mode.
  const shade = scheme === 'dark' ? '#000000' : C.ink;
  const lift = `0 22px 44px -24px ${shade}4D`;
  const soft = `0 6px 18px -12px ${shade}29`;
  return {
    grow: { flex: 1, minWidth: 0 },
    center: { textAlign: 'center' },
    rowsp: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    rowfl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    pressed: { opacity: 0.72 },
    card: { padding: 16 },
    sur: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
    lstClip: { borderRadius: Radius.panel - 1, borderCurve: 'continuous', overflow: 'hidden' },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: C.soft2, marginLeft: 15, marginRight: 15 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 15, minHeight: 62 },
    rowPressed: { backgroundColor: C.soft },
    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: C.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    value: { maxWidth: '58%', textAlign: 'right' },
    commit: {
      backgroundColor: C.commit,
      borderRadius: Radius.card,
      borderCurve: 'continuous',
      padding: 20,
      boxShadow: lift,
      overflow: 'hidden',
    },
    commitBtn: {
      flex: 1,
      height: 40,
      borderRadius: Radius.full,
      backgroundColor: 'rgba(255,255,255,0.14)',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 14,
    },
    commitBtnText: { color: C.commitInk, fontFamily: Fonts.semibold, fontSize: 14 },
    smBtn: {
      height: 40,
      borderRadius: Radius.full,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    smBtnP: { backgroundColor: C.ink, boxShadow: soft },
    smBtnD: { backgroundColor: 'rgba(226,61,69,0.1)' },
    smBtnText: { fontFamily: Fonts.semibold, fontSize: 14 },
    av: { alignItems: 'center', justifyContent: 'center' },
    avText: { fontFamily: Fonts.bold, color: C.ink },
    badge: {
      height: 24,
      paddingHorizontal: 9,
      borderRadius: Radius.full,
      backgroundColor: C.soft,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
    badgeInk: { backgroundColor: C.ink },
    badgeLine: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.soft2 },
    badgeDanger: { backgroundColor: 'rgba(226,61,69,0.12)' },
    badgeText: { fontFamily: Fonts.bold, fontSize: 11.5, color: C.inkSoft, textTransform: 'capitalize' },
    chip: { height: 34, paddingHorizontal: 13, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 6 },
    chipText: { fontFamily: Fonts.semibold, fontSize: 13.5 },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingHorizontal: 15,
      minHeight: 38,
      borderRadius: Radius.full,
      borderCurve: 'continuous',
    },
    pillOn: { backgroundColor: C.ink },
    pillText: { fontFamily: Fonts.semibold, fontSize: 13.5, color: C.inkSoft },
    bleed: { marginHorizontal: -20, flexGrow: 0 },
    rail: { gap: 8, paddingHorizontal: 20, paddingVertical: 2 },
    seg: { flexDirection: 'row', gap: 4, padding: 4 },
    segBtn: { flex: 1, height: 36, alignItems: 'center', justifyContent: 'center' },
    segOn: { backgroundColor: C.ink, borderRadius: Radius.full, borderCurve: 'continuous' },
    segText: { fontFamily: Fonts.semibold, fontSize: 13.5, color: C.inkSoft },
    iconBtn: { alignItems: 'center', justifyContent: 'center' },
    iconBtnInk: { backgroundColor: C.ink, boxShadow: soft },
    sec: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 30, marginBottom: 12 },
    empty: { alignItems: 'center', gap: 10, paddingVertical: 46, paddingHorizontal: 24 },
    emptyIc: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center' },
    emptyAction: { alignSelf: 'stretch', marginTop: 10 },
    notice: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, paddingHorizontal: 15 },
    noticeText: { flex: 1, fontFamily: Fonts.regular, fontSize: 12.5, lineHeight: 18, color: C.inkSoft },
    noticeAction: { fontFamily: Fonts.bold, fontSize: 13, color: C.ink },
    sk: { backgroundColor: C.soft, borderRadius: 12 },
  };
});
