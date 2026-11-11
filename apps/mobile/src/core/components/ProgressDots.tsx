import { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { makeStyles, Motion, Spacing } from '@/core/theme';
import { useReduceMotion } from '@/core/use-reduce-motion';

/** A small centred step bar; the current step's segment fills in on arrival. */
export function ProgressDots({ step, total, style }: { step: number; total: number; style?: ViewStyle }) {
  const styles = useStyles();
  return (
    <View style={[styles.row, style]} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: total, now: step }}>
      {Array.from({ length: total }, (_, index) => (
        <View key={index} style={[styles.segment, index === step - 1 && styles.current]}>
          {index < step ? <Fill current={index === step - 1} /> : null}
        </View>
      ))}
    </View>
  );
}

function Fill({ current }: { current: boolean }) {
  const styles = useStyles();
  const reduce = useReduceMotion();
  const p = useSharedValue(current && !reduce ? 0 : 1);

  useEffect(() => {
    if (current && !reduce) p.set(withDelay(180, withTiming(1, { duration: 620, easing: Motion.out })));
  }, [current, reduce, p]);

  const style = useAnimatedStyle(() => ({ width: `${p.get() * 100}%` }));
  return <Animated.View style={[styles.fill, style]} />;
}

const useStyles = makeStyles((C, scheme) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + 1 },
  segment: {
    width: 20,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.12)' : C.soft2,
  },
  // The step you are on reads as the one to look at: longer and thicker.
  current: { width: 34, height: 5, borderRadius: 3 },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: scheme === 'dark' ? C.fieldText : C.blue600,
    boxShadow: scheme === 'dark' ? '0 0 8px rgba(77,169,252,0.7)' : undefined,
  },
}));
