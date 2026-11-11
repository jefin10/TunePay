import * as Haptics from 'expo-haptics';
import { Text } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { Fonts, makeStyles } from '@/core/theme';

/** The one line above a floating action that says why it did not go through. */
export function InlineError({ message }: { message: string | null }) {
  const styles = useStyles();
  if (!message) return null;
  return (
    <Animated.View key={message} entering={FadeInDown.duration(260)} exiting={FadeOut.duration(160)}>
      <Text style={styles.text} accessibilityRole="alert">
        {message}
      </Text>
    </Animated.View>
  );
}

/** A tapped action that cannot go through yet: explain, and nudge the hand. */
export function nudge(setError: (message: string) => void, message: string) {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  setError(message);
}

const useStyles = makeStyles((C, scheme) => ({
  text: {
    color: scheme === 'dark' ? '#FF8A90' : C.danger,
    fontFamily: Fonts.medium,
    fontSize: 13,
    textAlign: 'center',
  },
}));
