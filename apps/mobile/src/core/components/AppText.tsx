import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { Fonts, makeStyles } from '@/core/theme';

/** The type ramp in the current scheme: `const t = useText()`, then `t.t1`… */
export const useText = makeStyles((C) => ({
  /** Page titles. Light and large; the weight is in the size, not the stroke. */
  t1: { fontFamily: Fonts.light, fontSize: 34, lineHeight: 40, color: C.ink, letterSpacing: -1 },
  t2: { fontFamily: Fonts.light, fontSize: 26, lineHeight: 31, color: C.ink, letterSpacing: -0.5 },
  t3: { fontFamily: Fonts.medium, fontSize: 21, lineHeight: 27, color: C.ink, letterSpacing: -0.3 },
  t4: { fontFamily: Fonts.medium, fontSize: 17, lineHeight: 23, color: C.ink, letterSpacing: -0.2 },
  body: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 22, color: C.ink },
  soft: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 22, color: C.inkSoft },
  sm: { fontFamily: Fonts.regular, fontSize: 13.5, lineHeight: 19, color: C.ink },
  cap: { fontFamily: Fonts.regular, fontSize: 12.5, lineHeight: 17, color: C.muted },
  kick: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: C.muted,
  },
  lab: { fontFamily: Fonts.semibold, fontSize: 13, lineHeight: 18, color: C.ink },
  /** Money. Light, tight and tabular, so a balance reads as one figure. */
  num: { fontFamily: Fonts.light, fontSize: 25, lineHeight: 29, color: C.ink, letterSpacing: -0.8, fontVariant: ['tabular-nums'] },
  r1: { fontFamily: Fonts.semibold, fontSize: 15, color: C.ink },
  r2: { fontFamily: Fonts.regular, fontSize: 12.5, lineHeight: 17, color: C.muted, marginTop: 2 },
  link: { fontFamily: Fonts.semibold, fontSize: 13.5, color: C.blue600 },
}));

type TP = TextProps & { style?: StyleProp<TextStyle> };

/** `Text` with the body face and ink colour as defaults. */
export const AppText = ({ style, ...p }: TP) => <Text style={[useText().body, style]} {...p} />;

export const T1 = ({ style, ...p }: TP) => <Text style={[useText().t1, style]} {...p} />;
export const T2 = ({ style, ...p }: TP) => <Text style={[useText().t2, style]} {...p} />;
export const T3 = ({ style, ...p }: TP) => <Text style={[useText().t3, style]} {...p} />;
export const T4 = ({ style, ...p }: TP) => <Text style={[useText().t4, style]} {...p} />;
export const Soft = ({ style, ...p }: TP) => <Text style={[useText().soft, style]} {...p} />;
export const Sm = ({ style, ...p }: TP) => <Text style={[useText().sm, style]} {...p} />;
export const Cap = ({ style, ...p }: TP) => <Text style={[useText().cap, style]} {...p} />;
export const Kick = ({ style, ...p }: TP) => <Text style={[useText().kick, style]} {...p} />;
export const Lab = ({ style, ...p }: TP) => <Text style={[useText().lab, style]} {...p} />;
export const Num = ({ style, ...p }: TP) => <Text style={[useText().num, style]} {...p} />;
