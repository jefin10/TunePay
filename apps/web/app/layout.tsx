import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "TunePay",
  description:
    "TunePay is a voice-powered UPI payments platform for fast, secure, and accessible money transfers.",
  applicationName: "TunePay",
  icons: {
    icon: [{ url: "/symbol-logo.png", type: "image/png" }],
    shortcut: [{ url: "/symbol-logo.png", type: "image/png" }],
    apple: [{ url: "/symbol-logo.png", type: "image/png" }],
  },
  openGraph: {
    title: "TunePay",
    description:
      "Voice-powered UPI payments for fast, secure, and accessible money transfers.",
    siteName: "TunePay",
    type: "website",
    images: [
      {
        url: "/symbol-logo.png",
        width: 512,
        height: 512,
        alt: "TunePay symbol logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "TunePay",
    description:
      "Voice-powered UPI payments for fast, secure, and accessible money transfers.",
    images: ["/symbol-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${display.variable} ${mono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
