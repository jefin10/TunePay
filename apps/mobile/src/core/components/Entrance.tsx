import { Children, isValidElement, type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Motion } from '@/core/theme';
import { useReduceMotion } from '@/core/use-reduce-motion';

const rise = (delay: number, distance: number) =>
  FadeInDown.delay(delay)
    .duration(Motion.rise)
    .easing(Motion.out)
    .withInitialValues({ opacity: 0, transform: [{ translateY: distance }] });

/** Rises in on mount: fade + lift, once. Honors reduced motion. */
export function Entrance({
  children,
  delay = 0,
  distance = 18,
  style,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reduce = useReduceMotion();
  return (
    <Animated.View style={style} entering={reduce ? undefined : rise(delay, distance)}>
      {children}
    </Animated.View>
  );
}

/** Rises each child in on mount, one beat after the other. */
export function Stagger({ children, delay = 90, step = 70 }: { children: ReactNode; delay?: number; step?: number }) {
  const reduce = useReduceMotion();
  if (reduce) return <>{children}</>;
  return (
    <>
      {Children.toArray(children).map((child, i) => {
        // Carry a flex child's flex onto its wrapper so layouts that fill the
        // remaining space keep doing so.
        const flex = isValidElement<{ style?: StyleProp<ViewStyle> }>(child)
          ? StyleSheet.flatten(child.props.style)?.flex
          : undefined;
        return (
          <Animated.View
            key={isValidElement(child) && child.key != null ? child.key : i}
            style={flex ? { flex } : undefined}
            entering={rise(delay + Math.min(i, 8) * step, 18)}>
            {child}
          </Animated.View>
        );
      })}
    </>
  );
}
