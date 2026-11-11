import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ApiException } from '@/core/api/client';
import { AppButton } from '@/core/components';
import { useSession } from '@/core/storage/session';
import { Fonts, makeStyles } from '@/core/theme';
import { sendOtp, verifyOtp } from '@/features/auth/api';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { InlineError, nudge } from '@/features/auth/components/InlineError';
import { OtpInput, type OtpInputHandle } from '@/features/auth/components/OtpInput';

const RESEND_SECONDS = 30;

export default function VerifyOtpScreen() {
  const styles = useStyles();
  const params = useLocalSearchParams<{ phone: string; devOtp?: string }>();
  const phone = params.phone ?? '';
  const [devOtp, setDevOtp] = useState(params.devOtp || null);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const otpRef = useRef<OtpInputHandle>(null);
  const { setPhoneNumber, saveSession } = useSession();

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const reject = (message: string) => {
    nudge(setError, message);
    setCode('');
    otpRef.current?.reject();
  };

  const verify = async (otp = code) => {
    if (otp.length !== 6) return reject('Please enter the complete OTP');
    setError(null);
    setVerifying(true);
    try {
      const result = await verifyOtp(phone, otp);
      setPhoneNumber(result.phoneNumber);
      if (result.isNewUser) {
        router.replace({ pathname: '/name-entry', params: { phone: result.phoneNumber } });
      } else {
        // Flipping isLoggedIn hands navigation to the root guards (→ biometric).
        saveSession({
          phoneNumber: result.phoneNumber,
          userName: result.profile?.userName,
          upiId: result.profile?.upiId,
        });
      }
    } catch (e) {
      reject(e instanceof ApiException ? e.message : 'Network error. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const resend = async () => {
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      setDevOtp(await sendOtp(phone));
      setTimer(RESEND_SECONDS);
    } catch (e) {
      setError(e instanceof ApiException ? e.message : 'Could not resend the code.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthLayout
      step={2}
      title={'Enter the\n6-digit code.'}
      footer={
        <>
          <InlineError message={error} />
          <AppButton label="Verify & continue" loading={verifying} onPress={() => verify()} />
        </>
      }>
      <OtpInput
        ref={otpRef}
        onComplete={(otp) => {
          setCode(otp);
          verify(otp);
        }}
      />

      <View style={styles.resendRow}>
        <Text style={styles.prompt}>{"Didn't get it?"}</Text>
        {timer > 0 ? (
          <Text style={styles.count}>Resend in {timer}s</Text>
        ) : (
          <Pressable onPress={resend} disabled={sending} accessibilityRole="button" hitSlop={8}>
            <Text style={[styles.link, sending && styles.dim]}>{sending ? 'Sending' : 'Resend code'}</Text>
          </Pressable>
        )}
      </View>

      {__DEV__ && devOtp ? <Text style={styles.devHint}>Dev build · backend returned code {devOtp}</Text> : null}
    </AuthLayout>
  );
}

const useStyles = makeStyles((C) => ({
  resendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 },
  prompt: { fontFamily: Fonts.regular, fontSize: 13.5, color: C.fieldTextSoft },
  count: { fontFamily: Fonts.semibold, fontSize: 13.5, color: C.fieldTextDim },
  link: { fontFamily: Fonts.bold, fontSize: 13.5, color: C.fieldText },
  dim: { color: C.fieldTextDim },
  devHint: { marginTop: 14, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 12, color: C.fieldTextDim },
}));
