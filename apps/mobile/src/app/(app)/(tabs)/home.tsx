import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  Avatar,
  Cap,
  Commit,
  CommitButton,
  Empty,
  Icon,
  IconButton,
  List,
  Row,
  RowIcon,
  Screen,
  Section,
  Skeleton,
  Stagger,
  Surface,
  toast,
  type IconName,
} from '@/core/components';
import { Fonts, makeStyles, useColors } from '@/core/theme';
import { formatINR, greeting } from '@/core/utils/format';
import { ActivityRow, ActivityRowSkeleton } from '@/features/account/components/TransactionRow';
import { useBalance, useProfile, useRefreshAccount, useTransactions } from '@/features/account/hooks';

const QUICK_ACTIONS: { icon: IconName; label: string; href: Href }[] = [
  { icon: 'scan-outline', label: 'Scan', href: '/qr-scanner' },
  { icon: 'phone-portrait-outline', label: 'To phone', href: '/pay/phone' },
  { icon: 'people-outline', label: 'Contacts', href: '/pay/contacts' },
  { icon: 'at-outline', label: 'UPI ID', href: '/pay/upi' },
];

const MORE: { icon: IconName; title: string; href: Href }[] = [
  { icon: 'arrow-down-circle-outline', title: 'Request money', href: '/requests' },
  { icon: 'qr-code-outline', title: 'My QR', href: '/my-qr' },
];

export default function HomeScreen() {
  const C = useColors();
  const styles = useStyles();
  const [hidden, setHidden] = useState(false);
  const profile = useProfile();
  const balance = useBalance();
  const transactions = useTransactions();
  const refreshAccount = useRefreshAccount();
  const [refreshing, setRefreshing] = useState(false);

  const userName = profile.data?.userName ?? '';
  const upiId =
    profile.data?.upiId || (userName ? `${userName.toLowerCase().replace(/\s/g, '')}@upi` : 'your-id@upi');
  const recent = transactions.data?.slice(0, 4) ?? [];

  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshAccount(), profile.refetch()]);
    setRefreshing(false);
  };

  return (
    <Screen docked onRefresh={refresh} refreshing={refreshing}>
      <Stagger>
        <View style={styles.nav}>
          <Avatar name={userName || 'U'} size={44} dark />
          <View style={styles.grow}>
            <Cap>{greeting()}</Cap>
            <Text style={styles.name} numberOfLines={1}>
              {userName || 'Welcome back'}
            </Text>
          </View>
          <IconButton icon="scan-outline" accessibilityLabel="Scan QR" onPress={() => router.push('/qr-scanner')} />
          <IconButton
            icon="notifications-outline"
            accessibilityLabel="Notifications"
            onPress={() => toast('No new notifications')}
          />
        </View>

        {/* The one dark panel on the screen: the wallet. */}
        <Commit
          kicker="Available balance"
          style={styles.wallet}
          right={
            <Pressable
              hitSlop={10}
              onPress={() => setHidden((h) => !h)}
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show balance' : 'Hide balance'}>
              <Icon name={hidden ? 'eye-off-outline' : 'eye-outline'} size={19} color={C.commitSoft} />
            </Pressable>
          }>
          <View style={styles.balanceLine}>
            {balance.isLoading ? (
              <Skeleton style={styles.balanceSkeleton} />
            ) : balance.data == null ? (
              <Text style={[styles.balance, styles.unavailable]}>Unavailable</Text>
            ) : (
              <Text style={styles.balance}>{hidden ? '₹ ••••••' : formatINR(balance.data)}</Text>
            )}
          </View>
          <Text style={styles.upi} numberOfLines={1}>
            {upiId}
          </Text>
          <View style={styles.walletActions}>
            <CommitButton label="Statement" icon="receipt-outline" onPress={() => router.push('/history')} />
            <CommitButton label="Balance" icon="wallet-outline" onPress={() => router.push('/balance')} />
          </View>
        </Commit>

        <View style={styles.quick}>
          {QUICK_ACTIONS.map((a) => (
            <Surface key={a.label} onPress={() => router.push(a.href)} style={styles.quickTile} accessibilityLabel={a.label}>
              <Icon name={a.icon} size={22} />
              <Text style={styles.quickLabel} numberOfLines={1}>
                {a.label}
              </Text>
            </Surface>
          ))}
        </View>

        <Surface onPress={() => router.push('/speech')} style={styles.voice} accessibilityLabel="Voice pay">
          <View style={styles.voiceIcon}>
            <Icon name="mic" size={20} color={C.white} />
          </View>
          <View style={styles.grow}>
            <Text style={styles.voiceKicker}>Voice pay</Text>
            {/* Non-breaking space: wrap before the number, not inside it. */}
            <Text style={styles.voiceTitle}>{'“Send ₹500 to 98765 43210”'}</Text>
          </View>
          <Icon name="chevron-forward" size={17} color={C.muted} />
        </Surface>

        <Section title="Move money" delay={120}>
          <List>
            {MORE.map((m) => (
              <Row
                key={m.title}
                left={<RowIcon name={m.icon} />}
                title={m.title}
                chevron
                onPress={() => router.push(m.href)}
              />
            ))}
          </List>
        </Section>

        <Section title="Recent activity" action="See all" onAction={() => router.push('/history')} delay={180}>
          {transactions.isLoading ? (
            <List>
              {[0, 1, 2].map((i) => (
                <ActivityRowSkeleton key={i} />
              ))}
            </List>
          ) : recent.length === 0 ? (
            <Empty icon="receipt-outline" title="Nothing here yet" />
          ) : (
            <List>
              {recent.map((tx, i) => (
                <ActivityRow key={`${tx.timestamp}-${i}`} tx={tx} onPress={() => router.push('/history')} />
              ))}
            </List>
          )}
        </Section>
      </Stagger>
    </Screen>
  );
}

const useStyles = makeStyles((C) => ({
  grow: { flex: 1, minWidth: 0 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44, marginBottom: 20 },
  name: { fontFamily: Fonts.medium, fontSize: 18, color: C.ink, letterSpacing: -0.3, marginTop: 1 },
  wallet: { paddingVertical: 22 },
  balanceLine: { minHeight: 46, justifyContent: 'center' },
  balance: {
    fontFamily: Fonts.light,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -1.4,
    color: C.commitInk,
    fontVariant: ['tabular-nums'],
  },
  unavailable: { fontSize: 28, color: C.commitSoft },
  balanceSkeleton: { width: 190, height: 38, backgroundColor: 'rgba(255,255,255,0.12)' },
  upi: { marginTop: 6, fontFamily: Fonts.regular, fontSize: 13, color: C.commitSoft },
  walletActions: { flexDirection: 'row', gap: 8, marginTop: 20 },
  quick: { flexDirection: 'row', gap: 8, marginTop: 14 },
  quickTile: { flex: 1, flexDirection: 'column', gap: 8, paddingVertical: 16, paddingHorizontal: 4 },
  quickLabel: { fontFamily: Fonts.semibold, fontSize: 12, color: C.ink },
  voice: { marginTop: 14 },
  voiceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceKicker: { fontFamily: Fonts.semibold, fontSize: 12.5, color: C.blue600 },
  voiceTitle: { fontFamily: Fonts.medium, fontSize: 15, color: C.ink, marginTop: 2 },
}));
