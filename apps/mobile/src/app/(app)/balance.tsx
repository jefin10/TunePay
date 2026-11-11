import { useState } from 'react';
import { Text, View } from 'react-native';

import { Badge, Commit, IconButton, InfoRow, List, Notice, Row, RowIcon, Screen, Section, Skeleton, Stagger, TopNav } from '@/core/components';
import { useSession } from '@/core/storage/session';
import { Fonts, makeStyles } from '@/core/theme';
import { formatINR } from '@/core/utils/format';
import { useBalance } from '@/features/account/hooks';

export default function BalanceScreen() {
  const styles = useStyles();
  const [visible, setVisible] = useState(true);
  const balance = useBalance();
  const userName = useSession((s) => s.userName) ?? 'there';
  const refresh = () => balance.refetch();
  const shown = (v: number) => (visible ? formatINR(v) : '₹ ••••••');

  return (
    <Screen onRefresh={refresh} refreshing={balance.isRefetching}>
      <TopNav
        title="Balance"
        right={
          <>
            <IconButton
              icon={visible ? 'eye-outline' : 'eye-off-outline'}
              accessibilityLabel={visible ? 'Hide balance' : 'Show balance'}
              onPress={() => setVisible((v) => !v)}
            />
            <IconButton icon="refresh" accessibilityLabel="Refresh" onPress={refresh} />
          </>
        }
      />

      <Stagger>
        <Commit kicker={`Hi, ${userName}`} title="Available balance" style={styles.hero}>
          <View style={styles.amountLine}>
            {balance.isLoading ? (
              <Skeleton style={styles.amountSkeleton} />
            ) : (
              <Text style={styles.amount}>{shown(balance.data ?? 0)}</Text>
            )}
          </View>
        </Commit>

        {balance.isError ? (
          <Notice tone="err" onRetry={refresh} style={styles.gap}>
            Failed to fetch balance. Pull to retry.
          </Notice>
        ) : balance.data != null ? (
          <Section title="Linked account">
            <List>
              <Row left={<RowIcon name="business-outline" />} title="Bank account" right={<Badge label="Active" variant="ink" />} />
              <InfoRow label="Current balance" value={shown(balance.data)} />
            </List>
          </Section>
        ) : null}
      </Stagger>
    </Screen>
  );
}

const useStyles = makeStyles((C) => ({
  hero: { marginTop: 8, paddingVertical: 24 },
  amountLine: { minHeight: 60, justifyContent: 'center' },
  amount: {
    fontFamily: Fonts.light,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1.6,
    color: C.commitInk,
    fontVariant: ['tabular-nums'],
  },
  amountSkeleton: { width: 200, height: 44, backgroundColor: 'rgba(255,255,255,0.12)' },
  gap: { marginTop: 18 },
}));
