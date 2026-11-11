import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Fonts, makeStyles, Motion, useColors } from '@/core/theme';
import { useReduceMotion } from '@/core/use-reduce-motion';

import { Icon } from './Icon';

/**
 * One band of a screen. The heading sits on the ground, not inside a box:
 * stacking titled boxes gave every section the same weight and left the page
 * reading as a list of containers. Out here the type carries the hierarchy
 * and the glass is spent only on the content it holds.
 */
export function Section({
  title,
  action,
  onAction,
  delay = 0,
  children,
}: {
  title: string;
  /** The one way out of this section, to the screen holding the rest. */
  action?: string;
  onAction?: () => void;
  delay?: number;
  children: ReactNode;
}) {
  const styles = useStyles();
  const C = useColors();
  const reduce = useReduceMotion();

  return (
    <Animated.View
      style={styles.section}
      entering={reduce ? undefined : FadeInDown.delay(delay).duration(480).easing(Motion.out)}>
      <View style={styles.head}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {onAction && action ? (
          <Pressable
            onPress={onAction}
            accessibilityRole="button"
            hitSlop={10}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
            <Text style={styles.actionText}>{action}</Text>
            <Icon name="chevron-forward" size={13} color={C.blue600} />
          </Pressable>
        ) : null}
      </View>
      {children}
    </Animated.View>
  );
}

/** A hairline between items sharing one pane of glass. */
export function Divider() {
  return <View style={useStyles().divider} />;
}

const useStyles = makeStyles((C) => ({
  section: { marginTop: 30 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  title: { flex: 1, fontFamily: Fonts.medium, fontSize: 19, color: C.ink, letterSpacing: -0.4 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionText: { fontFamily: Fonts.semibold, fontSize: 13.5, color: C.blue600 },
  divider: { height: 1, backgroundColor: C.soft2 },
  pressed: { opacity: 0.6 },
}));
