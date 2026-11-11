import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { ApiException } from '@/core/api/client';
import { AppButton, Field, Icon, List, Row, Sheet, Wordmark } from '@/core/components';
import { Fonts, makeStyles, useColors } from '@/core/theme';
import { sendOtp } from '@/features/auth/api';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { InlineError, nudge } from '@/features/auth/components/InlineError';

const COUNTRY_CODES = ['+91', '+1', '+44', '+61', '+971'];

export default function PhoneNumberScreen() {
  const C = useColors();
  const styles = useStyles();
  const [code, setCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!phone) return nudge(setError, 'Please enter phone number');
    if (phone.length !== 10) return nudge(setError, 'Phone number must be 10 digits');

    setError(null);
    setLoading(true);
    const full = `${code}${phone}`;
    try {
      const devOtp = await sendOtp(full);
      router.push({ pathname: '/verify-otp', params: { phone: full, devOtp: devOtp ?? '' } });
    } catch (e) {
      setError(e instanceof ApiException ? e.message : 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      step={1}
      top={<Wordmark style={styles.brand} />}
      title={"What's your\nphone number?"}
      footer={
        <>
          <InlineError message={error} />
          <AppButton label="Send code" loading={loading} onPress={submit} />
          <Text style={styles.trust}>By continuing you agree to our Terms & Privacy.</Text>
        </>
      }>
      <Field
        label="Mobile number"
        value={phone}
        onChangeText={(t) => {
          setPhone(t.replace(/\D/g, '').slice(0, 10));
          setError(null);
        }}
        placeholder="Mobile number"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
        maxLength={10}
        autoFocus
        onSubmitEditing={submit}
        style={styles.input}
        left={
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={({ pressed }) => [styles.code, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Country code">
            <Text style={styles.codeText}>{code}</Text>
            <Icon name="chevron-down" size={14} color={C.inkSoft} />
          </Pressable>
        }
      />

      <Sheet visible={pickerOpen} onClose={() => setPickerOpen(false)} title="Country code">
        <List>
          {COUNTRY_CODES.map((c) => (
            <Row
              key={c}
              title={c}
              onPress={() => {
                Haptics.selectionAsync();
                setCode(c);
                setPickerOpen(false);
              }}
              right={c === code ? <Icon name="checkmark" size={18} /> : undefined}
            />
          ))}
        </List>
      </Sheet>
    </AuthLayout>
  );
}

const useStyles = makeStyles((C) => ({
  brand: { marginBottom: 28 },
  code: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 14,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: C.soft2,
  },
  codeText: { fontFamily: Fonts.semibold, fontSize: 15, color: C.ink },
  input: { letterSpacing: 0.4 },
  pressed: { opacity: 0.6 },
  trust: {
    textAlign: 'center',
    fontSize: 11.5,
    lineHeight: 16,
    color: C.fieldTextDim,
    maxWidth: 280,
    alignSelf: 'center',
    fontFamily: Fonts.regular,
  },
}));
