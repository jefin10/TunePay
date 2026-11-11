import { Stack } from 'expo-router';

export const unstable_settings = { anchor: 'phone' };

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: 'transparent' } }}
    />
  );
}
