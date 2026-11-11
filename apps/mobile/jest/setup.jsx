// Reanimated ships its own Jest helpers; this makes animations resolve
// synchronously and exposes the full API (Easing, layout animations, …).
require('react-native-reanimated').setUpTests();

// The mock's keyboard hands back plain `{ value }` objects; the app reads
// shared values through .get(), as on device.
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated');
  const shared = (v) => ({ value: v, get: () => v, set: () => {} });
  return {
    __esModule: true,
    ...actual,
    default: actual.default,
    useAnimatedKeyboard: () => ({ height: shared(0), state: shared(0) }),
  };
});

// Icon fonts load through the asset registry, which Jest doesn't have.
jest.mock('@expo/vector-icons/Ionicons', () => {
  const { Text } = require('react-native');
  const Icon = ({ name }) => <Text>{name}</Text>;
  Icon.font = {};
  Icon.glyphMap = {};
  return { __esModule: true, default: Icon };
});

// The native blur and its target are views as far as the tests care.
jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return { __esModule: true, BlurView: View, BlurTargetView: View };
});
