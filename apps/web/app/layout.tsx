import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";

import { DownloadBar } from "./components/site/DownloadBar";
import { Footer } from "./components/site/Footer";
import { Nav } from "./components/site/Nav";
import { SiteEffects } from "./components/site/SiteEffects";
import "./globals.css";

const inter = Inter({ variable: "--font-inter-src", subsets: ["latin"] });
const tight = Inter_Tight({ variable: "--font-tight-src", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jb-src", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#020504",
  colorScheme: "dark",
};

const description =
  "TunePay is a voice-first UPI payments app: say who and how much, check it, and confirm with your fingerprint.";

export const metadata: Metadata = {
  title: { default: "TunePay — say it, it's paid", template: "%s · TunePay" },
  description,
  applicationName: "TunePay",
  icons: {
    icon: [{ url: "/symbol-logo.png", type: "image/png" }],
    shortcut: [{ url: "/symbol-logo.png", type: "image/png" }],
    apple: [{ url: "/symbol-logo.png", type: "image/png" }],
  },
  openGraph: {
    title: "TunePay",
    description,
    siteName: "TunePay",
    type: "website",
    images: [{ url: "/symbol-logo.png", width: 512, height: 512, alt: "TunePay symbol logo" }],
  },
  twitter: {
    card: "summary",
    title: "TunePay",
    description,
    images: ["/symbol-logo.png"],
  },
};

/** Tags the root before first paint so reveal states only hide content when JS will show it. */
const JS_FLAG = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${tight.variable} ${mono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="min-h-full">
        <Nav />
        {children}
        <Footer />
        <DownloadBar />
        <SiteEffects />
      </body>
    </html>
  );
}
