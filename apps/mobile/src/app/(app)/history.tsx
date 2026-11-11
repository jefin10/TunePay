import { useMemo, useState } from 'react';
import { TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  Empty,
  Icon,
  IconButton,
  Kick,
  List,
  LiquidGlass,
  PillChoice,
  PillRail,
  Screen,
  Skeleton,
  TopNav,
} from '@/core/components';
import { Fonts, makeStyles, Radius, useColors } from '@/core/theme';
import { relativeDay } from '@/core/utils/format';
import { TransactionCard } from '@/features/account/components/TransactionRow';
import { useTransactions } from '@/features/account/hooks';
import type { TransactionItem } from '@/models/transaction';

const FILTERS = ['All', 'Sent', 'Received', 'Failed'] as const;
type Filter = (typeof FILTERS)[number];

const matches = (tx: TransactionItem, filter: Filter) =>
  filter === 'All' ||
  (filter === 'Sent' && tx.type === 'sent') ||
  (filter === 'Received' && tx.type === 'received') ||
  (filter === 'Failed' && tx.status === 'failed');

/** Newest first, a heading per day. */
function byDay(list: TransactionItem[]) {
  const groups: { title: string; items: TransactionItem[] }[] = [];
  for (const tx of list) {
    const title = relativeDay(tx.timestamp) || 'Earlier';
    const last = groups[groups.length - 1];
    if (last?.title === title) last.items.push(tx);
    else groups.push({ title, items: [tx] });
  }
  return groups;
}

export default function HistoryScreen() {
  const C = useColors();
  const styles = useStyles();
  const [filter, setFilter] = useState<Filter>('All');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const transactions = useTransactions();

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return byDay(
      (transactions.data ?? []).filter((tx) => matches(tx, filter) && (!q || tx.counterpartyName.toLowerCase().includes(q))),
    );
  }, [transactions.data, filter, query]);

  return (
    <Screen onRefresh={() => transactions.refetch()} refreshing={transactions.isRefetching}>
      <TopNav
        large
        title="History"
        right={
          <IconButton
            icon={searching ? 'close' : 'search'}
            accessibilityLabel={searching ? 'Close search' : 'Search'}
            onPress={() => {
              setSearching((s) => !s);
              setQuery('');
            }}
          />
        }
      />

      {searching ? (
        <Animated.View entering={FadeIn.duration(180)}>
          <LiquidGlass radius={Radius.field} weight="strong" flat bevel={false} style={styles.search}>
            <Icon name="search" size={18} color={C.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search by name"
              placeholderTextColor={C.muted}
              selectionColor={C.blue}
              autoFocus
              autoCorrect={false}
              style={styles.searchInput}
            />
          </LiquidGlass>
        </Animated.View>
      ) : null}

      <PillRail style={styles.filters}>
        {FILTERS.map((f) => (
          <PillChoice key={f} label={f} on={f === filter} role="tab" onPress={() => setFilter(f)} />
        ))}
      </PillRail>

      {transactions.isLoading ? (
        <Skeleton style={styles.skeleton} />
      ) : transactions.isError ? (
        <Empty icon="alert-circle-outline" title="Couldn't load your history" />
      ) : groups.length === 0 ? (
        <Empty icon="receipt-outline" title="Nothing here yet" />
      ) : (
        groups.map((g) => (
          <Animated.View key={g.title} entering={FadeIn.duration(220)}>
            <Kick style={styles.day}>{g.title}</Kick>
            <List>
              {g.items.map((tx, i) => (
                <TransactionCard key={`${tx.timestamp}-${i}`} tx={tx} />
              ))}
            </List>
          </Animated.View>
        ))
      )}
    </Screen>
  );
}

const useStyles = makeStyles((C) => ({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 54, paddingLeft: 16, paddingRight: 8, marginTop: 4 },
  searchInput: { flex: 1, fontFamily: Fonts.regular, fontSize: 15, color: C.ink, paddingVertical: 12 },
  filters: { marginTop: 16, marginBottom: 4 },
  day: { marginTop: 22, marginBottom: 10 },
  skeleton: { height: 260, borderRadius: Radius.panel, marginTop: 22 },
}));
