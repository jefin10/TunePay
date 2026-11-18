import type { CSSProperties } from "react";

import { APK_URL } from "../../lib/screens";
import { Device } from "../ui/Device";
import { Glyph } from "../ui/Glyph";
import { RollLabel } from "../ui/RollLabel";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Three columns that rise in a 0 / 300 / 600ms cascade (study §7.5). */
export function SimpleGrid() {
  return (
    <section className="sg" aria-labelledby="sg-title">
      <h2 id="sg-title" className="sg-title" data-reveal="fade-move">
        <span className="text-mint-grad">Send money in seconds</span>
        <br />
        As simple as talking
      </h2>

      <div className="sg-grid">
        <div className="sg-copy" data-reveal="grid" style={delay(0)}>
          <p className="tags">Voice • Contacts • QR</p>
          <h3>Your voice, your wallet</h3>
          <p>
            Pay a contact, a phone number or a UPI ID, scan any UPI QR, or ask someone to pay you. When your hands are
            busy, just say it.
          </p>
          <a href={APK_URL} className="btn-ghost roll-host" rel="noopener noreferrer">
            <RollLabel text="Get started" />
          </a>
        </div>

        <div className="sg-phonecard" data-reveal="grid" style={delay(300)}>
          <Device className="sg-phone" shots={["contacts"]} sizes="300px" />
        </div>

        <div className="sg-card" data-reveal="grid" style={delay(600)}>
          <p>
            Your money,
            <br />
            your voice,
            <br />
            your rules.
          </p>
          <div aria-hidden className="sg-glyphs">
            <Glyph name="mic" tone="mint" />
            <Glyph name="qr" tone="teal" />
            <Glyph name="coin" tone="lime" />
          </div>
        </div>
      </div>
    </section>
  );
}
