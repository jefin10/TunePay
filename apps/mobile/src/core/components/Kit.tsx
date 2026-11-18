/**
 * The surfaces of the design system as React Native primitives — Folio's
 * flat world: plates of ink one step above the page with hairline rims,
 * chalk type, mint for the accent, coral for danger. No glass, no shadows.
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
import { Fonts, makeStyles, Radius, useColors, type Palette } from '@/core/theme';
import { initials } from '@/core/utils/format';

import { Cap, Kick, T3, T4, useText } from './AppText';
import { GLASS_TINT, GlassPressable, LiquidGlass } from './Glass';
import { Icon, type IconName } from './Icon';

/* ------------------------------------------------------------ surfaces */

/** A plate — Folio's card: ink-1, hairline rim, radius 22. */
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = useKit();
  return (
    <LiquidGlass radius={Radius.card} weight="strong" style={[s.card, style]}>
      {children}
    </LiquidGlass>
  );
}

/** A pressable plate row. */
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
      <LiquidGlass radius={Radius.tile} weight="strong" style={[s.sur, style]}>
        {children}
      </LiquidGlass>
    );
  }
  return (
    <GlassPressable
      radius={Radius.tile}
      weight="strong"
      haptic={false}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[s.sur, style]}>
      {children}
    </GlassPressable>
  );
}

/** A grouped list of rows on one plate, with inset hairlines. */
export function List({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = useKit();
  const items = (Array.isArray(children) ? children : [children]).flat().filter(Boolean);
  return (
    <LiquidGlass radius={Radius.panel} weight="strong" style={style}>
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

/** A row's leading icon: a quiet tile, the way Folio insets row icons. */
export function RowIcon({ name }: { name: IconName }) {
  const s = useKit();
  return (
    <View style={s.rowIcon}>
      <Icon name={name} size={19} color="#c9c8c2" />
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

/** The one raised panel per screen. */
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

/** A small pill button: ink tile by default, chalk face when primary, coral-tinted when destructive. */
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
  const fg = variant === 'p' ? '#0b0b0b' : variant === 'd' ? C.danger : C.inkSoft;
  const content = (
    <>
      {icon ? <Icon name={icon} size={16} color={fg} /> : null}
      <Text style={[s.smBtnText, { color: fg }]}>{label}</Text>
    </>
  );
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

/** A step of ink per person — stable, never a brand colour. */
function tintFor(name: string, C: Palette) {
  const tints = [C.g1, C.g2, C.g3, C.g4];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return tints[Math.abs(h) % tints.length]!;
}

/** A round initials avatar; `dark` makes it the chalk one. */
export function Avatar({ name, size = 40, dark }: { name: string | null | undefined; size?: number; dark?: boolean }) {
  const s = useKit();
  const C = useColors();
  return (
    <View
      style={[
        s.av,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: dark ? '#f4f3ee' : tintFor(name ?? '', C) },
      ]}>
      <Text style={[s.avText, { fontSize: size * 0.36 }, dark && { color: '#0b0b0b' }]}>{initials(name ?? '')}</Text>
    </View>
  );
}

/* ------------------------------------------------------- small pieces */

/** A small status pill: Folio's badge — a tonal fill and its colour. */
export function Badge({ label, variant = 'soft' }: { label: string; variant?: 'soft' | 'ink' | 'line' | 'danger' }) {
  const s = useKit();
  const C = useColors();
  return (
    <View style={[s.badge, variant === 'ink' && s.badgeInk, variant === 'line' && s.badgeLine, variant === 'danger' && s.badgeDanger]}>
      <Text style={[s.badgeText, variant === 'ink' && { color: '#0b0b0b' }, variant === 'danger' && { color: C.danger }]}>
        {label}
      </Text>
    </View>
  );
}

/** A chip; a chosen chip is the chalk pill, the way Folio selects. */
export function Chip({ label, on, icon, onPress }: { label: string; on?: boolean; icon?: IconName; onPress?: () => void }) {
  const s = useKit();
  const fg = on ? '#0b0b0b' : '#c9c8c2';
  const content = (
    <>
      {icon ? <Icon name={icon} size={14} color={fg} /> : null}
      <Text style={[s.chipText, { color: fg }]}>{label}</Text>
    </>
  );
  const look = { tint: on ? '#f4f3ee' : undefined, style: s.chip } as const;
  return onPress ? (
    <GlassPressable {...look} haptic={false} accessibilityState={{ selected: !!on }} onPress={onPress}>
      {content}
    </GlassPressable>
  ) : (
    <LiquidGlass {...look}>{content}</LiquidGlass>
  );
}

/**
 * One choice among a few, as a pill: the chalk face when it is the one
 * chosen, an ink tile with a hairline rim when it is not.
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
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ selected: on }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [s.pill, on && s.pillOn, pressed && s.pressed]}>
      {icon ? <Icon name={icon} size={14} color={on ? '#0b0b0b' : '#c9c8c2'} /> : null}
      <Text style={[s.pillText, on && { color: '#0b0b0b' }]}>{label}</Text>
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

/** A tile track with a chalk thumb on the chosen option. */
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
  return (
    <View style={[s.seg, style]} accessibilityRole="tablist">
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
            <Text style={[s.segText, on && { color: '#0b0b0b' }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** A round icon button: a bordered circle, the way Folio heads a screen. */
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
  const fg = color ?? (variant === 'ink' ? '#f4f3ee' : '#c9c8c2');
  const box = { width: size, height: size, borderRadius: size / 2 };
  const glyph = <Icon name={icon} size={Math.round(size * 0.46)} color={fg} />;
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

/** Nothing to show: an icon in a tile, a line, and what to do next. */
export function Empty({ icon, title, children }: { icon: IconName; title: string; children?: ReactNode }) {
  const s = useKit();
  return (
    <View style={s.empty}>
      <View style={s.emptyIc}>
        <Icon name={icon} size={25} color="#3ddc97" />
      </View>
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
    <View
      style={[s.notice, err && s.noticeErr, style]}
      accessibilityRole={err ? 'alert' : undefined}>
      <Icon name={icon ?? (err ? 'alert-circle-outline' : 'information-circle-outline')} size={18} color={err ? C.danger : C.inkSoft} />
      <Text style={[s.noticeText, err && { color: C.danger }]}>{children}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} accessibilityRole="button" hitSlop={8}>
          <Text style={[s.noticeAction, err && { color: C.danger }]}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** The app's toggle: mint track when on, the accent's own job. */
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
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      trackColor={{ false: '#262626', true: C.blue }}
      thumbColor="#f4f3ee"
      ios_backgroundColor="#262626"
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

const useKit = makeStyles((C) => ({
  grow: { flex: 1, minWidth: 0 },
  center: { textAlign: 'center' },
  rowsp: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rowfl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pressed: { backgroundColor: '#1d1d1d' },
  card: { padding: 16 },
  sur: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  lstClip: { borderRadius: Radius.panel - 1, overflow: 'hidden' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: C.soft2, marginLeft: 15, marginRight: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 15, minHeight: 62 },
  rowPressed: { backgroundColor: '#1d1d1d' },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { maxWidth: '58%', textAlign: 'right' },
  commit: {
    backgroundColor: C.commit,
    borderRadius: Radius.card,
    padding: 20,
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
  commitBtnText: { color: C.commitInk, fontFamily: Fonts.extrabold, fontSize: 14 },
  smBtn: {
    height: 38,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  smBtnP: { backgroundColor: '#f4f3ee' },
  smBtnD: { backgroundColor: 'rgba(255,107,87,0.13)' },
  smBtnText: { fontFamily: Fonts.extrabold, fontSize: 13 },
  av: { alignItems: 'center', justifyContent: 'center' },
  avText: { fontFamily: Fonts.extrabold, color: C.ink },
  badge: {
    height: 22,
    paddingHorizontal: 9,
    borderRadius: Radius.full,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  badgeInk: { backgroundColor: '#f4f3ee' },
  badgeLine: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.soft2 },
  badgeDanger: { backgroundColor: 'rgba(255,107,87,0.13)' },
  badgeText: { fontFamily: Fonts.extrabold, fontSize: 10.5, color: '#c9c8c2', textTransform: 'capitalize' },
  chip: { height: 34, paddingHorizontal: 13, borderRadius: 17, flexDirection: 'row', alignItems: 'center', gap: 6 },
  chipText: { fontFamily: Fonts.bold, fontSize: 13 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 15,
    minHeight: 38,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#161616',
  },
  pillOn: { backgroundColor: '#f4f3ee', borderColor: '#f4f3ee' },
  pillText: { fontFamily: Fonts.bold, fontSize: 13.5, color: '#c9c8c2' },
  bleed: { marginHorizontal: -20, flexGrow: 0 },
  rail: { gap: 8, paddingHorizontal: 20, paddingVertical: 2 },
  seg: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#161616',
  },
  segBtn: { flex: 1, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17 },
  segOn: { backgroundColor: '#f4f3ee', borderRadius: 17 },
  segText: { fontFamily: Fonts.bold, fontSize: 12.5, color: '#8b8a85' },
  iconBtn: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  iconBtnInk: { backgroundColor: '#f4f3ee', borderWidth: 0 },
  sec: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 30, marginBottom: 12 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 36, paddingHorizontal: 24 },
  emptyIc: {
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#161616',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAction: { alignSelf: 'stretch', marginTop: 10 },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: Radius.field,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#111111',
  },
  noticeErr: { borderColor: 'rgba(255,107,87,0.2)', backgroundColor: 'rgba(255,107,87,0.09)' },
  noticeText: { flex: 1, fontFamily: Fonts.regular, fontSize: 12.5, lineHeight: 18, color: C.inkSoft },
  noticeAction: { fontFamily: Fonts.bold, fontSize: 13, color: C.ink },
  sk: { backgroundColor: '#1d1d1d', borderRadius: 12 },
}));
