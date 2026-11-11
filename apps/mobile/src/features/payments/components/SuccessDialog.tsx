import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { View } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';

import { AppDialog, DialogActions, DialogMessage, DialogTitle, Icon } from '@/core/components';
import { makeStyles, useColors } from '@/core/theme';

/** The tick lands a beat after the card does, with a small overshoot. */
const LAND = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.6 }] },
  60: { opacity: 1, transform: [{ scale: 1.08 }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
})
  .delay(120)
  .duration(420);

/** Confirmation shown after a payment or request succeeds. */
export function SuccessDialog({
  visible,
  title,
  message,
  onDone,
}: {
  visible: boolean;
  title: string;
  message: string;
  onDone: () => void;
}) {
  const C = useColors();
  const styles = useStyles();

  useEffect(() => {
    if (visible) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [visible]);

  return (
    <AppDialog visible={visible} onClose={onDone}>
      <View style={styles.center}>
        <Animated.View entering={LAND} style={styles.tick}>
          <Icon name="checkmark" size={30} color={C.white} />
        </Animated.View>
      </View>
      <DialogTitle>{title}</DialogTitle>
      <DialogMessage>{message}</DialogMessage>
      <DialogActions actions={[{ text: 'Done', onPress: onDone }]} />
    </AppDialog>
  );
}

const useStyles = makeStyles((C) => ({
  center: { alignItems: 'flex-start', marginBottom: 18 },
  tick: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
