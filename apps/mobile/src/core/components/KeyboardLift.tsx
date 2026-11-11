import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Lifts its contents above the keyboard. Edge-to-edge Android no longer
 * resizes the window for it, and KeyboardAvoidingView pads its bottom, which
 * never moves an absolutely positioned footer. This follows the keyboard frame
 * by frame on both platforms and shortens itself with a bottom margin, which
 * does carry absolute children up with it.
 *
 * The safe-area inset is taken off, because whatever sits at the bottom
 * already clears it; once the keyboard is up it covers that inset anyway.
 */
export function KeyboardLift({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const keyboard = useAnimatedKeyboard();
  const { bottom } = useSafeAreaInsets();
  const lift = useAnimatedStyle(() => ({
    marginBottom: Math.max(0, keyboard.height.get() - bottom),
  }));
  return <Animated.View style={[style, lift]}>{children}</Animated.View>;
}
