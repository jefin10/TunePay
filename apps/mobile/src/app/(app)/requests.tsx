import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppDialog,
  DialogActions,
  DialogMessage,
  DialogTitle,
  Empty,
  Icon,
  Screen,
  Seg,
  Skeleton,
  toast,
  TopNav,
  type IconName,
} from '@/core/components';
import { useSession } from '@/core/storage/session';
import { Fonts, makeStyles, Radius, useColors } from '@/core/theme';
import { formatINR } from '@/core/utils/format';
import { useRefreshAccount } from '@/features/account/hooks';
import { updateRequestStatus } from '@/features/payments/api';
import { NewRequestSheet } from '@/features/payments/components/NewRequestSheet';
import { RequestCard } from '@/features/payments/components/RequestCard';
import { useMoneyRequests } from '@/features/payments/hooks';
import type { MoneyRequest } from '@/models/money-request';

type Tab = 'received' | 'sent';

const TABS: { key: Tab; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'sent', label: 'Sent' },
];

const EMPTY: Record<Tab, { icon: IconName; text: string }> = {
  received: { icon: 'mail-open-outline', text: 'No requests received yet.' },
  sent: { icon: 'paper-plane-outline', text: "You haven't sent any requests." },
};

const DONE_MESSAGE = { approved: 'Paid', rejected: 'Request declined', cancelled: 'Request cancelled' } as const;

type Action = 'approved' | 'rejected' | 'cancelled';

/** Every request action acts on the first tap otherwise, and "Pay" moves money. */
const CONFIRM: Record<Action, { title: (amount: string) => string; body: (name: string, amount: string) => string; action: string }> = {
  approved: { title: (a) => `Pay ${a}?`, body: (n, a) => `${a} will be sent to ${n}.`, action: 'Pay' },
  rejected: { title: () => 'Decline request?', body: (n, a) => `${n} asked you for ${a}.`, action: 'Decline' },
  cancelled: {
    title: () => 'Cancel request?',
    body: (n, a) => `Your request to ${n} for ${a} will be withdrawn.`,
    action: 'Yes, cancel',
  },
};

export default function RequestsScreen() {
  const C = useColors();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const phoneNumber = useSession((s) => s.phoneNumber) ?? '';
  const requests = useMoneyRequests();
  const refreshAccount = useRefreshAccount();
  const [tab, setTab] = useState<Tab>('received');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);
  const [confirming, setConfirming] = useState<{ request: MoneyRequest; status: Action } | null>(null);

  const act = async (requestId: number, status: Action) => {
    setBusyId(requestId);
    const result = await updateRequestStatus({ requestId, status, phoneNumber });
    setBusyId(null);
    if (result.success) {
      toast(DONE_MESSAGE[status], 'success');
      refreshAccount();
    } else {
      toast(result.message, 'error');
    }
  };

  const data = requests.data?.[tab] ?? [];

  return (
    <View style={styles.fill}>
      <Screen onRefresh={() => requests.refetch()} refreshing={requests.isRefetching} contentStyle={styles.content}>
        <TopNav large title="Requests" />
        <Seg options={TABS} value={tab} onChange={setTab} style={styles.seg} />

        {requests.isLoading ? (
          <Skeleton style={styles.skeleton} />
        ) : data.length === 0 ? (
          <Empty
            icon={requests.isError ? 'alert-circle-outline' : EMPTY[tab].icon}
            title={requests.isError ? 'Failed to load requests.' : EMPTY[tab].text}
          />
        ) : (
          <Animated.View key={tab} entering={FadeIn.duration(220)} style={styles.list}>
            {data.map((item) => (
              <RequestCard
                key={item.id}
                request={item}
                direction={tab}
                busy={busyId === item.id}
                onAction={(status) => setConfirming({ request: item, status })}
              />
            ))}
          </Animated.View>
        )}
      </Screen>

      {/* The one primary action, floating: an ink pill. */}
      <Pressable
        onPress={() => setComposing(true)}
        style={({ pressed }) => [styles.fab, { bottom: insets.bottom + 20 }, pressed && styles.pressed]}
        accessibilityRole="button">
        <Icon name="add" size={20} color={C.white} />
        <Text style={styles.fabText}>New request</Text>
      </Pressable>

      <NewRequestSheet
        visible={composing}
        onClose={() => setComposing(false)}
        onSent={() => {
          setComposing(false);
          setTab('sent');
          toast('Money request sent', 'success');
          requests.refetch();
        }}
      />

      <AppDialog visible={confirming !== null} onClose={() => setConfirming(null)}>
        {confirming ? (
          <>
            <DialogTitle>{CONFIRM[confirming.status].title(formatINR(confirming.request.amount))}</DialogTitle>
            <DialogMessage>
              {CONFIRM[confirming.status].body(confirming.request.counterpartyName, formatINR(confirming.request.amount))}
            </DialogMessage>
            <DialogActions
              actions={[
                {
                  text: confirming.status === 'cancelled' ? 'Keep it' : 'Cancel',
                  style: 'cancel',
                  onPress: () => setConfirming(null),
                },
                {
                  text: CONFIRM[confirming.status].action,
                  style: confirming.status === 'approved' ? 'default' : 'destructive',
                  onPress: () => {
                    const { request, status } = confirming;
                    setConfirming(null);
                    act(request.id, status);
                  },
                },
              ]}
            />
          </>
        ) : null}
      </AppDialog>
    </View>
  );
}

const useStyles = makeStyles((C, scheme) => ({
  fill: { flex: 1 },
  content: { paddingBottom: 120 },
  seg: { marginTop: 4 },
  skeleton: { height: 220, borderRadius: Radius.card, marginTop: 20 },
  list: { gap: 12, marginTop: 20 },
  fab: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 52,
    paddingHorizontal: 22,
    borderRadius: Radius.full,
    backgroundColor: C.ink,
    boxShadow:
      scheme === 'dark' ? '0 18px 40px -14px rgba(77,169,252,0.55)' : '0 22px 44px -20px rgba(10,10,11,0.5)',
  },
  fabText: { fontFamily: Fonts.semibold, fontSize: 15, color: C.white },
  pressed: { opacity: 0.8 },
}));
