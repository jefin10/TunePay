import { Text, View } from 'react-native';

import { Avatar, Badge, Surface, useText } from '@/core/components';
import { makeStyles } from '@/core/theme';

/** Found recipient: initials, name, handle and a verified badge. */
export function RecipientCard({ name, subtitle, verified = true }: { name: string; subtitle?: string; verified?: boolean }) {
  const styles = useStyles();
  const t = useText();
  return (
    <Surface>
      <Avatar name={name || '?'} size={46} />
      <View style={styles.grow}>
        <Text style={t.t4} numberOfLines={1}>
          {name || 'Unknown user'}
        </Text>
        {subtitle ? (
          <Text style={t.r2} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {verified ? <Badge label="Verified" variant="ink" /> : null}
    </Surface>
  );
}

const useStyles = makeStyles(() => ({
  grow: { flex: 1, minWidth: 0 },
}));
