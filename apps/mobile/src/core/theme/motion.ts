import { Easing } from 'react-native-reanimated';

/**
 * One motion language for the whole app: a single strong ease-out and a
 * small set of durations.
 */
export const Motion = {
  /** Strong ease-out — fast start, soft settle. The app-wide default. */
  out: Easing.bezier(0.23, 1, 0.32, 1),
  /** Natural acceleration/deceleration for on-screen movement. */
  inOut: Easing.bezier(0.77, 0, 0.175, 1),
  /** The shaded ground gliding between poses. */
  morph: Easing.bezier(0.33, 0, 0.2, 1),

  press: 120,
  fast: 180,
  medium: 260,
  rise: 520,
  enter: 620,
} as const;
