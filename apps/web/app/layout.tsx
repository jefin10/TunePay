import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0B0F19",
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
      className={`${inter.variable} ${mono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
