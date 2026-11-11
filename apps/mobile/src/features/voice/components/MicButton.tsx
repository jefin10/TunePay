import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

import { Icon } from '@/core/components';
import { Colors, makeStyles, Motion, useColors } from '@/core/theme';
import { useReduceMotion } from '@/core/use-reduce-motion';

const SIZE = 96;
const RING_MS = 1600;

/**
 * The microphone: an ink disc. While it listens it turns blue and sends out
 * rings of light — the same blue as the light on the shaded ground — and it
 * presses down like every other button.
 */
export function MicButton({
  listening,
  disabled,
  onPress,
  accessibilityLabel,
}: {
  listening: boolean;
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const C = useColors();
  const styles = useStyles();
  const reduce = useReduceMotion();
  const press = useSharedValue(1);
  const discStyle = useAnimatedStyle(() => ({ transform: [{ scale: press.get() }] }));

  return (
    <View style={styles.wrap}>
      {listening && !reduce ? (
        <>
          <Ring delay={0} />
          <Ring delay={RING_MS / 2} />
        </>
      ) : null}
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => press.set(withTiming(0.94, { duration: Motion.press, easing: Motion.out }))}
        onPressOut={() => press.set(withTiming(1, { duration: Motion.press, easing: Motion.out }))}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? (listening ? 'Stop listening' : 'Start listening')}>
        <Animated.View style={[styles.disc, listening && styles.discLive, disabled && styles.disabled, discStyle]}>
          {/* On ink the glyph is the scheme's surface; on blue it is always white. */}
          <Icon name={listening ? 'stop' : 'mic'} size={34} color={listening ? '#FFFFFF' : C.white} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

/** One ring of light, swelling out and fading. */
function Ring({ delay }: { delay: number }) {
  const styles = useStyles();
  const v = useSharedValue(0);
  useEffect(() => {
    v.set(withDelay(delay, withRepeat(withTiming(1, { duration: RING_MS, easing: Easing.out(Easing.quad) }), -1, false)));
  }, [delay, v]);
  const style = useAnimatedStyle(() => ({ opacity: 0.45 * (1 - v.get()), transform: [{ scale: 1 + v.get() * 0.75 }] }));
  return <Animated.View pointerEvents="none" style={[styles.ring, style]} />;
}

const useStyles = makeStyles((C, scheme) => ({
  wrap: { width: SIZE * 1.8, height: SIZE * 1.8, alignItems: 'center', justifyContent: 'center' },
  disc: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: scheme === 'dark' ? '0 18px 40px -14px rgba(77,169,252,0.55)' : '0 22px 44px -20px rgba(10,10,11,0.55)',
  },
  discLive: {
    backgroundColor: Colors.blue600,
    boxShadow: '0 0 0 6px rgba(77,169,252,0.18), 0 18px 40px -12px rgba(46,144,240,0.7)',
  },
  disabled: { opacity: 0.45 },
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: Colors.blue,
  },
}));
