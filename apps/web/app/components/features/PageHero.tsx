import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { APK_URL, SCREENS, type ScreenId } from "../../lib/screens";
import { Glyph, TONES, type GlyphName, type Tone } from "../ui/Glyph";
import { RollLabel } from "../ui/RollLabel";

type Pos = {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  dx: string;
  dy: string;
  delay?: string;
  /** A landscape crop, for the tile that sits above the headline. */
  wide?: boolean;
};

export type DriftTile = Pos & { kind: "shot"; shot: ScreenId };
export type DriftOrb = Pos & { kind: "orb"; glyph: GlyphName; tone: Tone };

/**
 * The inner-page hero (study §7.11): a centred two-line headline over
 * decorative tiles that drift a few dozen pixels over 15 seconds and back.
 */
export function PageHero({
  accent,
  title,
  body,
  drifts,
}: {
  accent: string;
  title: ReactNode;
  body: string;
  drifts: (DriftTile | DriftOrb)[];
}) {
  return (
    <section className="ph">
      {drifts.map((d, i) => {
        const style = {
          left: d.left,
          right: d.right,
          top: d.top,
          bottom: d.bottom,
          "--dx": d.dx,
          "--dy": d.dy,
          animationDelay: d.delay,
        } as CSSProperties;
        if (d.kind === "shot") {
          return (
            <div key={i} aria-hidden className={`drift drift-tile ${d.wide ? "drift-tile-wide" : ""}`} style={style}>
              <Image src={SCREENS[d.shot].src} alt="" fill sizes="210px" />
            </div>
          );
        }
        const [, mid, lo] = TONES[d.tone];
        return (
          <div
            key={i}
            aria-hidden
            className="drift drift-orb"
            style={{ ...style, background: `radial-gradient(circle at 35% 25%, ${mid}55, ${lo}66 55%, #0a0f0c 100%)` }}
          >
            <Glyph name={d.glyph} tone={d.tone} />
          </div>
        );
      })}

      <div className="ph-copy">
        <h1 data-reveal="fade-move">
          <span className="text-mint-grad">{accent}</span>
          <br />
          {title}
        </h1>
        <p data-reveal="fade-move" style={{ "--d": "150ms" } as CSSProperties}>
          {body}
        </p>
        <a
          href={APK_URL}
          className="btn-ghost roll-host"
          rel="noopener noreferrer"
          data-reveal="fade-move"
          style={{ "--d": "300ms" } as CSSProperties}
        >
          <RollLabel text="Download" />
        </a>
      </div>
    </section>
  );
}
