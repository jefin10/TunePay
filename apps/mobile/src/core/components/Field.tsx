import { useState, type ReactNode, type Ref } from 'react';
import { Text, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { Fonts, makeStyles, useColors } from '@/core/theme';

type FieldProps = TextInputProps & {
  /** Omit for a placeholder-only field. */
  label?: string;
  left?: ReactNode;
  right?: ReactNode;
  error?: string | null;
  ref?: Ref<TextInputInstance>;
};

/** Folio's input: a tile that lifts a step and takes a mint ring on focus. */
export function Field({ label, left, right, error, style, onFocus, onBlur, ref, ...rest }: FieldProps) {
  const C = useColors();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.row, focused && styles.rowFocused, !!error && styles.rowError]}>
        {left}
        <TextInput
          ref={ref}
          placeholderTextColor={C.muted}
          selectionColor={C.blue}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
          style={[styles.input, style]}
        />
        {right}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  wrap: { gap: 7 },
  label: { fontFamily: Fonts.extrabold, fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase', color: C.muted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    backgroundColor: C.soft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    paddingHorizontal: 14,
  },
  rowFocused: {
    backgroundColor: C.tile,
    borderColor: 'rgba(61,220,151,0.6)',
  },
  rowError: {
    borderColor: 'rgba(255,107,87,0.5)',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: C.ink,
    fontFamily: Fonts.semibold,
  },
  error: { fontSize: 12, color: C.danger, fontFamily: Fonts.semibold },
}));
