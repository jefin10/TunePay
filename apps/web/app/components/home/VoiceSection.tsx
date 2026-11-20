"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";

const PHRASES = [
  "As simple as talking",
  "Say who. Say how much.",
  "Your voice is the keypad",
  "Paid before you finish the sentence",
];

/** The TunePay mark as a giant silhouette rising from the bottom edge: height (vh), breathing period, delay. */
const BARS: [number, number, number][] = [
  [34, 3.2, -0.4],
  [58, 2.6, -1.1],
  [88, 3.6, -0.2],
  [58, 2.9, -1.7],
  [34, 3.4, -0.9],
];

/**
 * The long gradient section (study §7.4, §7.6): the ground runs from the
 * canvas into mint, the logo's sound wave stands in silhouette, and four
 * phrases swap in place as you scroll, each rising 20px as it appears.
 * Two glow blobs breathe in between 20% and 50% of the passage.
 */
export function VoiceSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const m = prefersReducedMotion() ? 0 : 1;
      const q = gsap.utils.selector(root);
      const phrases = q(".voice-phrase");
      const blobs = q(".voice-blob");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });

      tl.fromTo(phrases[0], { autoAlpha: 0, y: 20 * m }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0);
      [0.25, 0.5, 0.75].forEach((p, i) => {
        tl.to(phrases[i], { autoAlpha: 0, duration: 0.04 }, p - 0.02).fromTo(
          phrases[i + 1],
          { autoAlpha: 0, y: 20 * m },
          { autoAlpha: 1, y: 0, duration: 0.05 },
          p,
        );
      });
      tl.fromTo(blobs, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.2)
        .to(blobs, { autoAlpha: 0, duration: 0.18 }, 0.32)
        .to({}, { duration: 0 }, 1);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="voice" aria-label="As simple as talking">
      <div className="voice-sticky">
        <div aria-hidden className="green-ground" />
        <div aria-hidden className="voice-blob voice-blob-1" />
        <div aria-hidden className="voice-blob voice-blob-2" />
        <div aria-hidden className="voice-bars">
          {BARS.map(([h, t, delay], i) => (
            <i key={i} style={{ height: `${h}vh`, "--t": `${t}s`, "--delay": `${delay}s` } as CSSProperties} />
          ))}
        </div>
        <div className="voice-phrases">
          {PHRASES.map((p) => (
            <p key={p} className="voice-phrase">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
