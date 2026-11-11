import Storage from 'expo-sqlite/kv-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance, StyleSheet } from 'react-native';

import { THEME_KEY as KEY } from '@/core/storage/session';

import { Palettes, type Palette, type Scheme } from './colors';

export type ThemePreference = 'system' | 'light' | 'dark';

/** What StyleSheet.create accepts. */
type Styles = Parameters<typeof StyleSheet.create>[0];

/** The phone's setting, or null when it does not state one ('unspecified'). */
function readSystemScheme(): Scheme | null {
  const value = Appearance.getColorScheme();
  return value === 'dark' ? 'dark' : value === 'light' ? 'light' : null;
}

function readPreference(): ThemePreference {
  const value = Storage.getItemSync(KEY);
  return value === 'light' || value === 'dark' ? value : 'system';
}

interface ThemeState {
  scheme: Scheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeState>({ scheme: 'light', preference: 'system', setPreference: () => {} });

/** Light or dark for the whole app: the phone's setting unless the person
 * picked one in Appearance. The choice stays on this device. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [system, setSystem] = useState<Scheme | null>(readSystemScheme);
  const [preference, setStored] = useState<ThemePreference>(readPreference);

  // Follow the phone's setting while the app is open.
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setSystem(readSystemScheme()));
    return () => sub.remove();
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setStored(next);
    Storage.setItemSync(KEY, next);
  }, []);

  const scheme: Scheme = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
  const value = useMemo(() => ({ scheme, preference, setPreference }), [scheme, preference, setPreference]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useScheme() {
  return useContext(ThemeContext).scheme;
}

/** The active palette — the same token names as `Colors`. */
export function useColors(): Palette {
  return Palettes[useScheme()];
}

/** A stylesheet per scheme, built once each and swapped when the theme does:
 * `const useStyles = makeStyles((C) => ({ … C.ink … }))`, then
 * `const styles = useStyles()` inside the component. */
export function makeStyles<T extends Styles>(
  // `& Styles` as in StyleSheet.create: it types the literals in the
  // factory's result, so 'row' stays 'row' rather than widening to string.
  factory: (C: Palette, scheme: Scheme) => T & Styles,
) {
  const cache: Partial<Record<Scheme, Readonly<T>>> = {};
  return function useStyles(): Readonly<T> {
    const scheme = useScheme();
    return (cache[scheme] ??= StyleSheet.create(factory(Palettes[scheme], scheme)));
  };
}
