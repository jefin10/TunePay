import { usePathname } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Motion, Palettes, useScheme, type Scheme } from '@/core/theme';
import { useReduceMotion } from '@/core/use-reduce-motion';

/** Where a sheet sits on a given page: offset (in shade units), rotation
 * (degrees, about the sheet's pivot) and scale. */
type Pose = { x: number; y: number; r: number; s: number };

/** A page's arrangement: both sheets' poses, and how strongly the blue
 * light shows (1 = full). */
type Scene = { fold: Pose; rise: Pose; glow: number };

const p = (x: number, y: number, r: number, s = 1): Pose => ({ x, y, r, s });

// One composition, re-posed per page: the sheets glide to each screen's
// arrangement and the light swells or dims. Sign-in progresses one way.
const SCENES: Record<string, Scene> = {
  '/': { fold: p(0.04, -0.06, -4, 1.04), rise: p(0.06, 0.1, 0), glow: 0.8 },
  '/biometric': { fold: p(0, 0, 0), rise: p(0, 0, 0), glow: 1 },
  '/phone': { fold: p(0.05, -0.05, -3, 1.03), rise: p(0.04, 0.04, 2), glow: 0.9 },
  '/verify-otp': { fold: p(0.19, -0.07, -12, 1.12), rise: p(-0.08, -0.04, 8, 1.1), glow: 0.75 },
  '/name-entry': { fold: p(-0.1, -0.06, 8, 1.08), rise: p(-0.02, 0, -5, 1.05), glow: 0.8 },
};

// The app behind its glass: calmer poses with less light, so content reads
// first. Each tab has its own; deeper screens share one per section.
const APP_SCENES: Record<string, Scene> = {
  '/home': { fold: p(-0.1, -0.05, 8, 1.07), rise: p(-0.05, 0.01, -5, 1.05), glow: 0.7 },
  '/voice': { fold: p(0.03, -0.1, -2, 1.12), rise: p(-0.02, 0.08, 1, 1.1), glow: 0.6 },
  '/profile': { fold: p(-0.12, -0.08, 9, 1.08), rise: p(-0.02, 0.06, -4, 1.03), glow: 0.5 },
  '/pay': { fold: p(0.1, -0.06, -6, 1.06), rise: p(-0.04, 0.04, 5, 1.05), glow: 0.6 },
};
const FALLBACK: Scene = { fold: p(0.05, -0.08, -5, 1.06), rise: p(0.02, 0.06, 3, 1.02), glow: 0.55 };

function sceneFor(pathname: string): Scene {
  return SCENES[pathname] ?? APP_SCENES[`/${pathname.split('/')[1]}`] ?? FALLBACK;
}

/** Everything the shading draws with, per scheme: dark is black with
 * light-blue light; light is a pale ground with sky-blue light, white rims,
 * and a faint navy shadow under each rim so the edges still read. */
interface Shade {
  base: [string, string, string];
  light: [number, string, number][];
  foldShade: [string, number, number];
  rim: string;
  bloom: number;
  rimShadow: number;
  riseRear: [string, number];
  riseFront: [string, number, string, number];
  riseRim: number;
}

const SHADES: Record<Scheme, Shade> = {
  dark: {
    base: ['#12151B', '#0B0D11', '#060709'],
    light: [
      [0, '#8CC8FF', 0.95],
      [0.16, '#4DA9FC', 0.78],
      [0.38, '#2E90F0', 0.4],
      [0.66, '#1D5FA8', 0.12],
      [1, '#1D5FA8', 0],
    ],
    foldShade: ['#000000', 0.45, 0.15],
    rim: '#A9D8FF',
    bloom: 0.16,
    rimShadow: 0,
    riseRear: ['#2E90F0', 0.1],
    riseFront: ['#4DA9FC', 0.3, '#2E90F0', 0.12],
    riseRim: 0.75,
  },
  light: {
    base: ['#F7F9FC', '#EEF2F7', '#E4E9F0'],
    light: [
      [0, '#7FBEFF', 0.62],
      [0.16, '#9CCBFF', 0.5],
      [0.38, '#C2DFFF', 0.36],
      [0.66, '#DDEBFA', 0.14],
      [1, '#DDEBFA', 0],
    ],
    foldShade: ['#1C2B45', 0.07, 0.025],
    rim: '#FFFFFF',
    bloom: 0.55,
    rimShadow: 0.12,
    riseRear: ['#7FBEFF', 0.12],
    riseFront: ['#7FBEFF', 0.3, '#B7D9FF', 0.14],
    riseRim: 1,
  },
};

/** Only the first screens — the unlock and the phone number — keep the
 * shading; every other screen sits on a plain ground so its content is all
 * there is to read. */
function isShaded(pathname: string) {
  return pathname === '/biometric' || pathname === '/phone';
}

const GROUND_MS = 350;
const MORPH_MS = 1100;

/** The shade unit: screen width on phones, capped on squarer screens so the
 * sheets keep the same proportions instead of swallowing the page. */
function useShadeUnit() {
  const { width, height } = useWindowDimensions();
  return { width, height, u: Math.min(width, height * 0.62) };
}

/** Animate to a new value on route change — or jump there under Reduce Motion. */
function useMorph(value: number, reduce: boolean) {
  const v = useSharedValue(value);
  useEffect(() => {
    v.set(reduce ? value : withTiming(value, { duration: MORPH_MS, easing: Motion.morph }));
  }, [value, reduce, v]);
  return v;
}

/**
 * A ground shaded by curved sheets of light — a fold lying over a lit plane at
 * the top, layered sheets rising from the bottom — rather than a soft
 * gradient: near-black with light blue in dark mode, pale with sky blue in
 * light. Mounted once behind the navigator, it follows the route: on every
 * screen change the sheets glide to that page's pose and the light swells or
 * dims, while the screens (transparent) cross-fade on top.
 */
export function FieldBackdrop() {
  const pathname = usePathname();
  const scene = sceneFor(pathname);
  const scheme = useScheme();
  const shade = SHADES[scheme];
  const reduce = useReduceMotion();
  // Sized to the window, not the parent: on Android the keyboard shrinks the
  // root view, and the ground must not re-lay out (or lag) under it.
  const { width, height } = useWindowDimensions();

  const glow = useMorph(scene.glow, reduce);

  // The shading fades over the plain ground in step with the screens'
  // cross-fade, rather than the slow glide the sheets take between poses.
  const shaded = isShaded(pathname);
  const presence = useSharedValue(shaded ? 1 : 0);
  useEffect(() => {
    presence.set(reduce ? (shaded ? 1 : 0) : withTiming(shaded ? 1 : 0, { duration: GROUND_MS, easing: Motion.morph }));
  }, [shaded, reduce, presence]);
  const presenceStyle = useAnimatedStyle(() => ({ opacity: presence.get() }));

  // Off the shaded screens the sheets are not drawn at all once they have
  // faded: they breathe forever, and nobody should pay for that on a plain screen.
  const [drawn, setDrawn] = useState(shaded);
  if (shaded && !drawn) setDrawn(true);
  useEffect(() => {
    if (shaded) return;
    const timer = setTimeout(() => setDrawn(false), GROUND_MS + 50);
    return () => clearTimeout(timer);
  }, [shaded]);

  return (
    <View style={[styles.ground, { width, height, backgroundColor: Palettes[scheme].ground }]} pointerEvents="none">
      {drawn ? (
        <Animated.View style={[StyleSheet.absoluteFill, presenceStyle]}>
          <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
            <Defs>
              <LinearGradient id="shade-base" x1="0" y1="0" x2="0.12" y2="1">
                <Stop offset="0" stopColor={shade.base[0]} />
                <Stop offset="0.5" stopColor={shade.base[1]} />
                <Stop offset="1" stopColor={shade.base[2]} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width={width} height={height} fill="url(#shade-base)" />
          </Svg>
          <Sheet pose={scene.fold} drift={[14, -8, 1.2]} period={15000} reduce={reduce}>
            {(frame) => <Fold frame={frame} glow={glow} shade={shade} />}
          </Sheet>
          <Sheet pose={scene.rise} drift={[-10, 8, -1]} period={17000} reduce={reduce} anchor="bottom">
            {(frame) => <Rise frame={frame} shade={shade} />}
          </Sheet>
        </Animated.View>
      ) : null}
    </View>
  );
}

/** The drawing box of one sheet, in screen coordinates, centred on its pivot. */
type Frame = { x: number; y: number; w: number; h: number; px: number; py: number; u: number };

function Sheet({
  pose,
  drift,
  period,
  reduce,
  anchor = 'top',
  children,
}: {
  pose: Pose;
  /** Idle breathing amplitude: x px, y px, degrees. */
  drift: [number, number, number];
  period: number;
  reduce: boolean;
  anchor?: 'top' | 'bottom';
  children: (frame: Frame) => ReactNode;
}) {
  const { width, height, u } = useShadeUnit();

  // Pivot, and a box large enough that no pose ever shows its edges.
  const px = anchor === 'top' ? width / 2 : width * 0.8;
  const py = anchor === 'top' ? u * 0.1 : height - u * 0.1;
  const w = u * 2.2;
  const h = u * (anchor === 'top' ? 1.5 : 1.6);
  const frame: Frame = { x: px - w / 2, y: py - h / 2, w, h, px, py, u };

  const x = useMorph(pose.x, reduce);
  const y = useMorph(pose.y, reduce);
  const r = useMorph(pose.r, reduce);
  const s = useMorph(pose.s, reduce);
  const breath = useSharedValue(0);

  // A slow idle drift underneath, so a page at rest still breathes.
  useEffect(() => {
    if (reduce) {
      breath.set(0);
      return;
    }
    breath.set(withDelay(600, withRepeat(withTiming(1, { duration: period, easing: Easing.inOut(Easing.sin) }), -1, true)));
  }, [reduce, period, breath]);

  const style = useAnimatedStyle(() => {
    const b = breath.get();
    return {
      transform: [
        { translateX: x.get() * u + b * drift[0] },
        { translateY: y.get() * u + b * drift[1] },
        { rotate: `${r.get() + b * drift[2]}deg` },
        { scale: s.get() },
      ],
    };
  });

  return (
    <Animated.View style={[styles.sheet, { left: frame.x, top: frame.y, width: w, height: h }, style]}>
      {children(frame)}
    </Animated.View>
  );
}

/** One full-size SVG layer of a sheet, drawn in screen coordinates. */
function Layer({ frame, children }: { frame: Frame; children: ReactNode }) {
  return (
    <Svg style={StyleSheet.absoluteFill} width={frame.w} height={frame.h} viewBox={`${frame.x} ${frame.y} ${frame.w} ${frame.h}`}>
      {children}
    </Svg>
  );
}

/** Top: a fold with a bright rim, lying over a pool of blue light that falls
 * off fast into the ground. */
function Fold({ frame, glow, shade }: { frame: Frame; glow: SharedValue<number>; shade: Shade }) {
  const { px, py, u } = frame;
  const P = (dx: number, dy: number) => `${px + dx * u} ${py + dy * u}`;
  // The fold's curved edge: steep from above the screen, sweeping out flat.
  const edge = `M ${P(-0.22, -0.5)} C ${P(-0.17, -0.06)} ${P(-0.03, 0.2)} ${P(0.2, 0.26)} C ${P(0.45, 0.31)} ${P(0.72, 0.3)} ${P(1.05, 0.27)}`;
  // Everything on the lit side of the edge; the fold side stays the ground.
  const lit = `${edge} L ${P(1.1, 0.27)} L ${P(1.1, 0.75)} L ${P(-1.1, 0.75)} L ${P(-1.1, -0.75)} L ${P(-0.22, -0.75)} Z`;
  const fold = `${edge} L ${P(1.1, 0.27)} L ${P(1.1, -0.75)} L ${P(-0.22, -0.75)} Z`;

  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.get() }));

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle]}>
        <Layer frame={frame}>
          <Defs>
            <RadialGradient
              id="fold-light"
              cx={px - 0.18 * u}
              cy={py - 0.02 * u}
              rx={0.72 * u}
              ry={0.52 * u}
              gradientUnits="userSpaceOnUse">
              {shade.light.map(([offset, color, opacity]) => (
                <Stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
              ))}
            </RadialGradient>
          </Defs>
          <Path d={lit} fill="url(#fold-light)" />
        </Layer>
      </Animated.View>
      <Layer frame={frame}>
        <Defs>
          {/* The fold darkens just past its edge — the shade that sets off the rim. */}
          <LinearGradient
            id="fold-shade"
            x1={px + 0.05 * u}
            y1={py + 0.26 * u}
            x2={px + 0.3 * u}
            y2={py - 0.2 * u}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={shade.foldShade[0]} stopOpacity={shade.foldShade[1]} />
            <Stop offset="0.5" stopColor={shade.foldShade[0]} stopOpacity={shade.foldShade[2]} />
            <Stop offset="1" stopColor={shade.foldShade[0]} stopOpacity={0} />
          </LinearGradient>
          <LinearGradient
            id="fold-rim"
            x1={px - 0.22 * u}
            y1={py - 0.4 * u}
            x2={px + 0.9 * u}
            y2={py + 0.27 * u}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={shade.rim} stopOpacity={0.3} />
            <Stop offset="0.3" stopColor={shade.rim} stopOpacity={1} />
            <Stop offset="0.62" stopColor={shade.rim} stopOpacity={0.4} />
            <Stop offset="1" stopColor={shade.rim} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={fold} fill="url(#fold-shade)" />
        {shade.rimShadow ? (
          <Path d={edge} stroke="#1C2B45" strokeOpacity={shade.rimShadow} strokeWidth={4} fill="none" />
        ) : null}
        {/* A wide faint stroke under the hairline stands in for bloom. */}
        <Path d={edge} stroke="url(#fold-rim)" strokeWidth={10} strokeOpacity={shade.bloom} fill="none" />
        <Path d={edge} stroke="url(#fold-rim)" strokeWidth={1.5} fill="none" />
      </Layer>
    </>
  );
}

/** Bottom: two sheets rising from the right, the nearer one lit along its
 * crest and falling off into the ground. */
function Rise({ frame, shade }: { frame: Frame; shade: Shade }) {
  const { px, py, u } = frame;
  const P = (dx: number, dy: number) => `${px + dx * u} ${py + dy * u}`;
  const rearEdge = `M ${P(-0.98, 0.14)} C ${P(-0.52, -0.2)} ${P(-0.1, -0.46)} ${P(0.6, -0.55)}`;
  const rear = `${rearEdge} L ${P(0.6, 0.8)} L ${P(-0.98, 0.8)} Z`;
  const frontEdge = `M ${P(-0.42, 0.24)} C ${P(-0.2, -0.08)} ${P(0.04, -0.26)} ${P(0.6, -0.33)}`;
  const front = `${frontEdge} L ${P(0.6, 0.8)} L ${P(-0.42, 0.8)} Z`;

  return (
    <Layer frame={frame}>
      <Defs>
        <LinearGradient id="rise-rear" x1={px - 0.2 * u} y1={py - 0.5 * u} x2={px - 0.3 * u} y2={py + 0.1 * u} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={shade.riseRear[0]} stopOpacity={shade.riseRear[1]} />
          <Stop offset="1" stopColor={shade.riseRear[0]} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="rise-front" x1={px + 0.2 * u} y1={py - 0.3 * u} x2={px - 0.05 * u} y2={py + 0.2 * u} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={shade.riseFront[0]} stopOpacity={shade.riseFront[1]} />
          <Stop offset="0.35" stopColor={shade.riseFront[2]} stopOpacity={shade.riseFront[3]} />
          <Stop offset="1" stopColor={shade.riseFront[2]} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="rise-rim" x1={px - 0.42 * u} y1={py} x2={px + 0.6 * u} y2={py} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={shade.rim} stopOpacity={0} />
          <Stop offset="0.55" stopColor={shade.rim} stopOpacity={shade.riseRim} />
          <Stop offset="1" stopColor={shade.rim} stopOpacity={shade.riseRim * 0.55} />
        </LinearGradient>
        <LinearGradient id="rise-rear-rim" x1={px - 0.98 * u} y1={py} x2={px + 0.6 * u} y2={py} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={shade.rim} stopOpacity={0} />
          <Stop offset="0.6" stopColor={shade.rim} stopOpacity={0.2} />
          <Stop offset="1" stopColor={shade.rim} stopOpacity={0.08} />
        </LinearGradient>
      </Defs>
      <Path d={rear} fill="url(#rise-rear)" />
      <Path d={rearEdge} stroke="url(#rise-rear-rim)" strokeWidth={1} fill="none" />
      <Path d={front} fill="url(#rise-front)" />
      {shade.rimShadow ? (
        <Path d={frontEdge} stroke="#1C2B45" strokeOpacity={shade.rimShadow * 0.8} strokeWidth={4} fill="none" />
      ) : null}
      <Path d={frontEdge} stroke="url(#rise-rim)" strokeWidth={8} strokeOpacity={shade.bloom * 0.9} fill="none" />
      <Path d={frontEdge} stroke="url(#rise-rim)" strokeWidth={1.2} fill="none" />
    </Layer>
  );
}

const styles = StyleSheet.create({
  ground: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
  sheet: { position: 'absolute' },
});
