import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { makeStyles, Radius } from '@/core/theme';

import { useText } from './AppText';
import { KeyboardLift } from './KeyboardLift';
import { sheetSurface } from './Screen';

/** A drawer pulled up: no bounce at the end of the travel. */
const DRAWER = Easing.bezier(0.23, 1, 0.32, 1);

/** A bottom sheet over a dimmed ground: tap the scrim to dismiss. */
export function Sheet({
  visible,
  onClose,
  title,
  children,
  dismissable = true,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Whether tapping the backdrop / back button closes it. */
  dismissable?: boolean;
}) {
  const styles = useStyles();
  const t = useText();
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={dismissable ? onClose : () => {}}>
      <KeyboardLift style={styles.fill}>
        <Animated.View entering={FadeIn.duration(200)} style={StyleSheet.absoluteFill}>
          <Pressable
            style={[StyleSheet.absoluteFill, styles.dim]}
            onPress={dismissable ? onClose : undefined}
            accessibilityLabel="Close"
          />
        </Animated.View>
        <View style={styles.host} pointerEvents="box-none">
          <Animated.View
            entering={SlideInDown.duration(320).easing(DRAWER)}
            style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 14 }]}
            accessibilityViewIsModal>
            <View style={styles.handle} />
            <ScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}>
              {title ? (
                <Text style={[t.t3, styles.title]} accessibilityRole="header">
                  {title}
                </Text>
              ) : null}
              {children}
            </ScrollView>
          </Animated.View>
        </View>
      </KeyboardLift>
    </Modal>
  );
}

const useStyles = makeStyles((C, scheme) => ({
  fill: { flex: 1 },
  dim: { backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.66)' : 'rgba(10,10,11,0.52)' },
  host: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '92%',
    borderTopLeftRadius: Radius.sheet,
    borderTopRightRadius: Radius.sheet,
    borderCurve: 'continuous',
    paddingTop: 10,
    paddingHorizontal: 20,
    ...sheetSurface(scheme),
  },
  handle: {
    width: 38,
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: C.soft2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  scroll: { paddingBottom: 4 },
  title: { marginBottom: 14 },
}));
