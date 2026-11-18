import type { CSSProperties } from "react";

import { Glyph, TONES, type GlyphName, type Tone } from "../ui/Glyph";

const FEATURES: { title: string; body: string; glyph: GlyphName; tone: Tone }[] = [
  {
    title: "Pay by voice",
    body: "Say a payment in plain English. An intent model and the server work out who gets paid and how much.",
    glyph: "mic",
    tone: "mint",
  },
  {
    title: "Pay anyone",
    body: "Send to a phone number, a UPI ID or straight from your contacts, with the recipient checked first.",
    glyph: "contact",
    tone: "teal",
  },
  {
    title: "Scan & pay",
    body: "Point the camera at any UPI QR code, or pick a QR image from your gallery.",
    glyph: "qr",
    tone: "lime",
  },
  {
    title: "Request money",
    body: "Ask anyone to pay you, then pay, decline or cancel requests with a confirmation step.",
    glyph: "arrow",
    tone: "emerald",
  },
  {
    title: "History that searches",
    body: "Every transfer in local time, filtered by sent, received or failed and searchable by name.",
    glyph: "receipt",
    tone: "mint",
  },
  {
    title: "Locked by biometrics",
    body: "Fingerprint or device PIN to unlock the app, to see your balance and to confirm every payment.",
    glyph: "shield",
    tone: "teal",
  },
];

/**
 * Feature cards whose illustration is split in two: the halves sit ±80px
 * apart and slide together over 600ms on hover (study §5.5). Touch screens
 * get the assembled illustration.
 */
export function FeatureCards() {
  return (
    <section className="px-[var(--pad-x)] py-24" aria-labelledby="fc-title">
      <h2
        id="fc-title"
        data-reveal="fade-move"
        className="font-display mx-auto mb-14 max-w-4xl text-center text-[clamp(2.2rem,5vw,4rem)] leading-[1.08] font-medium tracking-[-0.03em]"
      >
        <span className="text-mint-grad">Everything a UPI app does</span>
        <br />
        plus the part where you just ask
      </h2>
      <div className="fgrid">
        {FEATURES.map((f, i) => (
          <article
            key={f.title}
            tabIndex={0}
            className="fcard"
            data-reveal="fade-move"
            style={{ "--d": `${(i % 3) * 100}ms`, "--glow": `${TONES[f.tone][1]}40` } as CSSProperties}
          >
            <div aria-hidden className="fcard-art">
              <div className="fcard-half fcard-half-top">
                <Glyph name={f.glyph} tone={f.tone} />
              </div>
              <div className="fcard-half fcard-half-bottom">
                <Glyph name={f.glyph} tone={f.tone} />
              </div>
            </div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
