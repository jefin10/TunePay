import { InfoRow, Kick, List, Notice, Screen, Stagger, ToggleRow, TopNav } from '@/core/components';
import { useSession } from '@/core/storage/session';
import { makeStyles } from '@/core/theme';

export default function SecurityScreen() {
  const styles = useStyles();
  const enabled = useSession((s) => s.flags.biometricEnabled);
  const setFlag = useSession((s) => s.setFlag);

  return (
    <Screen>
      <TopNav large title="Security" />

      <Stagger>
        <Kick style={styles.kick}>Authentication</Kick>
        <List>
          <ToggleRow
            icon="finger-print"
            title="Biometric lock"
            value={enabled}
            onValueChange={(v) => setFlag('biometricEnabled', v)}
          />
        </List>

        <Kick style={styles.kick}>UPI protection</Kick>
        <List>
          <InfoRow icon="lock-closed-outline" label="UPI PIN" value="Managed by your bank app" />
          <InfoRow icon="shield-checkmark-outline" label="Voice payments" value="Confirm before sending" />
        </List>

        <Notice icon="information-circle-outline" style={styles.note}>
          Your PIN stays with your bank. TunePay never asks for or stores your UPI PIN. With the biometric lock on, the
          app asks for your fingerprint, face or device PIN on launch and before voice payments.
        </Notice>
      </Stagger>
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  kick: { marginTop: 20, marginBottom: 10 },
  note: { marginTop: 20, alignItems: 'flex-start' },
}));
