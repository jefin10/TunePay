import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton, Avatar, List, Notice, Row, Sheet, useText } from '@/core/components';
import { Fonts, makeStyles } from '@/core/theme';
import { parseAmount } from '@/features/payments/amount';
import { AmountField } from '@/features/payments/components/AmountField';
import type { DeviceContact } from '@/features/payments/contacts';

import { targetFromContact, type Target } from '../resolve';

/**
 * Confirm a voice payment or request. The amount stays editable (speech
 * often gets it wrong or misses it), and an ambiguous spoken name shows the
 * matching contacts to pick from first.
 */
export function ConfirmSheet({
  mode,
  initialAmount,
  target: initialTarget,
  choices,
  busy,
  onCancel,
  onConfirm,
}: {
  mode: 'transfer' | 'request';
  initialAmount?: number;
  target?: Target;
  choices?: { name: string; matches: DeviceContact[] };
  busy: boolean;
  onCancel: () => void;
  onConfirm: (amount: number, target: Target) => void;
}) {
  const styles = useStyles();
  const t = useText();
  const [target, setTarget] = useState<Target | undefined>(initialTarget);
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '');
  const [error, setError] = useState<string | null>(null);

  const confirm = () => {
    const value = parseAmount(amount);
    if (value == null) return setError('Please enter a valid amount.');
    if (target) onConfirm(value, target);
  };

  if (!target && choices) {
    return (
      <Sheet visible onClose={onCancel} dismissable={!busy} title={`Which ${choices.name}?`}>
        <View style={styles.body}>
          <List>
            {choices.matches.map((c) => (
              <Row
                key={c.id}
                left={<Avatar name={c.name} size={40} />}
                title={c.name}
                subtitle={c.phone}
                chevron
                onPress={() => setTarget(targetFromContact(c))}
              />
            ))}
          </List>
          <AppButton label="Cancel" variant="secondary" onPress={onCancel} />
        </View>
      </Sheet>
    );
  }

  if (!target) return null;

  return (
    <Sheet visible onClose={onCancel} dismissable={!busy}>
      <View style={styles.body}>
        <View style={styles.who}>
          <Avatar name={target.label} size={56} dark />
          <Text style={t.kick}>{mode === 'transfer' ? 'Voice pay' : 'Request money'}</Text>
          <Text style={styles.to}>
            {mode === 'transfer' ? 'to' : 'from'} <Text style={styles.strong}>{target.label}</Text>
            {target.kind === 'phone' && target.label !== target.phone ? ` · ${target.phone}` : ''}
          </Text>
        </View>
        <AmountField value={amount} onChangeText={setAmount} autoFocus={!initialAmount} />
        {error ? <Notice tone="err">{error}</Notice> : null}
        <View style={styles.actions}>
          <AppButton label="Cancel" variant="secondary" onPress={onCancel} disabled={busy} style={styles.grow} />
          <AppButton label={mode === 'transfer' ? 'Confirm' : 'Send request'} onPress={confirm} loading={busy} style={styles.grow} />
        </View>
      </View>
    </Sheet>
  );
}

const useStyles = makeStyles((C) => ({
  body: { gap: 16 },
  grow: { flex: 1 },
  who: { alignItems: 'center', gap: 8, marginBottom: 4 },
  to: { fontFamily: Fonts.regular, fontSize: 15, color: C.inkSoft, textAlign: 'center' },
  strong: { fontFamily: Fonts.semibold, color: C.ink },
  actions: { flexDirection: 'row', gap: 10 },
}));
