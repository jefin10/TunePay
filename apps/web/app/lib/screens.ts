/**
 * Real screenshots of the TunePay app (1080×2400), shown inside the 3D
 * phone. Files live in public/screens/.
 */
export const SCREENS = {
  home: { src: "/screens/home.webp", alt: "TunePay home screen with balance and quick pay" },
  voice: { src: "/screens/voice.webp", alt: "TunePay voice tab with a large tap-to-speak button" },
  listening: { src: "/screens/listening.webp", alt: "Voice pay screen ready for a command" },
  contacts: { src: "/screens/contacts.webp", alt: "Paying a contact from the phone's address book" },
  pay: { src: "/screens/pay.webp", alt: "Voice payment confirmation with an editable amount" },
  success: { src: "/screens/success.webp", alt: "Payment sent confirmation" },
  scan: { src: "/screens/scan.webp", alt: "Scan and pay with the camera" },
  requests: { src: "/screens/requests.webp", alt: "Money requests with pay and decline actions" },
  history: { src: "/screens/history.webp", alt: "Transaction history with filters" },
  security: { src: "/screens/security.webp", alt: "Security settings with biometric lock" },
} as const;

export type ScreenId = keyof typeof SCREENS;

export const SCREEN_IDS = Object.keys(SCREENS) as ScreenId[];

export const APK_URL =
  "https://github.com/jefin10/TunePay/releases/latest/download/app-release.apk";

export const REPO_URL = "https://github.com/jefin10/TunePay";
