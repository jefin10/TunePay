import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton, IconButton, List, Row, RowIcon, Screen, Section, Sheet, Stagger, Surface, useText, type IconName } from '@/core/components';
import { Fonts, makeStyles } from '@/core/theme';
import { MicButton } from '@/features/voice/components/MicButton';
import { ServerStatus } from '@/features/voice/components/ServerStatus';

const EXAMPLES = ['Send ₹500 to 9876543210', "What's my balance?", 'Request ₹300 from Mom'];

const PLAYBOOK: { icon: IconName; title: string; example: string }[] = [
  { icon: 'paper-plane-outline', title: 'Send money', example: '"Send 500 to 98765 43210"' },
  { icon: 'wallet-outline', title: 'Check balance', example: '"What\'s my balance?"' },
  { icon: 'arrow-down-circle-outline', title: 'Request money', example: '"Request 300 from Mom"' },
  { icon: 'chatbubble-outline', title: 'Just chat', example: '"Hello, how are you?"' },
];

export default function VoiceTab() {
  const styles = useStyles();
  const t = useText();
  const [helpOpen, setHelpOpen] = useState(false);
  const openSpeech = () => router.push('/speech');

  return (
    <Screen docked>
      <Stagger>
        <View style={styles.nav}>
          <Text style={styles.heading}>Voice</Text>
          <ServerStatus />
          <IconButton icon="help" accessibilityLabel="What can I say?" onPress={() => setHelpOpen(true)} />
        </View>

        <View style={styles.hero}>
          <Text style={t.t1}>{'Speak it.\nWe pay it.'}</Text>
        </View>

        <View style={styles.micArea}>
          <MicButton listening={false} onPress={openSpeech} accessibilityLabel="Tap to speak" />
          <Text style={t.cap}>Tap to speak</Text>
        </View>

        <Section title="Try saying">
          <View style={styles.examples}>
            {EXAMPLES.map((e) => (
              <Surface key={e} onPress={openSpeech}>
                <View style={styles.quote}>
                  <Text style={styles.quoteMark}>“</Text>
                </View>
                <Text style={[t.sm, styles.grow]}>{e}</Text>
              </Surface>
            ))}
          </View>
        </Section>

        <AppButton label="Start voice command" onPress={openSpeech} style={styles.cta} />
      </Stagger>

      <Sheet visible={helpOpen} onClose={() => setHelpOpen(false)} title="Things you can say">
        <List>
          {PLAYBOOK.map((p) => (
            <Row key={p.title} left={<RowIcon name={p.icon} />} title={p.title} subtitle={p.example} />
          ))}
        </List>
        <AppButton label="Got it" onPress={() => setHelpOpen(false)} style={styles.gotIt} />
      </Sheet>
    </Screen>
  );
}

const useStyles = makeStyles((C) => ({
  grow: { flex: 1, minWidth: 0 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  heading: { flex: 1, fontFamily: Fonts.light, fontSize: 28, lineHeight: 34, color: C.ink, letterSpacing: -0.8, marginTop: 6 },
  hero: { marginTop: 26, gap: 10 },
  micArea: { alignItems: 'center', gap: 4, marginTop: 12 },
  examples: { gap: 8 },
  quote: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' },
  quoteMark: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 24, color: C.blue600 },
  cta: { marginTop: 24 },
  gotIt: { marginTop: 16 },
}));
