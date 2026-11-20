"use client";

import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import { Glyph, type GlyphName, type Tone } from "../ui/Glyph";

type Card = { text: string; bg: string; rotate: number; glyphs: [GlyphName, Tone][] };

/** Top of the pile first. */
const CARDS: Card[] = [
  {
    text: "Pay, request and check your balance, out loud.",
    bg: "linear-gradient(160deg, #141b17, #0a0f0c)",
    rotate: 15,
    glyphs: [
      ["bubble", "mint"],
      ["bolt", "lime"],
      ["wave", "teal"],
    ],
  },
  {
    text: "Contacts, UPI IDs, phone numbers and QR codes.",
    bg: "linear-gradient(160deg, #127a4f, #0a4a30)",
    rotate: -18,
    glyphs: [
      ["contact", "lime"],
      ["qr", "mint"],
      ["arrow", "teal"],
    ],
  },
  {
    text: "A fingerprint before every rupee moves.",
    bg: "linear-gradient(160deg, #0f5f5a, #08393a)",
    rotate: 10,
    glyphs: [
      ["shield", "mint"],
      ["coin", "lime"],
      ["receipt", "teal"],
    ],
  },
];

/**
 * "Everything a payment needs": three tossed cards sit on the headline and
 * lift off the pile one after another as you scroll (study §7.8).
 */
export function CardPile() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const m = prefersReducedMotion() ? 0 : 1;
      const q = gsap.utils.selector(root);
      // Rendered bottom-first so the top card paints last; lift top-first.
      const cards = q(".pile-card").reverse();

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true },
      });
      tl.fromTo(q(".pile-ground"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.2);
      cards.forEach((card, i) => {
        const at = 0.1 + i * 0.22;
        tl.to(card, m ? { yPercent: -190, rotation: CARDS[i].rotate * 0.4, duration: 0.22 } : { autoAlpha: 0, duration: 0.1 }, at);
      });
      tl.to({}, { duration: 0 }, 1);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="pile" aria-labelledby="pile-title">
      <div className="pile-sticky">
        <div aria-hidden className="pile-ground" />
        <h2 id="pile-title" className="pile-title">
          Everything a
          <br />
          payment needs
        </h2>
        {[...CARDS].reverse().map((c) => (
          <div key={c.text} className="pile-card" style={{ background: c.bg, transform: `rotate(${c.rotate}deg)` }}>
            <p>{c.text}</p>
            <div aria-hidden className="glyph-row">
              {c.glyphs.map(([g, t]) => (
                <Glyph key={g} name={g} tone={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
