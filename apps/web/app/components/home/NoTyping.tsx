"use client";

import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import { PaidChip, SaidChip } from "../ui/Chips";
import { Device } from "../ui/Device";

const WORDS = ["Typing", "Scanning", "Searching", "Waiting"];

/**
 * "No ___" (study §7.7): a huge headline whose second word swaps mid-scroll
 * over the mint ground, with the phone easing down from a slight zoom.
 */
export function NoTyping() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const m = prefersReducedMotion() ? 0 : 1;
      const q = gsap.utils.selector(root);
      const words = q(".nt-word");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      tl.fromTo(q(".nt-phone"), { scale: m ? 1.15 : 1, y: 80 * m }, { scale: 1, y: 0, duration: 0.45 }, 0.05);
      [0.33, 0.45, 0.57].forEach((p, i) => {
        tl.to(words[i], { autoAlpha: 0, y: -30 * m, duration: 0.04 }, p).fromTo(
          words[i + 1],
          { autoAlpha: 0, y: 30 * m },
          { autoAlpha: 1, y: 0, duration: 0.05 },
          p + 0.03,
        );
      });
      tl.to({}, { duration: 0 }, 1);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="nt" aria-label="No typing, no scanning, no searching, no waiting">
      <div className="nt-sticky">
        <div aria-hidden className="green-ground" />
        <div aria-hidden className="nt-words">
          <span className="nt-no">No</span>
          <span className="nt-swap">
            {WORDS.map((w) => (
              <span key={w} className="nt-word">
                {w}
              </span>
            ))}
          </span>
        </div>
        <div className="nt-stage">
          <Device className="nt-phone" shots={["voice"]}>
            <SaidChip className="nt-chip-a" />
            <PaidChip className="nt-chip-b" />
          </Device>
        </div>
      </div>
    </section>
  );
}
