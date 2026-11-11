import Constants from 'expo-constants';
import { Text, View } from 'react-native';

import { Cap, InfoRow, List, LiquidGlass, LogoMark, Screen, Stagger, T3, TopNav, useText } from '@/core/components';
import { makeStyles } from '@/core/theme';

export default function AboutScreen() {
  const styles = useStyles();
  const t = useText();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <Screen>
      <TopNav title="About" />
      <Stagger>
        <View style={styles.brand}>
          <LiquidGlass radius={26} weight="strong" style={styles.logo}>
            <LogoMark size={40} />
          </LiquidGlass>
          <View>
            <T3>TunePay</T3>
            <Cap>Version {version}</Cap>
          </View>
        </View>

        <Text style={[t.soft, styles.blurb]}>
          Pay with your voice. TunePay lets you send and receive money just by speaking. Built for speed, designed for
          trust.
        </Text>

        <List>
          <InfoRow label="Version" value={version} />
          <InfoRow label="Platform" value="React Native · Expo" />
          <InfoRow label="License" value="Educational use" />
        </List>
      </Stagger>
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 },
  logo: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center' },
  blurb: { marginVertical: 24 },
}));
