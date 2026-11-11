import { Tabs } from 'expo-router/js-tabs';

import { TabBar, TabScene } from '@/features/home/components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, animation: 'fade', sceneStyle: { backgroundColor: 'transparent' } }}
      screenLayout={({ route, children }) => <TabScene name={route.name}>{children}</TabScene>}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="voice" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
