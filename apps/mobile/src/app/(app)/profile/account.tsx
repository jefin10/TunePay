import { Text, View } from 'react-native';

import { Avatar, Badge, Cap, Card, Icon, InfoRow, List, Screen, Section, Stagger, Surface, T3, TopNav, useText } from '@/core/components';
import { useSession } from '@/core/storage/session';
import { Fonts, makeStyles, useColors } from '@/core/theme';
import { formatINR } from '@/core/utils/format';
import { useBalance, useProfile } from '@/features/account/hooks';
import { useCopyUpi } from '@/features/profile/use-copy-upi';

export default function AccountDetailsScreen() {
  const C = useColors();
  const styles = useStyles();
  const t = useText();
  const profile = useProfile();
  const balance = useBalance();
  const phone = useSession((s) => s.phoneNumber) ?? '—';
  const name = profile.data?.userName || 'Unknown';
  const upiId = profile.data?.upiId ?? '';
  const copyUpi = useCopyUpi(upiId);

  return (
    <Screen
      onRefresh={() => {
        profile.refetch();
        balance.refetch();
      }}
      refreshing={profile.isRefetching || balance.isRefetching}>
      <TopNav large title="Account details" />

      <Stagger>
        <View style={styles.person}>
          <Avatar name={name} size={60} dark />
          <View style={styles.grow}>
            <T3 numberOfLines={1}>{name}</T3>
            <Cap>{phone}</Cap>
          </View>
        </View>

        <Surface onPress={copyUpi} accessibilityLabel="Copy UPI ID" style={styles.gap}>
          <View style={styles.grow}>
            <Text style={t.kick}>UPI ID</Text>
            <Text style={[t.r1, styles.value]}>{upiId || 'N/A'}</Text>
          </View>
          <Icon name="copy-outline" size={18} color={C.inkSoft} />
        </Surface>

        <Card style={styles.wallet}>
          <View style={styles.grow}>
            <Text style={t.kick}>Wallet balance</Text>
            <Text style={styles.amount}>
              {balance.data != null ? formatINR(balance.data) : balance.isLoading ? '…' : '—'}
            </Text>
          </View>
          <Badge label="Active" variant="ink" />
        </Card>

        <Section title="Details">
          <List>
            <InfoRow icon="person-outline" label="Display name" value={name} />
            <InfoRow icon="phone-portrait-outline" label="Phone number" value={phone} />
            <InfoRow icon="at-outline" label="UPI handle" value={upiId || '—'} />
          </List>
        </Section>
      </Stagger>
    </Screen>
  );
}

const useStyles = makeStyles((C) => ({
  grow: { flex: 1, minWidth: 0 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  gap: { marginTop: 18 },
  value: { marginTop: 3 },
  wallet: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 18 },
  amount: {
    marginTop: 4,
    fontFamily: Fonts.light,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.8,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
}));
