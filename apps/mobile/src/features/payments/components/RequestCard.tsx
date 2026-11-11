import { Text, View } from 'react-native';

import { AppButton, Avatar, Badge, Card, useText } from '@/core/components';
import { Fonts, makeStyles, Radius } from '@/core/theme';
import { formatDate, formatINR } from '@/core/utils/format';
import type { MoneyRequest, MoneyRequestStatus } from '@/models/money-request';

/** The fill carries the state: pending is quiet, paid is ink, refused is red. */
const BADGE: Record<MoneyRequestStatus, 'soft' | 'ink' | 'danger'> = {
  pending: 'soft',
  approved: 'ink',
  rejected: 'danger',
  cancelled: 'danger',
};

/** One money request. Pending received requests can be paid or declined; pending sent ones cancelled. */
export function RequestCard({
  request,
  direction,
  busy,
  onAction,
}: {
  request: MoneyRequest;
  direction: 'received' | 'sent';
  busy: boolean;
  onAction: (status: 'approved' | 'rejected' | 'cancelled') => void;
}) {
  const styles = useStyles();
  const t = useText();
  const pending = request.status === 'pending';
  return (
    <Card style={styles.card}>
      <View style={styles.person}>
        <Avatar name={request.counterpartyName} size={42} />
        <View style={styles.grow}>
          <Text style={t.r1} numberOfLines={1}>
            {request.counterpartyName}
          </Text>
          <Text style={t.r2}>{request.counterpartyPhone}</Text>
        </View>
        <Badge label={request.status} variant={BADGE[request.status] ?? 'soft'} />
      </View>

      <View style={styles.amountRow}>
        <View style={styles.grow}>
          <Text style={t.kick}>{direction === 'received' ? 'Amount requested' : 'You requested'}</Text>
          <Text style={styles.amount}>{formatINR(request.amount)}</Text>
        </View>
        <Text style={t.cap}>{formatDate(request.createdAt)}</Text>
      </View>

      {request.message ? <Text style={[t.sm, styles.message]}>“{request.message}”</Text> : null}

      {pending &&
        (direction === 'received' ? (
          <View style={styles.actions}>
            <AppButton label="Decline" variant="secondary" onPress={() => onAction('rejected')} disabled={busy} style={styles.grow} />
            <AppButton label="Pay" onPress={() => onAction('approved')} loading={busy} style={styles.grow} />
          </View>
        ) : (
          <AppButton label="Cancel request" variant="secondary" onPress={() => onAction('cancelled')} loading={busy} />
        ))}
    </Card>
  );
}

const useStyles = makeStyles((C) => ({
  card: { gap: 14 },
  grow: { flex: 1, minWidth: 0 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: Radius.min,
    borderCurve: 'continuous',
    backgroundColor: C.soft,
  },
  amount: {
    marginTop: 4,
    fontFamily: Fonts.light,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.8,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  message: { color: C.inkSoft, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: 10 },
}));
