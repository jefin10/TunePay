import type { Metadata } from "next";

import { BuiltWith } from "../components/about/BuiltWith";
import { ScaleShowcase } from "../components/about/ScaleShowcase";
import { SwapTiles } from "../components/about/SwapTiles";
import { PageHero } from "../components/features/PageHero";
import { CtaPanel } from "../components/home/CtaPanel";

export const metadata: Metadata = {
  title: "About",
  description: "Why TunePay is built around your voice, and how the app, the payments API and the voice model fit together.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        accent="Our approach"
        title="Payments you can say out loud"
        body="Paying someone shouldn’t mean hunting for an ID, squinting at a QR or typing an amount on a tiny keypad. TunePay lets you say it, then shows you exactly what will happen before it does."
        drifts={[
          { kind: "orb", glyph: "mic", tone: "mint", left: "9%", top: "17%", dx: "30px", dy: "-24px" },
          { kind: "orb", glyph: "coin", tone: "lime", right: "9%", top: "15%", dx: "-26px", dy: "30px", delay: "-5s" },
          { kind: "orb", glyph: "shield", tone: "teal", left: "16%", bottom: "12%", dx: "22px", dy: "-34px", delay: "-9s" },
          { kind: "orb", glyph: "qr", tone: "emerald", right: "18%", bottom: "8%", dx: "-30px", dy: "-20px", delay: "-3s" },
        ]}
      />
      <ScaleShowcase />
      <SwapTiles />
      <BuiltWith />
      <CtaPanel />
    </main>
  );
}
