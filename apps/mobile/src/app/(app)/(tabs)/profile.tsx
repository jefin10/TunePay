import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import {
  AppDialog,
  Avatar,
  Cap,
  DialogActions,
  DialogMessage,
  DialogTitle,
  Icon,
  InfoRow,
  Kick,
  List,
  Row,
  RowIcon,
  Screen,
  Sheet,
  SmallButton,
  Stagger,
  Surface,
  T3,
  ToggleRow,
  useText,
} from '@/core/components';
import { useSession, type FlagKey } from '@/core/storage/session';
import { Fonts, makeStyles, useColors } from '@/core/theme';
import { useProfile } from '@/features/account/hooks';
import { useCopyUpi } from '@/features/profile/use-copy-upi';
import { useLogout } from '@/features/profile/use-logout';

type SheetKind = 'bank' | 'limits' | 'notifications' | 'help' | null;

const LIMITS = [
  ['Per transaction', '₹1,00,000'],
  ['Daily limit', '₹1,00,000'],
  ['Per month', '₹10,00,000'],
  ['Transactions/day', '20 transfers'],
] as const;

const FAQ = [
  [
    'How do I send money by voice?',
    'Tap the mic and say "Send ₹500 to" a phone number, UPI ID or contact name. TunePay confirms the details before transferring.',
  ],
  [
    'What if a payment fails?',
    'Failed payments are not deducted. If your balance was deducted and the recipient did not receive the amount, contact support.',
  ],
  ['How do I check my balance?', 'Ask the voice assistant "What is my balance?", or tap the wallet card on the home screen.'],
  [
    'Is my data secure?',
    'The app locks behind biometrics on launch, and voice payments and balance checks ask for biometrics again. Your UPI PIN is never stored on this device.',
  ],
] as const;

const NOTIFICATIONS: { key: FlagKey; title: string }[] = [
  { key: 'notif_payments', title: 'Payment alerts' },
  { key: 'notif_requests', title: 'Money requests' },
  { key: 'notif_promotions', title: 'Offers & updates' },
];

export default function ProfileTab() {
  const C = useColors();
  const styles = useStyles();
  const t = useText();
  const profile = useProfile();
  const { phoneNumber, flags, setFlag } = useSession();
  const logout = useLogout();
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const name = profile.data?.userName ?? '';
  const upiId = profile.data?.upiId ?? '';
  const copyUpi = useCopyUpi(upiId);

  return (
    <Screen docked onRefresh={() => profile.refetch()} refreshing={profile.isRefetching}>
      <Stagger>
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.identity}>
          <Avatar name={name || 'U'} size={72} dark />
          <View style={styles.grow}>
            <T3 numberOfLines={1}>{name || 'Loading…'}</T3>
            <Cap>{phoneNumber}</Cap>
          </View>
        </View>

        <Surface onPress={copyUpi} accessibilityLabel="Copy UPI ID" style={styles.upi}>
          <View style={styles.grow}>
            <Text style={t.kick}>UPI ID</Text>
            <Text style={[t.r1, styles.upiValue]}>{upiId || '—'}</Text>
          </View>
          <Icon name="copy-outline" size={18} color={C.inkSoft} />
        </Surface>

        <Kick style={styles.kick}>You</Kick>
        <List>
          <Row left={<RowIcon name="person-outline" />} title="Account details" chevron onPress={() => router.push('/profile/account')} />
          <Row left={<RowIcon name="business-outline" />} title="Bank accounts" chevron onPress={() => setSheet('bank')} />
          <Row left={<RowIcon name="shield-checkmark-outline" />} title="Security" chevron onPress={() => router.push('/profile/security')} />
          <Row left={<RowIcon name="options-outline" />} title="Transaction limits" chevron onPress={() => setSheet('limits')} />
        </List>

        <Kick style={styles.kick}>App</Kick>
        <List>
          <Row left={<RowIcon name="notifications-outline" />} title="Notifications" chevron onPress={() => setSheet('notifications')} />
          <Row left={<RowIcon name="sunny-outline" />} title="Appearance" chevron onPress={() => router.push('/profile/appearance')} />
          <Row left={<RowIcon name="help-circle-outline" />} title="Help & support" chevron onPress={() => setSheet('help')} />
          <Row left={<RowIcon name="information-circle-outline" />} title="About" chevron onPress={() => router.push('/profile/about')} />
        </List>

        <SmallButton label="Log out" icon="log-out-outline" variant="d" style={styles.logout} onPress={() => setConfirmLogout(true)} />
      </Stagger>

      <Sheet visible={sheet === 'bank'} onClose={() => setSheet(null)} title="Bank accounts">
        <Text style={t.r1}>No bank accounts linked</Text>
        <Text style={[t.cap, styles.para]}>
          Bank account linking is powered by your UPI handle. Payments go directly through your registered UPI.
        </Text>
        <List>
          <InfoRow label="Your UPI ID" value={upiId || '—'} />
        </List>
      </Sheet>

      <Sheet visible={sheet === 'limits'} onClose={() => setSheet(null)} title="Transaction limits">
        <List>
          {LIMITS.map(([label, value]) => (
            <InfoRow key={label} label={label} value={value} />
          ))}
        </List>
      </Sheet>

      <Sheet visible={sheet === 'notifications'} onClose={() => setSheet(null)} title="Notifications">
        <List>
          {NOTIFICATIONS.map((n) => (
            <ToggleRow
              key={n.key}
              title={n.title}
              value={flags[n.key]}
              onValueChange={(v) => setFlag(n.key, v)}
            />
          ))}
        </List>
      </Sheet>

      <Sheet visible={sheet === 'help'} onClose={() => setSheet(null)} title="Help & support">
        <View style={styles.faq}>
          {FAQ.map(([q, a]) => (
            <View key={q}>
              <Text style={t.r1}>{q}</Text>
              <Text style={[t.cap, styles.para]}>{a}</Text>
            </View>
          ))}
        </View>
      </Sheet>

      <AppDialog visible={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <DialogTitle>Log out?</DialogTitle>
        <DialogMessage>You will need to verify your number again to come back.</DialogMessage>
        <DialogActions
          actions={[
            { text: 'Cancel', style: 'cancel', onPress: () => setConfirmLogout(false) },
            { text: 'Log out', style: 'destructive', onPress: logout },
          ]}
        />
      </AppDialog>
    </Screen>
  );
}

const useStyles = makeStyles((C) => ({
  grow: { flex: 1, minWidth: 0 },
  heading: { fontFamily: Fonts.light, fontSize: 28, lineHeight: 34, color: C.ink, letterSpacing: -0.8, marginTop: 6 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 22 },
  upi: { marginTop: 18 },
  upiValue: { marginTop: 3 },
  kick: { marginTop: 24, marginBottom: 10 },
  logout: { height: 52, marginTop: 26 },
  para: { marginTop: 4, marginBottom: 14, lineHeight: 18 },
  faq: { gap: 6 },
}));
