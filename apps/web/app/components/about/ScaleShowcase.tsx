"use client";

import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import { Device } from "../ui/Device";

/** A wide panel of phones that grows from 0.9 to 1 between 10% and 50% of its passage (study §7.9). */
export function ScaleShowcase() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        })
        .fromTo(root.current, { scale: 0.9 }, { scale: 1, duration: 0.4 }, 0.1)
        .to({}, { duration: 0 }, 1);
    },
    { scope: root },
  );

  return (
    <div className="px-[var(--pad-x)] py-10">
      <div ref={root} className="showcase">
        <Device shots={["scan"]} sizes="270px" />
        <Device shots={["requests"]} sizes="270px" />
        <Device shots={["security"]} sizes="270px" />
      </div>
    </div>
  );
}
