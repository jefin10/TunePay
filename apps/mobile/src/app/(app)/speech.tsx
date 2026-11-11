import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { confirmWithBiometrics } from '@/core/biometrics';
import {
  AppDialog,
  Card,
  Chip,
  DialogActions,
  Entrance,
  Icon,
  Notice,
  Screen,
  toast,
  TopNav,
  useText,
} from '@/core/components';
import { useSession } from '@/core/storage/session';
import { Fonts, makeStyles, useColors } from '@/core/theme';
import { formatINR } from '@/core/utils/format';
import { getBalance } from '@/features/account/api';
import { useRefreshAccount } from '@/features/account/hooks';
import { createMoneyRequest, createMoneyRequestByUpi, sendByPhone, sendByUpiId } from '@/features/payments/api';
import { SuccessDialog } from '@/features/payments/components/SuccessDialog';
import type { DeviceContact } from '@/features/payments/contacts';
import { processCommand } from '@/features/voice/api';
import { ConfirmSheet } from '@/features/voice/components/ConfirmSheet';
import { MicButton } from '@/features/voice/components/MicButton';
import { ServerStatus } from '@/features/voice/components/ServerStatus';
import { useVoiceServerHealth } from '@/features/voice/hooks';
import { resolveRecipient, type Target } from '@/features/voice/resolve';
import { useSpeech } from '@/features/voice/use-speech';

const SAMPLES = ['Send ₹500 to 9876543210', "What's my balance?", 'Request ₹200 from 9123456789'];

type Pending = {
  mode: 'transfer' | 'request';
  amount?: number;
  target?: Target;
  choices?: { name: string; matches: DeviceContact[] };
};

export default function SpeechScreen() {
  const C = useColors();
  const styles = useStyles();
  const t = useText();
  const { phoneNumber, flags } = useSession();
  const online = useVoiceServerHealth().data === true;
  const refreshAccount = useRefreshAccount();

  const [processing, setProcessing] = useState(false);
  const [reply, setReply] = useState<{ text: string; ok: boolean } | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [executing, setExecuting] = useState(false);
  const [done, setDone] = useState<{ title: string; message: string } | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const handleCommand = async (text: string) => {
    if (!online) {
      setReply({ text: 'Voice server is offline. Check that the backend is running.', ok: false });
      return;
    }
    setReply(null);
    setProcessing(true);
    try {
      const outcome = await processCommand(text, phoneNumber ?? '');
      if (!outcome.success) return setReply({ text: outcome.message, ok: false });

      if (outcome.action === 'transfer' || outcome.action === 'request') {
        const resolution = await resolveRecipient(outcome);
        if (resolution.status === 'failed') return setReply({ text: resolution.message, ok: false });
        setPending({
          mode: outcome.action,
          amount: outcome.amount,
          ...(resolution.status === 'resolved'
            ? { target: resolution.target }
            : { choices: { name: resolution.name, matches: resolution.matches } }),
        });
      } else if (outcome.action === 'balance') {
        if (!(await confirmWithBiometrics('Authenticate to view your balance', flags.biometricEnabled))) {
          return setReply({ text: 'Authentication cancelled', ok: false });
        }
        setBalance(await getBalance(phoneNumber ?? ''));
      } else {
        setReply({ text: outcome.message, ok: true });
      }
    } catch (e) {
      setReply({ text: e instanceof Error ? e.message : 'Something went wrong.', ok: false });
    } finally {
      setProcessing(false);
    }
  };

  const speech = useSpeech(handleCommand);

  const execute = async (amount: number, target: Target) => {
    if (!pending) return;
    const verb = pending.mode === 'transfer' ? 'send' : 'request';
    if (!(await confirmWithBiometrics(`Authenticate to ${verb} ${formatINR(amount)}`, flags.biometricEnabled))) {
      return toast('Authentication cancelled', 'error');
    }
    const me = phoneNumber ?? '';
    setExecuting(true);
    const result =
      pending.mode === 'transfer'
        ? target.kind === 'upi'
          ? await sendByUpiId({ senderPhone: me, receiverUpi: target.upiId, amount })
          : await sendByPhone({ senderPhone: me, receiverPhone: target.phone, amount })
        : target.kind === 'upi'
          ? await createMoneyRequestByUpi({ requesterPhone: me, requesteeUpi: target.upiId, amount })
          : await createMoneyRequest({ requesterPhone: me, requesteePhone: target.phone, amount });
    setExecuting(false);
    if (!result.success) return toast(result.message, 'error');

    setPending(null);
    refreshAccount();
    setDone(
      pending.mode === 'transfer'
        ? { title: 'Payment sent', message: `${formatINR(amount)} to ${target.label}` }
        : { title: 'Request sent', message: `Asked ${target.label} for ${formatINR(amount)}` },
    );
  };

  const runSample = (sample: string) => {
    speech.setTranscript(sample);
    handleCommand(sample.replace('₹', ''));
  };

  const showIntro = !speech.listening && !speech.transcript && !processing && !reply;

  return (
    <Screen scroll={false}>
      <TopNav title="Voice pay" right={<ServerStatus />} />

      <View style={styles.body}>
        {showIntro ? (
          <Entrance style={styles.intro}>
            <Text style={t.t1}>{'Just say what\nyou want to do.'}</Text>
            <View style={styles.samples}>
              {SAMPLES.map((s) => (
                <Chip key={s} label={s} onPress={() => runSample(s)} />
              ))}
            </View>
          </Entrance>
        ) : null}

        {speech.listening || speech.transcript ? (
          <Entrance distance={8}>
            <Card style={styles.card}>
              {speech.listening ? (
                <View style={styles.listeningRow}>
                  <View style={styles.liveDot} />
                  <Text style={[t.kick, { color: C.blue600 }]}>Listening</Text>
                </View>
              ) : null}
              <Text style={styles.transcript}>{speech.transcript ? `“${speech.transcript}”` : 'Say something…'}</Text>
            </Card>
          </Entrance>
        ) : null}

        {processing ? (
          <View style={styles.processing}>
            <ActivityIndicator color={C.ink} />
            <Text style={t.cap}>Working it out…</Text>
          </View>
        ) : null}

        {reply || speech.error ? (
          <Entrance distance={8}>
            <Notice
              icon={reply?.ok ? 'sparkles-outline' : undefined}
              tone={reply?.ok ? 'soft' : 'err'}
              style={styles.reply}>
              {reply?.text ?? speech.error}
            </Notice>
            <Pressable onPress={() => setReply(null)} hitSlop={8} accessibilityLabel="Dismiss" style={styles.dismiss}>
              <Icon name="close" size={16} color={C.muted} />
            </Pressable>
          </Entrance>
        ) : null}
      </View>

      <View style={styles.micArea}>
        <MicButton
          listening={speech.listening}
          disabled={processing}
          onPress={() => (speech.listening ? speech.stop() : speech.start())}
        />
        <Text style={t.cap}>{speech.listening ? 'Tap to stop' : 'Tap to speak'}</Text>
      </View>

      {pending ? (
        <ConfirmSheet
          mode={pending.mode}
          initialAmount={pending.amount}
          target={pending.target}
          choices={pending.choices}
          busy={executing}
          onCancel={() => setPending(null)}
          onConfirm={execute}
        />
      ) : null}

      <SuccessDialog visible={done != null} title={done?.title ?? ''} message={done?.message ?? ''} onDone={() => setDone(null)} />

      <AppDialog visible={balance != null} onClose={() => setBalance(null)}>
        <Text style={t.kick}>Available balance</Text>
        <Text style={styles.balance}>{formatINR(balance ?? 0)}</Text>
        <DialogActions actions={[{ text: 'Done', onPress: () => setBalance(null) }]} />
      </AppDialog>
    </Screen>
  );
}

const useStyles = makeStyles((C) => ({
  body: { flex: 1, marginTop: 18, gap: 14 },
  intro: { gap: 18 },
  samples: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { gap: 10, padding: 20 },
  listeningRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue, boxShadow: '0 0 8px rgba(77,169,252,0.8)' },
  transcript: { fontFamily: Fonts.light, fontSize: 24, lineHeight: 30, letterSpacing: -0.4, color: C.ink },
  processing: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  reply: { paddingRight: 40 },
  dismiss: { position: 'absolute', right: 14, top: 14 },
  micArea: { alignItems: 'center', gap: 2, paddingBottom: 8 },
  balance: {
    marginTop: 8,
    fontFamily: Fonts.light,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -1.4,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
}));
