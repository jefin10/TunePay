import Ionicons from '@expo/vector-icons/Ionicons';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FieldBackdrop, Toaster } from '@/core/components';
import { queryClient } from '@/core/query-client';
import { selectNeedsUnlock, useSession } from '@/core/storage/session';
import { fontAssets, Palettes, ThemeProvider, useScheme } from '@/core/theme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = { anchor: 'index' };

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ ...fontAssets, ...Ionicons.font });
  // A font that cannot load must not hold the app on the splash for ever —
  // carry on with the system face instead.
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp() {
  const scheme = useScheme();
  const C = Palettes[scheme];
  const isLoggedIn = useSession((s) => s.isLoggedIn);
  const needsUnlock = useSession(selectNeedsUnlock);

  // Screens are see-through so the one shaded ground shows behind them all.
  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: { ...base.colors, primary: C.blue, background: 'transparent', card: C.white, text: C.ink, border: C.line },
    };
  }, [scheme, C]);

  // The window colour behind the gesture bar: the plain ground, so the bar
  // reads as part of every screen.
  useEffect(() => {
    if (process.env.EXPO_OS === 'android') SystemUI.setBackgroundColorAsync(C.ground);
  }, [C.ground]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <View style={[styles.root, { backgroundColor: C.ground }]}>
          {/* One ground behind every screen: plain everywhere but the unlock
              and sign-in, which fade into the shaded sheets of light. */}
          <FieldBackdrop />
          {/* Guards pick the screen: wallet once unlocked, the biometric gate
              while locked, onboarding when logged out. Flipping session state
              is all a screen needs to do to move between them. */}
          <Stack
            screenOptions={{
              headerShown: false,
              // A cross-fade: a slide would show the screen beneath through
              // the one arriving, both being see-through.
              animation: 'fade',
              contentStyle: { backgroundColor: 'transparent' },
            }}>
            <Stack.Screen name="index" />
            <Stack.Protected guard={isLoggedIn && !needsUnlock}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>
            <Stack.Protected guard={needsUnlock}>
              <Stack.Screen name="biometric" />
            </Stack.Protected>
            <Stack.Protected guard={!isLoggedIn}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
          </Stack>
        </View>
        <Toaster />
      </QueryClientProvider>
    </NavigationThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
