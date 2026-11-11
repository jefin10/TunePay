import { useState } from 'react';
import { View } from 'react-native';

import { AppButton, Field, Notice, Sheet } from '@/core/components';
import { useSession } from '@/core/storage/session';
import { makeStyles } from '@/core/theme';
import { isUpiId, localPhone, toIndianE164 } from '@/core/utils/phone';

import { parseAmount } from '../amount';
import { createMoneyRequest, createMoneyRequestByUpi } from '../api';
import { AmountField } from './AmountField';

/** Ask someone (by phone number or UPI ID) to pay you. */
export function NewRequestSheet({ visible, onClose, onSent }: { visible: boolean; onClose: () => void; onSent: () => void }) {
  const styles = useStyles();
  const requesterPhone = useSession((s) => s.phoneNumber) ?? '';
  const [who, setWho] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setWho('');
    setAmount('');
    setMessage('');
    setError(null);
  };

  const send = async () => {
    const target = who.trim();
    const value = parseAmount(amount);
    const byUpi = isUpiId(target);
    if (!byUpi && localPhone(target).length !== 10) return setError('Enter a 10-digit phone number or a UPI ID.');
    if (value == null) return setError('Please enter a valid amount.');

    setError(null);
    setSending(true);
    const result = byUpi
      ? await createMoneyRequestByUpi({ requesterPhone, requesteeUpi: target, amount: value, message: message.trim() })
      : await createMoneyRequest({
          requesterPhone,
          requesteePhone: toIndianE164(target),
          amount: value,
          message: message.trim(),
        });
    setSending(false);
    if (result.success) {
      reset();
      onSent();
    } else {
      setError(result.message);
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose} dismissable={!sending} title="Ask someone to pay you">
      <View style={styles.body}>
        <Field
          label="Phone number or UPI ID"
          value={who}
          onChangeText={setWho}
          placeholder="98765 43210 or name@upi"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Phone number or UPI ID"
        />
        <AmountField value={amount} onChangeText={setAmount} />
        <Field label="Note (optional)" value={message} onChangeText={setMessage} placeholder="Add a note" maxLength={80} />
        {error ? <Notice tone="err">{error}</Notice> : null}
        <View style={styles.actions}>
          <AppButton label="Cancel" variant="secondary" onPress={onClose} disabled={sending} style={styles.grow} />
          <AppButton label="Send request" onPress={send} loading={sending} style={styles.grow} />
        </View>
      </View>
    </Sheet>
  );
}

const useStyles = makeStyles(() => ({
  body: { gap: 16 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  grow: { flex: 1 },
}));
