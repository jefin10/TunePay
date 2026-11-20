/**
 * Real screenshots of the current TunePay app, captured on a phone with the
 * demo account (Arjun Nair) and resized to 640×1422. Files live in
 * public/app-screens/.
 */
export const SCREENS = {
  home: { src: "/app-screens/home.webp", alt: "TunePay home screen with balance, quick pay and voice pay" },
  voice: { src: "/app-screens/voice.webp", alt: "TunePay voice tab with a large tap-to-speak button" },
  listening: { src: "/app-screens/listening.webp", alt: "Voice pay screen with example commands, ready to listen" },
  upi: { src: "/app-screens/upi.webp", alt: "Paying a UPI ID with the recipient verified before you pay" },
  pay: { src: "/app-screens/pay.webp", alt: "Voice payment confirmation with an editable amount" },
  success: { src: "/app-screens/success.webp", alt: "Payment sent confirmation" },
  scan: { src: "/app-screens/scan.webp", alt: "Scan and pay with the camera" },
  requests: { src: "/app-screens/requests.webp", alt: "Money requests with pay and decline actions" },
  history: { src: "/app-screens/history.webp", alt: "Transaction history with filters" },
  security: { src: "/app-screens/security.webp", alt: "Security settings with biometric lock" },
} as const;

export type ScreenId = keyof typeof SCREENS;

export const SCREEN_IDS = Object.keys(SCREENS) as ScreenId[];

export const APK_URL =
  "https://github.com/jefin10/TunePay/releases/latest/download/app-release.apk";

export const REPO_URL = "https://github.com/jefin10/TunePay";

export const ISSUES_URL = `${REPO_URL}/issues`;
