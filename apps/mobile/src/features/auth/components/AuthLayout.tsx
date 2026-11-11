import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton, KeyboardLift, LiquidGlass, ProgressDots, Stagger } from '@/core/components';
import { Fonts, makeStyles, MaxContentWidth, Motion, Spacing, useColors, useScheme } from '@/core/theme';
import { useReduceMotion } from '@/core/use-reduce-motion';

/** The floating header row: 8 above, 42 tall. */
const HEADER_HEIGHT = Spacing.two + 42;
/** How far content scrolls under a bar before the bar's scrim is fully in. */
const SCRIM_RAMP = 36;
/** How far past a bar its scrim fades out. */
const SCRIM_FADE = 40;

/**
 * The sign-in screens: the shared ground, a floating header (back, step bar),
 * a big light heading, staggered content and a floating action. Content runs
 * edge to edge under the status bar, the header and the action; a scrim fades
 * in behind a bar only while content is under it. Content holds to one
 * readable column, centred on tablets.
 */
export function AuthLayout({
  step,
  total = 3,
  title,
  children,
  footer,
  top,
}: {
  step?: number;
  total?: number;
  title: string;
  children?: ReactNode;
  /** Floats over the bottom of the screen — no sheet behind it. */
  footer: ReactNode;
  /** Shown over the heading (the wordmark on the first screen). */
  top?: ReactNode;
}) {
  const styles = useStyles();
  const scheme = useScheme();
  const reduce = useReduceMotion();
  const insets = useSafeAreaInsets();
  // Scrims fade to the ground's own colour, light or dark.
  const INK = useColors().fieldInkTo;
  const [footerHeight, setFooterHeight] = useState(0);
  // A flow resumed by `replace` has nothing behind it.
  const canGoBack = router.canGoBack();

  const scrollY = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const viewHeight = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });

  const topScrim = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.get(), [0, SCRIM_RAMP], [0, 1], Extrapolation.CLAMP),
  }));
  const bottomScrim = useAnimatedStyle(() => {
    const below = contentHeight.get() - viewHeight.get() - scrollY.get();
    return { opacity: interpolate(below, [0, SCRIM_RAMP], [0, 1], Extrapolation.CLAMP) };
  });

  const topSpace = insets.top + HEADER_HEIGHT;
  const bottomSpace = footerHeight + insets.bottom;

  return (
    <View style={styles.fill}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {/* Lifts the floating action above the keyboard on both platforms. */}
      <KeyboardLift style={styles.fill}>
        <Animated.ScrollView
          style={styles.fill}
          contentContainerStyle={[styles.scrollContent, { paddingTop: topSpace, paddingBottom: bottomSpace + Spacing.four }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onLayout={(e) => viewHeight.set(e.nativeEvent.layout.height)}
          onContentSizeChange={(_, h) => contentHeight.set(h)}>
          <View style={[styles.body, styles.column]}>
            <Stagger>
              {top}
              <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header">
                  {title}
                </Text>
              </View>
              {children}
            </Stagger>
          </View>
        </Animated.ScrollView>

        {/* Scrims keep the bars legible over content passing under them; at
            rest they are invisible, so the shaded ground shows untouched. */}
        <Animated.View pointerEvents="none" style={[styles.scrimTop, { height: topSpace + SCRIM_FADE }, topScrim]}>
          <LinearGradient
            colors={[`${INK}F2`, `${INK}D9`, `${INK}00`]}
            locations={[0, topSpace / (topSpace + SCRIM_FADE), 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.scrimBottom, { height: bottomSpace + 32 }, bottomScrim]}>
          <LinearGradient colors={[`${INK}00`, `${INK}B3`, `${INK}F2`]} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
        </Animated.View>

        <View style={[styles.headerWrap, { paddingTop: insets.top }]} pointerEvents="box-none">
          <View style={[styles.bar, styles.column]} pointerEvents="box-none">
            <View style={styles.side} pointerEvents="box-none">
              {canGoBack ? <IconButton icon="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} /> : null}
            </View>
            {step ? (
              <LiquidGlass bevel={false} style={styles.stepPill}>
                <ProgressDots step={step} total={total} />
              </LiquidGlass>
            ) : null}
            <View style={[styles.side, styles.sideRight]} pointerEvents="box-none" />
          </View>
        </View>

        <Animated.View
          style={[styles.footer, { paddingBottom: insets.bottom + Spacing.three }]}
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height - insets.bottom)}
          entering={reduce ? undefined : FadeInDown.delay(260).duration(560).easing(Motion.out)}>
          <View style={[styles.column, styles.footerStack]}>{footer}</View>
        </Animated.View>
      </KeyboardLift>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  fill: { flex: 1 },
  column: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  stepPill: { height: 30, paddingHorizontal: 12, justifyContent: 'center' },
  headerWrap: { position: 'absolute', top: 0, left: 0, right: 0 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 42,
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  // Equal-width sides keep the step bar centred whatever sits on the right.
  side: { flex: 1, flexDirection: 'row' },
  sideRight: { justifyContent: 'flex-end' },
  scrollContent: { flexGrow: 1, paddingHorizontal: Spacing.four },
  body: { flex: 1, marginTop: Spacing.five },
  header: { marginBottom: 32, gap: 12 },
  title: {
    fontSize: 30,
    lineHeight: 34,
    color: C.fieldText,
    fontFamily: Fonts.light,
    letterSpacing: -0.4,
  },
  scrimTop: { position: 'absolute', top: 0, left: 0, right: 0 },
  scrimBottom: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  footerStack: { gap: Spacing.two },
}));
