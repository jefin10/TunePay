import { Stack } from 'expo-router';

export const unstable_settings = { anchor: '(tabs)' };

/** Signed-in area: the tab shell plus every screen pushed on top of it. */
export default function AppLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: 'transparent' } }}
    />
  );
}
