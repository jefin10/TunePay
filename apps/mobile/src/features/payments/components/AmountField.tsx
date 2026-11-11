import { Text, type TextInputProps } from 'react-native';

import { Field } from '@/core/components';
import { Fonts, makeStyles } from '@/core/theme';

import { sanitizeAmountInput } from '../amount';

/** Rupee amount input: decimal keyboard, ₹ prefix, input sanitised to 2dp. */
export function AmountField({
  value,
  onChangeText,
  label = 'Amount',
  error,
  ...rest
}: Omit<TextInputProps, 'onChangeText'> & {
  value: string;
  onChangeText: (v: string) => void;
  label?: string;
  error?: string | null;
}) {
  const styles = useStyles();
  return (
    <Field
      label={label}
      value={value}
      onChangeText={(t) => onChangeText(sanitizeAmountInput(t))}
      placeholder="0"
      keyboardType="decimal-pad"
      error={error}
      left={<Text style={styles.rupee}>₹</Text>}
      style={styles.input}
      accessibilityLabel={label}
      {...rest}
    />
  );
}

const useStyles = makeStyles((C) => ({
  rupee: { fontFamily: Fonts.light, fontSize: 26, color: C.inkSoft },
  input: { fontFamily: Fonts.light, fontSize: 26, letterSpacing: -0.6, minHeight: 60 },
}));
