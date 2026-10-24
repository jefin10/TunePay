import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/core/theme';
import { useKeyboardHeight } from '@/core/use-keyboard-height';

/**
 * Cream page with safe-area padding. Scrolls by default; pass `onRefresh`
 * for pull-to-refresh.
 */
export function Screen({
  children,
  scroll = true,
  refreshing = false,
  onRefresh,
  contentStyle,
  edges = ['top', 'bottom'],
}: {
  children: ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: ('top' | 'bottom')[];
}) {
  // Shrink the scroll area above the keyboard so Android scrolls the
  // focused input into view; edge-to-edge no longer resizes the window.
  const keyboard = useKeyboardHeight();
  const { bottom } = useSafeAreaInsets();
  const keyboardInset = Math.max(0, keyboard - (edges.includes('bottom') ? bottom : 0));

  return (
    <SafeAreaView style={styles.root} edges={edges}>
      {scroll ? (
        <ScrollView
          style={{ marginBottom: keyboardInset }}
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.ink} colors={[Colors.ink]} />
            ) : undefined
          }>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceLight },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 30 },
  fill: { flex: 1 },
});
