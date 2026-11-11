import { useState, type ReactNode, type Ref } from 'react';
import { Text, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { Fonts, makeStyles, Radius, Spacing, useColors } from '@/core/theme';

type FieldProps = TextInputProps & {
  /** Omit for a placeholder-only field. */
  label?: string;
  left?: ReactNode;
  right?: ReactNode;
  error?: string | null;
  ref?: Ref<TextInputInstance>;
};

/** A soft-fill row that turns white with a blue inset ring on focus. */
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
  label: { fontSize: 12.5, color: C.inkSoft, fontFamily: Fonts.medium },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.soft,
    borderRadius: Radius.field,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.three,
  },
  rowFocused: {
    backgroundColor: C.white,
    boxShadow: `inset 0 0 0 1.8px ${C.blue}`,
  },
  rowError: {
    backgroundColor: C.soft,
    boxShadow: `inset 0 0 0 1.5px ${C.danger}`,
  },
  input: {
    flex: 1,
    minHeight: 52,
    fontSize: 15,
    color: C.ink,
    fontFamily: Fonts.regular,
  },
  error: { fontSize: 12, color: C.danger, fontFamily: Fonts.medium },
}));
