import { CameraView, scanFromURLAsync, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppButton,
  Icon,
  IconButton,
  LiquidGlass,
  sheetSurface,
  toast,
  ToneProvider,
  useText,
  type IconName,
} from '@/core/components';
import { Colors, Fonts, makeStyles, Motion, Radius, useColors } from '@/core/theme';
import { useReduceMotion } from '@/core/use-reduce-motion';
import { parseUpiQr, type UpiQr } from '@/features/payments/upi-qr';

const FRAME = 260;

export default function QrScannerScreen() {
  const C = useColors();
  const styles = useStyles();
  const t = useText();
  const [permission, requestPermission] = useCameraPermissions();
  const focused = useIsFocused();
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState<{ raw: string; upi: UpiQr | null } | null>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) requestPermission();
  }, [permission, requestPermission]);

  const handle = (raw: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setScanned({ raw, upi: parseUpiQr(raw) });
  };

  const onBarcode = ({ data }: BarcodeScanningResult) => {
    if (!scanned && data) handle(data);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (result.canceled || !result.assets[0]) return;
    try {
      const [code] = await scanFromURLAsync(result.assets[0].uri, ['qr']);
      if (code?.data) handle(code.data);
      else toast('No QR code found in that image', 'error');
    } catch {
      toast('Could not read that image', 'error');
    }
  };

  const proceed = () => {
    if (!scanned?.upi) return;
    const { upiId, name, amount } = scanned.upi;
    router.replace({ pathname: '/pay/upi', params: { upi: upiId, name: name ?? '', amount: amount ?? '' } });
  };

  return (
    <View style={styles.root}>
      {/* This screen is always dark; only while focused, or screens pushed on
          top (My QR) inherit it. */}
      {focused ? <StatusBar style="light" /> : null}
      {permission?.granted ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : onBarcode}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.noCamera]}>
          <Icon name="camera-outline" size={34} color="rgba(247,248,249,0.6)" />
          <Text style={styles.noCameraText}>
            {permission && !permission.canAskAgain
              ? 'Camera access is off. Enable it in settings to scan QR codes.'
              : 'Camera permission is needed to scan QR codes.'}
          </Text>
        </View>
      )}

      {/* Keeps the white header readable over bright scenes. */}
      <LinearGradient colors={['rgba(6,7,9,0.75)', 'rgba(6,7,9,0)']} style={styles.topScrim} pointerEvents="none" />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        {/* Over the camera the chrome is always the dark, lit edition. */}
        <ToneProvider value="dark">
          <View style={styles.topBar}>
            <IconButton icon="chevron-back" variant="lit" color={Colors.commitInk} accessibilityLabel="Back" onPress={() => router.back()} />
            <Text style={styles.title}>Scan & pay</Text>
            <IconButton
              icon={torch ? 'flash' : 'flash-off-outline'}
              variant="lit"
              color={Colors.commitInk}
              accessibilityLabel={torch ? 'Turn torch off' : 'Turn torch on'}
              onPress={() => setTorch((v) => !v)}
            />
          </View>
        </ToneProvider>

        {permission?.granted && !scanned ? <ScanFrame /> : null}
        <View style={styles.flex} />

        <View style={styles.panel}>
          {scanned ? (
            <Animated.View entering={FadeInDown.duration(320).easing(Motion.out)} style={styles.result}>
              <View style={styles.resultHead}>
                <View style={styles.tick}>
                  <Icon name="checkmark" size={14} color={C.white} />
                </View>
                <Text style={t.kick}>QR scanned</Text>
              </View>
              {scanned.upi ? (
                <>
                  <Line label="UPI ID" value={scanned.upi.upiId} />
                  {scanned.upi.name ? <Line label="Name" value={scanned.upi.name} /> : null}
                  {scanned.upi.amount ? <Line label="Amount" value={`₹${scanned.upi.amount}`} /> : null}
                  <AppButton label="Proceed to pay" onPress={proceed} style={styles.proceed} />
                </>
              ) : (
                <Text style={t.cap} numberOfLines={3}>
                  Not a UPI payment code: {scanned.raw}
                </Text>
              )}
            </Animated.View>
          ) : !permission?.granted ? (
            <AppButton
              label={permission && !permission.canAskAgain ? 'Open settings' : 'Allow camera'}
              onPress={() => (permission && !permission.canAskAgain ? Linking.openSettings() : requestPermission())}
            />
          ) : (
            <View style={styles.prompt}>
              <Text style={t.t4}>Point the camera at a QR</Text>
              <Text style={t.cap}>Any UPI QR code works.</Text>
            </View>
          )}
          <View style={styles.actions}>
            <Action icon="images-outline" label="Gallery" onPress={pickFromGallery} />
            <Action icon="qr-code-outline" label="My QR" onPress={() => router.push('/my-qr')} />
            <Action icon="refresh" label="Rescan" onPress={() => setScanned(null)} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

/** Four soft corners and a line that sweeps between them. */
function ScanFrame() {
  const styles = useStyles();
  const reduce = useReduceMotion();
  const y = useSharedValue(0);
  useEffect(() => {
    if (!reduce) y.set(withRepeat(withTiming(1, { duration: 1800, easing: Motion.inOut }), -1, true));
  }, [reduce, y]);
  const line = useAnimatedStyle(() => ({ transform: [{ translateY: 14 + y.get() * (FRAME - 30) }] }));
  return (
    <View style={styles.frameWrap} pointerEvents="none">
      <View style={styles.frame}>
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
        <Animated.View style={[styles.scanLine, line]} />
      </View>
    </View>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  const styles = useStyles();
  const t = useText();
  return (
    <View style={styles.line}>
      <Text style={[t.cap, styles.lineLabel]}>{label}</Text>
      <Text style={[t.r1, styles.flex]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Action({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const styles = useStyles();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.flex, pressed && styles.pressed]} accessibilityRole="button">
      <LiquidGlass radius={Radius.tile} weight="strong" bevel={false} style={styles.action}>
        <Icon name={icon} size={20} />
        <Text style={styles.actionLabel}>{label}</Text>
      </LiquidGlass>
    </Pressable>
  );
}

const CORNER = 34;

const useStyles = makeStyles((C, scheme) => ({
  root: { flex: 1, backgroundColor: '#060709' },
  topScrim: { position: 'absolute', top: 0, left: 0, right: 0, height: 200 },
  overlay: { flex: 1 },
  flex: { flex: 1 },
  pressed: { opacity: 0.72 },
  noCamera: { alignItems: 'center', justifyContent: 'center', gap: 14, padding: 40, paddingBottom: 260 },
  noCameraText: { textAlign: 'center', fontFamily: Fonts.regular, fontSize: 14.5, lineHeight: 21, color: 'rgba(247,248,249,0.74)' },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8 },
  title: { flex: 1, textAlign: 'center', fontFamily: Fonts.semibold, fontSize: 15, color: Colors.commitInk },
  frameWrap: { alignItems: 'center', marginTop: 48 },
  frame: { width: FRAME, height: FRAME },
  corner: { position: 'absolute', width: CORNER, height: CORNER, borderColor: Colors.commitInk },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 22 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 22 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 22 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 22 },
  scanLine: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.blue,
    boxShadow: '0 0 12px rgba(77,169,252,0.9)',
  },
  panel: {
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 20,
    gap: 16,
    borderRadius: Radius.sheet,
    borderCurve: 'continuous',
    ...sheetSurface(scheme),
  },
  result: { gap: 10 },
  resultHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tick: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  line: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lineLabel: { width: 70 },
  proceed: { marginTop: 6 },
  prompt: { alignItems: 'center', gap: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  action: { alignItems: 'center', gap: 6, paddingVertical: 14 },
  actionLabel: { fontFamily: Fonts.semibold, fontSize: 12, color: C.ink },
}));
