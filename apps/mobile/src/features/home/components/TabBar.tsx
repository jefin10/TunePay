import { BlurTargetView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BlurTargetContext, LiquidGlass } from '@/core/components';
import { Fonts, makeStyles, Radius, useColors } from '@/core/theme';
import { useReduceMotion } from '@/core/use-reduce-motion';

import { DockIcon, type DockIconName } from './DockIcon';

const TABS: Record<string, { label: string; icon: DockIconName; a11y: string }> = {
  home: { label: 'Home', icon: 'home', a11y: 'Home' },
  voice: { label: 'Voice', icon: 'voice', a11y: 'Voice assistant' },
  profile: { label: 'Profile', icon: 'profile', a11y: 'Profile' },
};

const SLIDE_MS = 380;

/**
 * Each tab's screen is its own blur target, keyed by tab name.
 *
 * The dock blurs what scrolls under it, and a BlurView cannot sit inside the
 * view it samples — so the page is the target and the dock, a sibling of the
 * pages, is the blur. Only the tab on show has one to ask for.
 */
type Target = RefObject<ComponentRef<typeof View> | null>;
const sceneTargets = new Map<string, Target>();
const targetListeners = new Set<() => void>();
const subscribeTargets = (listener: () => void) => {
  targetListeners.add(listener);
  return () => {
    targetListeners.delete(listener);
  };
};
const changed = () => targetListeners.forEach((listener) => listener());

export function TabScene({ name, children }: { name: string; children: ReactNode }) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  // Layout, so the ref is attached by the time the dock is told; the dock
  // listens, because the page it is blurring may mount after the dock does.
  useLayoutEffect(() => {
    sceneTargets.set(name, ref);
    changed();
    return () => {
      sceneTargets.delete(name);
      changed();
    };
  }, [name]);
  return (
    <BlurTargetView ref={ref} style={styles.fill}>
      {children}
    </BlurTargetView>
  );
}

/** A floating plate of three tabs: Home, Voice and Profile. The tab you are
 * on is marked by the pop face — chalk on ink, ink on paper — that slides
 * onto it and inverts the icon and label inside it; everything else stays
 * dim. */
const DOCK_RADIUS = Platform.OS === 'android' ? 28 : Radius.full;
const ITEM_RADIUS = Platform.OS === 'android' ? 24 : Radius.full;

export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const C = useColors();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const [slots, setSlots] = useState<Record<string, { x: number; width: number }>>({});

  const activeKey = state.routes[state.index]?.name;
  const slot = activeKey ? slots[activeKey] : undefined;
  // The page the blur reads: the one on show, once it has mounted.
  const blurTarget = useSyncExternalStore(
    subscribeTargets,
    () => (activeKey ? sceneTargets.get(activeKey) : undefined) ?? null,
    () => null,
  );

  const measure = (name: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setSlots((held) => (held[name]?.x === x && held[name]?.width === width ? held : { ...held, [name]: { x, width } }));
  };

  return (
    <View pointerEvents="box-none" style={[styles.host, { bottom: Math.max(insets.bottom, 12) + 6 }]}>
      <BlurTargetContext.Provider value={blurTarget}>
        <LiquidGlass
          radius={DOCK_RADIUS}
          reach={0.12}
          weight="strong"
          tint={C.white}
          style={styles.dock}>
          {/* The row is its own box so the capsule and the measured slots
              share one origin — no padding sits between them. */}
          <View style={styles.row}>
            {/* Placed straight from the measured slot and moved with a CSS
                transition, so the active tab is marked from the first frame. */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.capsule,
                {
                  width: slot?.width ?? 0,
                  opacity: slot ? 1 : 0,
                  transform: [{ translateX: slot?.x ?? 0 }],
                  transitionProperty: ['width', 'transform', 'opacity'],
                  transitionDuration: reduce ? 0 : SLIDE_MS,
                  transitionTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
                },
              ]}
            />
            {state.routes.map((route, index) => {
              const meta = TABS[route.name];
              if (!meta) return null;
              const focused = state.index === index;
              // Inside the ink capsule the pair inverts; outside it both stay
              // grey — a lighter grey on the dark dock's lit glass, so they still read.
              const tint = focused ? C.popInk : C.inkSoft;
              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: focused }}
                  accessibilityLabel={meta.a11y}
                  onLayout={measure(route.name)}
                  onPress={() => {
                    if (focused) return;
                    Haptics.selectionAsync();
                    navigateToTab(route.key);
                  }}
                  style={styles.item}>
                  <DockIcon name={meta.icon} active={focused} color={tint} />
                  <Text style={[styles.label, { color: tint }]}>{meta.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </LiquidGlass>
      </BlurTargetContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });

const useStyles = makeStyles((C) => ({
  host: { position: 'absolute', left: 16, right: 16 },
  dock: { padding: 5 },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  capsule: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: C.popFace,
    borderRadius: ITEM_RADIUS,
    borderCurve: 'continuous',
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 8 },
  label: { fontFamily: Fonts.bold, fontSize: 11, letterSpacing: 0.1 },
}));
