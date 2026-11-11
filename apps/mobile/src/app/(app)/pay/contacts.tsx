import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppButton,
  AppDialog,
  Avatar,
  Badge,
  DialogActions,
  DialogMessage,
  DialogTitle,
  Empty,
  Field,
  Icon,
  IconButton,
  LiquidGlass,
  Notice,
  Sheet,
  TopNav,
  useText,
} from '@/core/components';
import { useSession } from '@/core/storage/session';
import { Fonts, makeStyles, Radius, useColors } from '@/core/theme';
import { formatINR } from '@/core/utils/format';
import { localPhone, toIndianE164 } from '@/core/utils/phone';
import { useRefreshAccount } from '@/features/account/hooks';
import { parseAmount } from '@/features/payments/amount';
import { hasAccount, sendByPhone } from '@/features/payments/api';
import { AmountField } from '@/features/payments/components/AmountField';
import { RecipientCard } from '@/features/payments/components/RecipientCard';
import { SuccessDialog } from '@/features/payments/components/SuccessDialog';
import { filterContacts, loadContacts, type DeviceContact } from '@/features/payments/contacts';

export default function PayToContactsScreen() {
  const C = useColors();
  const styles = useStyles();
  const t = useText();
  const insets = useSafeAreaInsets();
  const contacts = useQuery({ queryKey: ['deviceContacts'], queryFn: loadContacts, staleTime: 60_000 });
  const [query, setQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [notOnTunePay, setNotOnTunePay] = useState(false);
  const [payee, setPayee] = useState<DeviceContact | null>(null);
  const [paid, setPaid] = useState<{ name: string; amount: number } | null>(null);

  const list = useMemo(
    () => (contacts.data?.granted ? filterContacts(contacts.data.contacts, query) : []),
    [contacts.data, query],
  );

  const onContactPress = async (contact: DeviceContact) => {
    if (!contact.phone) return setNotOnTunePay(true);
    setChecking(true);
    const exists = await hasAccount(localPhone(contact.phone));
    setChecking(false);
    if (exists) setPayee(contact);
    else setNotOnTunePay(true);
  };

  return (
    <View style={[styles.fill, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <TopNav large title="Contacts" right={<Badge label={String(list.length)} variant="ink" />} />
        <LiquidGlass radius={Radius.field} weight="strong" flat bevel={false} style={styles.search}>
          <Icon name="search" size={18} color={C.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search name or number"
            placeholderTextColor={C.muted}
            selectionColor={C.blue}
            autoCorrect={false}
            style={styles.searchInput}
          />
          {query ? <IconButton icon="close" variant="plain" size={30} onPress={() => setQuery('')} accessibilityLabel="Clear search" /> : null}
        </LiquidGlass>
      </View>

      {contacts.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={C.ink} />
        </View>
      ) : contacts.isError ? (
        <Empty icon="alert-circle-outline" title="Could not load contacts" />
      ) : !contacts.data?.granted ? (
        <Empty icon="people-outline" title="Contacts permission needed">
          <AppButton label="Open settings" onPress={() => Linking.openSettings()} />
        </Empty>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(c) => c.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
          ListEmptyComponent={<Empty icon="search" title={query ? 'No matching contacts' : 'No contacts found'} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onContactPress(item)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              accessibilityRole="button">
              <Avatar name={item.name} size={44} />
              <View style={styles.grow}>
                <Text style={t.r1} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={t.r2}>{item.phone ?? 'No phone number'}</Text>
              </View>
              <Icon name="chevron-forward" size={17} color={C.muted} />
            </Pressable>
          )}
        />
      )}

      <Modal visible={checking} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.spinnerBox}>
            <ActivityIndicator color={C.ink} />
          </View>
        </View>
      </Modal>

      <AppDialog visible={notOnTunePay} onClose={() => setNotOnTunePay(false)}>
        <DialogTitle>Not on TunePay</DialogTitle>
        <DialogMessage>No UPI account found for this contact.</DialogMessage>
        <DialogActions actions={[{ text: 'OK', onPress: () => setNotOnTunePay(false) }]} />
      </AppDialog>

      {payee ? (
        <PaySheet
          contact={payee}
          onClose={() => setPayee(null)}
          onPaid={(amount) => {
            setPaid({ name: payee.name, amount });
            setPayee(null);
          }}
        />
      ) : null}

      <SuccessDialog
        visible={paid != null}
        title="Payment sent"
        message={`${formatINR(paid?.amount ?? 0)} to ${paid?.name ?? ''}`}
        onDone={() => {
          setPaid(null);
          router.back();
        }}
      />
    </View>
  );
}

function PaySheet({ contact, onClose, onPaid }: { contact: DeviceContact; onClose: () => void; onPaid: (amount: number) => void }) {
  const styles = useStyles();
  const senderPhone = useSession((s) => s.phoneNumber) ?? '';
  const refreshAccount = useRefreshAccount();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    const value = parseAmount(amount);
    if (value == null) return setError('Enter a valid amount.');
    setError(null);
    setPaying(true);
    const result = await sendByPhone({ senderPhone, receiverPhone: toIndianE164(contact.phone!), amount: value });
    setPaying(false);
    if (result.success) {
      refreshAccount();
      onPaid(value);
    } else {
      setError(result.message);
    }
  };

  return (
    <Sheet visible onClose={onClose} dismissable={!paying}>
      <View style={styles.sheet}>
        <RecipientCard name={contact.name} subtitle={contact.phone ?? undefined} />
        <AmountField value={amount} onChangeText={setAmount} autoFocus />
        <Field label="Note (optional)" value={note} onChangeText={setNote} placeholder="Add a note" maxLength={60} />
        {error ? <Notice tone="err">{error}</Notice> : null}
        <AppButton label="Pay now" loading={paying} onPress={pay} />
      </View>
    </Sheet>
  );
}

const useStyles = makeStyles((C) => ({
  fill: { flex: 1 },
  grow: { flex: 1, minWidth: 0 },
  header: { paddingHorizontal: 20, marginBottom: 10 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 54, paddingLeft: 16, paddingRight: 8, marginTop: 6 },
  searchInput: { flex: 1, fontFamily: Fonts.regular, fontSize: 15, color: C.ink, paddingVertical: 12 },
  list: { paddingHorizontal: 20, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 10,
    marginHorizontal: -10,
    borderRadius: Radius.min,
    borderCurve: 'continuous',
  },
  pressed: { backgroundColor: C.soft },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(8,10,14,0.35)', alignItems: 'center', justifyContent: 'center' },
  spinnerBox: { padding: 22, borderRadius: 22, borderCurve: 'continuous', backgroundColor: C.white },
  sheet: { gap: 18 },
}));
