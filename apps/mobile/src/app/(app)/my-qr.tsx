import { Asset, requestPermissionsAsync } from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';

import { ActionBar, AppButton, Avatar, IconButton, LogoMark, Screen, Stagger, toast, TopNav, useText } from '@/core/components';
import { Colors, Fonts, makeStyles, Radius } from '@/core/theme';
import { useProfile } from '@/features/account/hooks';
import { buildUpiUri } from '@/features/payments/upi-qr';
import { useCopyUpi } from '@/features/profile/use-copy-upi';

const STEPS = ['Show this QR to anyone who wants to pay you', 'They scan it with any UPI app', 'Money is received instantly'];

export default function MyQrScreen() {
  const styles = useStyles();
  const t = useText();
  const profile = useProfile();
  const name = profile.data?.userName || 'User';
  const upiId = profile.data?.upiId ?? '';
  const card = useRef<ComponentRef<typeof View>>(null);
  const [saving, setSaving] = useState(false);

  const capture = () => captureRef(card, { format: 'png', quality: 1, result: 'tmpfile' });

  const share = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) return toast('Sharing is not available on this device', 'error');
      await Sharing.shareAsync(await capture(), { mimeType: 'image/png', dialogTitle: 'Share my TunePay QR' });
    } catch {
      toast('Could not share the QR code', 'error');
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const { granted } = await requestPermissionsAsync(true);
      if (!granted) return toast('Allow photo access to save the QR', 'error');
      await Asset.create(await capture());
      toast('Saved to your photos', 'success');
    } catch {
      toast('Could not save the QR code', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copy = useCopyUpi(upiId);

  return (
    <Screen
      footer={
        <ActionBar>
          <AppButton label="Share QR" onPress={share} disabled={!upiId} />
          <AppButton label="Save to photos" variant="secondary" loading={saving} onPress={save} disabled={!upiId} />
        </ActionBar>
      }>
      <TopNav title="My QR" right={<IconButton icon="share-outline" accessibilityLabel="Share QR" onPress={share} />} />

      <Stagger>
        {/* The card is the picture that gets shared, so it is drawn in the
            fixed brand colours — it looks the same whatever the theme. */}
        <View ref={card} collapsable={false} style={styles.card}>
          <View style={styles.person}>
            <Avatar name={name} size={46} dark />
            <View style={styles.grow}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              <Pressable onPress={upiId ? copy : undefined} accessibilityLabel="Copy UPI ID" hitSlop={6}>
                <Text style={styles.upi}>{upiId || '—'}</Text>
              </Pressable>
            </View>
            <LogoMark size={26} color={Colors.ink} />
          </View>
          <View style={styles.qr}>
            {upiId ? (
              <QRCode value={buildUpiUri({ upiId, name })} size={216} color={Colors.ink} backgroundColor={Colors.white} />
            ) : (
              <View style={styles.qrPlaceholder} />
            )}
          </View>
          <Text style={styles.scan}>Scan to pay me</Text>
        </View>

        <View style={styles.steps}>
          <Text style={t.kick}>How it works</Text>
          {STEPS.map((text, i) => (
            <View key={text} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={[t.sm, styles.grow]}>{text}</Text>
            </View>
          ))}
        </View>
      </Stagger>
    </Screen>
  );
}

const useStyles = makeStyles((C) => ({
  grow: { flex: 1, minWidth: 0 },
  card: {
    marginTop: 8,
    padding: 22,
    gap: 18,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    backgroundColor: Colors.white,
    boxShadow: '0 22px 44px -24px rgba(10,10,11,0.3)',
  },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontFamily: Fonts.medium, fontSize: 17, color: Colors.ink, letterSpacing: -0.2 },
  upi: { marginTop: 2, fontFamily: Fonts.regular, fontSize: 13, color: Colors.inkSoft },
  qr: { alignItems: 'center', paddingVertical: 6 },
  qrPlaceholder: { width: 216, height: 216, borderRadius: 16, backgroundColor: Colors.surface2 },
  scan: {
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.muted,
  },
  steps: { marginTop: 26, gap: 12 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontFamily: Fonts.bold, fontSize: 12, color: C.white },
}));
