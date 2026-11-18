import { useId, type ReactNode } from "react";

/**
 * TunePay's illustration set: glossy, softly glowing 3D-ish glyphs in the
 * mint family, drawn on a 100-unit grid. Each glyph is a flat silhouette
 * filled with a three-stop gradient, a blurred copy behind it for glow,
 * and a top-left specular highlight clipped to the silhouette.
 */

export type Tone = "mint" | "teal" | "lime" | "emerald";
export type GlyphName =
  | "mic"
  | "wave"
  | "shield"
  | "qr"
  | "bubble"
  | "coin"
  | "bolt"
  | "contact"
  | "receipt"
  | "arrow";

/** highlight, body, shadow */
export const TONES: Record<Tone, [string, string, string]> = {
  mint: ["#c8fbe4", "#3ddc97", "#0b6340"],
  teal: ["#b8f5ee", "#2dd4bf", "#0a5459"],
  lime: ["#effcd2", "#a8e63a", "#3c5e10"],
  emerald: ["#a7f3c4", "#22b569", "#0a3d22"],
};

const SHAPES: Record<GlyphName, ReactNode> = {
  mic: (
    <>
      <rect x="35" y="6" width="30" height="52" rx="15" />
      <path d="M21 42a29 29 0 0 0 58 0h-9a20 20 0 0 1-40 0z" />
      <rect x="45.5" y="69" width="9" height="15" />
      <rect x="30" y="81" width="40" height="10" rx="5" />
    </>
  ),
  wave: (
    <>
      <rect x="6" y="36" width="12" height="28" rx="6" />
      <rect x="25" y="25" width="12" height="50" rx="6" />
      <rect x="44" y="10" width="12" height="80" rx="6" />
      <rect x="63" y="25" width="12" height="50" rx="6" />
      <rect x="82" y="36" width="12" height="28" rx="6" />
    </>
  ),
  shield: <path d="M50 5 86 18v27c0 24-15 41-36 50C29 86 14 69 14 45V18z" />,
  qr: (
    <>
      <rect x="8" y="8" width="36" height="36" rx="9" />
      <rect x="56" y="8" width="36" height="36" rx="9" />
      <rect x="8" y="56" width="36" height="36" rx="9" />
      <rect x="56" y="56" width="15" height="15" rx="4" />
      <rect x="77" y="56" width="15" height="15" rx="4" />
      <rect x="56" y="77" width="15" height="15" rx="4" />
      <rect x="77" y="77" width="15" height="15" rx="4" />
    </>
  ),
  bubble: <path d="M22 12h56a14 14 0 0 1 14 14v36a14 14 0 0 1-14 14H50L28 93V76h-6A14 14 0 0 1 8 62V26a14 14 0 0 1 14-14z" />,
  coin: <circle cx="50" cy="50" r="41" />,
  bolt: <path d="M60 3 16 58h29l-7 39 46-57H55z" />,
  contact: <rect x="10" y="14" width="80" height="72" rx="16" />,
  receipt: <path d="M18 6h64v88l-10.7-7-10.6 7-10.7-7-10.7 7-10.6-7L18 94z" />,
  arrow: <path d="M24 88 12 76l44-44H28V16h56v56H68V44z" />,
};

/** Details drawn on top of the silhouette, in the tone's shadow colour. */
const OVERLAYS: Partial<Record<GlyphName, (ink: string) => ReactNode>> = {
  shield: (ink) => (
    <path d="M33 50l12 12 23-25" stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
  ),
  qr: (ink) => (
    <g fill={ink} opacity="0.6">
      <rect x="19" y="19" width="14" height="14" rx="3" />
      <rect x="67" y="19" width="14" height="14" rx="3" />
      <rect x="19" y="67" width="14" height="14" rx="3" />
    </g>
  ),
  bubble: (ink) => (
    <g fill={ink} opacity="0.6">
      <circle cx="32" cy="44" r="6" />
      <circle cx="50" cy="44" r="6" />
      <circle cx="68" cy="44" r="6" />
    </g>
  ),
  coin: (ink) => (
    <>
      <circle cx="50" cy="50" r="31" fill="none" stroke={ink} strokeWidth="3" opacity="0.35" />
      <path
        d="M36 30h28M36 41h28M36 30h8a11 11 0 0 1 0 22h-8l22 20"
        stroke={ink}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </>
  ),
  contact: (ink) => (
    <g fill={ink} opacity="0.6">
      <circle cx="50" cy="40" r="12" />
      <path d="M26 74a24 18 0 0 1 48 0z" />
    </g>
  ),
  receipt: (ink) => (
    <g stroke={ink} strokeWidth="6" strokeLinecap="round" opacity="0.6">
      <path d="M32 28h36M32 44h36M32 60h20" />
    </g>
  ),
};

export function Glyph({
  name,
  tone = "mint",
  className,
  title,
}: {
  name: GlyphName;
  tone?: Tone;
  className?: string;
  title?: string;
}) {
  const id = `g${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [hi, body, lo] = TONES[tone];
  const shape = SHAPES[name];
  const overlay = OVERLAYS[name];

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`${id}f`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.45" stopColor={body} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
        <radialGradient id={`${id}h`} cx="0.3" cy="0.2" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <clipPath id={`${id}c`}>{shape}</clipPath>
      </defs>
      <g fill={body} opacity="0.55" filter={`url(#${id}b)`}>
        {shape}
      </g>
      <g fill={`url(#${id}f)`}>{shape}</g>
      <rect width="100" height="100" fill={`url(#${id}h)`} clipPath={`url(#${id}c)`} />
      {overlay?.(lo)}
    </svg>
  );
}
