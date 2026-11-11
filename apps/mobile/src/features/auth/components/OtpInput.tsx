import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { TextInput, View, type TextInputInstance } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { Fonts, makeStyles, Radius, useColors } from '@/core/theme';

export interface OtpInputHandle {
  /** Clear all boxes, refocus the first one and shake the row. */
  reject(): void;
}

const LENGTH = 6;

/** Six soft cells with a blue inset ring on the active one: auto-advance,
 * backspace-to-previous and paste/autofill support. */
export function OtpInput({ onComplete, ref }: { onComplete: (code: string) => void; ref?: Ref<OtpInputHandle> }) {
  const C = useColors();
  const styles = useStyles();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  // Read through a ref: two keystrokes can arrive before React re-renders,
  // and a stale `digits` copy would overwrite the first one.
  const digitsRef = useRef(digits);
  const [focused, setFocused] = useState(0);
  const inputs = useRef<(TextInputInstance | null)[]>([]);
  const shake = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => inputs.current[0]?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  useImperativeHandle(ref, () => ({
    reject() {
      digitsRef.current = Array(LENGTH).fill('');
      setDigits(digitsRef.current);
      inputs.current[0]?.focus();
      const step = { duration: 50 };
      shake.set(
        withSequence(withTiming(8, step), withTiming(-8, step), withTiming(6, step), withTiming(-6, step), withTiming(0, step)),
      );
    },
  }));

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  const update = (next: string[]) => {
    digitsRef.current = next;
    setDigits(next);
    if (next.every((d) => d !== '')) onComplete(next.join(''));
  };

  const onChange = (index: number, text: string) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length > 1) {
      // Paste, SMS autofill, or typing faster than focus moves: spread from
      // this box onwards.
      const next = [...digitsRef.current];
      clean
        .slice(0, LENGTH - index)
        .split('')
        .forEach((d, i) => (next[index + i] = d));
      update(next);
      inputs.current[Math.min(index + clean.length, LENGTH - 1)]?.focus();
      return;
    }
    const next = [...digitsRef.current];
    next[index] = clean;
    update(next);
    if (clean && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  return (
    <Animated.View style={[styles.row, shakeStyle]}>
      {digits.map((d, i) => (
        <View key={i} style={[styles.box, focused === i && styles.boxActive]}>
          <TextInput
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={d}
            onChangeText={(t) => onChange(i, t)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digitsRef.current[i] && i > 0) {
                const next = [...digitsRef.current];
                next[i - 1] = '';
                digitsRef.current = next;
                setDigits(next);
                inputs.current[i - 1]?.focus();
              }
            }}
            onFocus={() => setFocused(i)}
            keyboardType="number-pad"
            textContentType={i === 0 ? 'oneTimeCode' : 'none'}
            autoComplete={i === 0 ? 'sms-otp' : 'off'}
            maxLength={LENGTH}
            selectTextOnFocus
            caretHidden
            selectionColor={C.blue}
            accessibilityLabel={`Digit ${i + 1}`}
            style={styles.input}
          />
        </View>
      ))}
    </Animated.View>
  );
}

const useStyles = makeStyles((C) => ({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  box: {
    // Narrow phones shrink the cells rather than overflow the row.
    flexShrink: 1,
    width: 50,
    height: 58,
    borderRadius: Radius.tile - 4,
    borderCurve: 'continuous',
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    backgroundColor: C.white,
    boxShadow: `inset 0 0 0 1.8px ${C.blue}`,
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    padding: 0,
    fontSize: 22,
    color: C.ink,
    fontFamily: Fonts.medium,
  },
}));
