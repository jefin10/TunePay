import { ActivityIndicator, Pressable, TextInput, type TextInputProps } from 'react-native';

import { Icon, LiquidGlass, type IconName } from '@/core/components';
import { Fonts, makeStyles, Radius, useColors } from '@/core/theme';

/** A glass field with a leading icon and a round ink search button. */
export function SearchBox({
  icon,
  loading,
  onSearch,
  ...input
}: TextInputProps & { icon: IconName; loading: boolean; onSearch: () => void }) {
  const C = useColors();
  const styles = useStyles();
  return (
    <LiquidGlass radius={Radius.field} weight="strong" flat bevel={false} style={styles.box}>
      <Icon name={icon} size={18} color={C.muted} />
      <TextInput
        placeholderTextColor={C.muted}
        selectionColor={C.blue}
        returnKeyType="search"
        onSubmitEditing={onSearch}
        autoCorrect={false}
        {...input}
        style={styles.input}
      />
      <Pressable
        onPress={loading ? undefined : onSearch}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Search">
        {loading ? <ActivityIndicator size="small" color={C.white} /> : <Icon name="arrow-forward" size={18} color={C.white} />}
      </Pressable>
    </LiquidGlass>
  );
}

const useStyles = makeStyles((C) => ({
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 58, paddingLeft: 16, paddingRight: 8 },
  input: { flex: 1, fontFamily: Fonts.regular, fontSize: 15.5, color: C.ink, paddingVertical: 14 },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.72 },
}));
