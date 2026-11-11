import { Pressable, Text, View } from 'react-native';

import { Badge, Icon, Skeleton, useText } from '@/core/components';
import { Fonts, makeStyles, useColors } from '@/core/theme';
import { formatINR, formatTime, relativeTime } from '@/core/utils/format';
import type { TransactionItem } from '@/models/transaction';

/** Money out is an ink arrow on a quiet tile; money in, the same tile with the arrow in the credit shade. */
function DirectionTile({ sent }: { sent: boolean }) {
  const C = useColors();
  const styles = useStyles();
  return (
    <View style={styles.tile}>
      <Icon name={sent ? 'arrow-up' : 'arrow-down'} size={18} color={sent ? C.ink : C.credit} />
    </View>
  );
}

const title = (t: TransactionItem) => `${t.type === 'sent' ? 'To' : 'From'} ${t.counterpartyName}`;
const signed = (t: TransactionItem) => `${t.type === 'sent' ? '-' : '+'}${formatINR(t.amount)}`;

function Amount({ tx }: { tx: TransactionItem }) {
  const C = useColors();
  const styles = useStyles();
  return <Text style={[styles.amount, { color: tx.type === 'sent' ? C.ink : C.credit }]}>{signed(tx)}</Text>;
}

/** One row of the home screen's recent activity, inside a List. */
export function ActivityRow({ tx, onPress }: { tx: TransactionItem; onPress?: () => void }) {
  const styles = useStyles();
  const t = useText();
  const sent = tx.type === 'sent';
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <DirectionTile sent={sent} />
      <View style={styles.grow}>
        <Text style={t.r1} numberOfLines={1}>
          {title(tx)}
        </Text>
        <Text style={t.r2}>{relativeTime(tx.timestamp) || (sent ? 'Sent' : 'Received')}</Text>
      </View>
      <Amount tx={tx} />
    </Pressable>
  );
}

/** One row of the history list: the time, and a status badge when it did not simply go through. */
export function TransactionCard({ tx }: { tx: TransactionItem }) {
  const styles = useStyles();
  const t = useText();
  const settled = tx.status === 'completed';
  return (
    <View style={styles.row}>
      <DirectionTile sent={tx.type === 'sent'} />
      <View style={styles.grow}>
        <Text style={t.r1} numberOfLines={1}>
          {title(tx)}
        </Text>
        <View style={styles.meta}>
          <Text style={t.cap}>{formatTime(tx.timestamp) || (tx.type === 'sent' ? 'Sent' : 'Received')}</Text>
          {!settled ? <Badge label={tx.status} variant={tx.status === 'failed' ? 'danger' : 'soft'} /> : null}
        </View>
      </View>
      <Amount tx={tx} />
    </View>
  );
}

export function ActivityRowSkeleton() {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <Skeleton style={styles.skTile} />
      <View style={[styles.grow, styles.skText]}>
        <Skeleton style={styles.skLine} />
        <Skeleton style={styles.skLineShort} />
      </View>
      <Skeleton style={styles.skAmount} />
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  grow: { flex: 1, minWidth: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 15, minHeight: 66 },
  pressed: { backgroundColor: C.soft },
  tile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  amount: { fontFamily: Fonts.medium, fontSize: 15, letterSpacing: -0.2, fontVariant: ['tabular-nums'] },
  skTile: { width: 40, height: 40, borderRadius: 20 },
  skText: { gap: 7 },
  skLine: { width: 120, height: 12, borderRadius: 6 },
  skLineShort: { width: 70, height: 10, borderRadius: 5 },
  skAmount: { width: 64, height: 14, borderRadius: 7 },
}));
