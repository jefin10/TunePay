import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { SCREENS, type ScreenId } from "../../lib/screens";

type DeviceProps = {
  /** Every screen this phone may show; each is mounted once so crossfades never wait on the network. */
  shots: readonly ScreenId[];
  initial?: ScreenId;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  sizes?: string;
  /** Layers that ride on top of the phone (chips). */
  children?: ReactNode;
};

/**
 * A flat phone frame around the real app screenshots. Scrubbed sections
 * crossfade screens by targeting `[data-shot="<id>"]`.
 */
export function Device({
  shots,
  initial = shots[0],
  className = "",
  style,
  priority = false,
  sizes = "(max-width: 768px) 60vw, 340px",
  children,
}: DeviceProps) {
  return (
    <div className={`device ${className}`} style={style} role="img" aria-label={SCREENS[initial].alt}>
      <span aria-hidden className="device-btn device-btn-a" />
      <span aria-hidden className="device-btn device-btn-b" />
      <span aria-hidden className="device-btn device-btn-c" />
      <span aria-hidden className="device-btn device-btn-d" />
      <div className="device-screen">
        {shots.map((id) => (
          <div
            key={id}
            data-shot={id}
            className="device-shot"
            style={id === initial ? undefined : { opacity: 0, visibility: "hidden" }}
          >
            <Image src={SCREENS[id].src} alt="" fill sizes={sizes} priority={priority && id === initial} />
          </div>
        ))}
        <span aria-hidden className="device-island" />
      </div>
      {children}
    </div>
  );
}
