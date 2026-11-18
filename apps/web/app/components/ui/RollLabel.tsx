import type { CSSProperties } from "react";

/**
 * The split-text rollover (study §5.4): two stacked copies of the label,
 * one character per span; hovering the closest `.roll-host` rolls the
 * first copy up and the second in, 18ms apart per character.
 */
export function RollLabel({ text }: { text: string }) {
  const chars = Array.from(text);
  const row = (second: boolean) => (
    <span aria-hidden className={`roll-row ${second ? "roll-row-2" : ""}`}>
      {chars.map((c, i) => (
        <span key={i} style={{ "--i": i } as CSSProperties}>
          {c}
        </span>
      ))}
    </span>
  );
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      {row(false)}
      {row(true)}
    </span>
  );
}
