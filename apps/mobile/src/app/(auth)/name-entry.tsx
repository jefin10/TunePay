import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { ApiException } from '@/core/api/client';
import { AppButton, Field, Notice } from '@/core/components';
import { useSession } from '@/core/storage/session';
import { makeStyles } from '@/core/theme';
import { signUp } from '@/features/auth/api';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { InlineError, nudge } from '@/features/auth/components/InlineError';

export default function NameEntryScreen() {
  const styles = useStyles();
  const { phone = '' } = useLocalSearchParams<{ phone: string }>();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveSession = useSession((s) => s.saveSession);

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return nudge(setError, 'Please enter your name');
    if (trimmed.length < 2) return nudge(setError, 'Name must be at least 2 characters');

    setError(null);
    setLoading(true);
    try {
      const profile = await signUp({ phoneNumber: phone, upiName: trimmed });
      saveSession({ phoneNumber: profile.phoneNumber, userName: profile.userName, upiId: profile.upiId });
    } catch (e) {
      setError(e instanceof ApiException ? e.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      step={3}
      title={'What should we\ncall you?'}
      footer={
        <>
          <InlineError message={error} />
          <AppButton label="Create account" loading={loading} onPress={submit} />
        </>
      }>
      <Field
        label="Full name"
        value={name}
        onChangeText={(t) => {
          setName(t);
          setError(null);
        }}
        placeholder="Your full name"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="done"
        autoFocus
        onSubmitEditing={submit}
      />

      <Notice icon="gift-outline" style={styles.perk}>
        A welcome balance of ₹5,000 is ready to spend as soon as you are in.
      </Notice>
    </AuthLayout>
  );
}

const useStyles = makeStyles(() => ({
  perk: { marginTop: 18 },
}));
