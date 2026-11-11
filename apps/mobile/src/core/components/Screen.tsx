import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { RefreshControl, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { makeStyles, Radius, useColors, useScheme } from '@/core/theme';

import { useText } from './AppText';
import { IconButton } from './Kit';
import { KeyboardLift } from './KeyboardLift';

/** Room left under a tab screen's content for the floating dock. */
export const DOCK_SPACE = 118;

/** How far content scrolls under the status bar before its scrim is in. */
const SCRIM_RAMP = 28;

/**
 * A scrolling app screen over the shared ground. Content runs under the
 * status bar; a scrim fades in behind the bar only once content is beneath
 * it. `docked` leaves room for the floating dock. Pass `onRefresh` for
 * pull-to-refresh.
 */
export function Screen({
  children,
  docked,
  refreshing = false,
  onRefresh,
  contentStyle,
  footer,
  scroll = true,
}: {
  children: ReactNode;
  docked?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
  /** Pinned under the content, lifted above the keyboard (an ActionBar). */
  footer?: ReactNode;
  scroll?: boolean;
}) {
  const C = useColors();
  const scheme = useScheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });
  const scrim = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.get(), [0, SCRIM_RAMP], [0, 1], Extrapolation.CLAMP),
  }));

  const body = scroll ? (
    <Animated.ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 8 },
        docked && { paddingBottom: DOCK_SPACE },
        !footer && !docked && { paddingBottom: insets.bottom + 32 },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.ink}
            colors={[C.ink]}
            progressBackgroundColor={C.white}
            progressViewOffset={insets.top}
          />
        ) : undefined
      }>
      {children}
    </Animated.ScrollView>
  ) : (
    <View style={[styles.content, styles.fill, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={styles.fill}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardLift style={styles.fill}>
        {body}
        {footer}
      </KeyboardLift>
      <Animated.View pointerEvents="none" style={[styles.scrim, { height: insets.top + 6 }, scrim]}>
        <LinearGradient
          colors={[`${C.ground}E6`, `${C.ground}99`, `${C.ground}00`]}
          locations={[0, 0.72, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

/**
 * The header row: back / centred label / actions. `large` sets the title in
 * the light display size under the row instead, for a screen's own heading.
 */
export function TopNav({
  title,
  large,
  back = true,
  onBack,
  left,
  right,
}: {
  title?: string;
  large?: boolean;
  back?: boolean;
  onBack?: () => void;
  left?: ReactNode;
  right?: ReactNode;
}) {
  const styles = useStyles();
  const t = useText();
  return (
    <View style={styles.navWrap}>
      <View style={styles.nav}>
        {back ? (
          <IconButton icon="chevron-back" onPress={onBack ?? (() => router.back())} accessibilityLabel="Back" />
        ) : (
          left
        )}
        <View style={[styles.grow, styles.center]}>
          {title && !large ? (
            <Text style={t.lab} numberOfLines={1} accessibilityRole="header">
              {title}
            </Text>
          ) : null}
        </View>
        <View style={styles.right}>{right ?? (back ? <View style={styles.spacer} /> : null)}</View>
      </View>
      {large && title ? (
        <View style={styles.large}>
          <Text style={t.t1} accessibilityRole="header">
            {title}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/** A static bottom bar for primary actions on non-docked screens. */
export function ActionBar({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  return <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 12) + 6 }]}>{children}</View>;
}

/** Sheets and the action bar carry content over a busy ground. In light they
 * are thick glass, near-opaque with a lit top edge; in dark they are solid,
 * the way iOS raises a sheet, with only a quiet top edge. */
export const sheetSurface = (scheme: 'light' | 'dark') => ({
  backgroundColor: scheme === 'dark' ? '#15191F' : 'rgba(250,251,253,0.985)',
  boxShadow:
    scheme === 'dark'
      ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 -24px 60px -30px #000000'
      : 'inset 0 1px 0 rgba(255,255,255,0.95), 0 -24px 60px -34px #0A0A0B8C',
});

const useStyles = makeStyles((_C, scheme) => ({
  fill: { flex: 1 },
  grow: { flex: 1, minWidth: 0 },
  center: { alignItems: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  navWrap: { marginBottom: 12 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 42 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spacer: { width: 42 },
  large: { marginTop: 18, gap: 4 },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0 },
  actionBar: {
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: Radius.sheet,
    borderTopRightRadius: Radius.sheet,
    borderCurve: 'continuous',
    gap: 10,
    ...sheetSurface(scheme),
  },
}));
