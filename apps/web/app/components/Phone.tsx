import Image from "next/image";
import type { CSSProperties, ReactNode, Ref } from "react";

import { SCREEN_IDS, SCREENS, type ScreenId } from "../lib/screens";

type PhoneProps = {
  screen: ScreenId;
  rotateX?: number;
  rotateY?: number;
  /** Lets a parent drive the transform directly (pointer parallax). */
  bodyRef?: Ref<HTMLDivElement>;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Extra layers that live in the phone's 3D space (floating cards). */
  children?: ReactNode;
};

/** Slabs stacked behind the face give the body visible thickness when it turns. */
const EDGE_LAYERS = 12;

/**
 * A CSS 3D smartphone. Every screenshot is mounted once and cross-faded, so
 * switching screens never waits on a network request.
 */
export function Phone({
  screen,
  rotateX = 0,
  rotateY = 0,
  bodyRef,
  priority = false,
  className = "",
  style,
  children,
}: PhoneProps) {
  return (
    <div className={`phone-stage ${className}`} style={style}>
      <div aria-hidden className="phone-halo" />
      <div
        ref={bodyRef}
        className="phone"
        style={
          {
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            "--glare": `${50 + rotateY * 1.6}%`,
          } as CSSProperties
        }
      >
        {Array.from({ length: EDGE_LAYERS }, (_, i) => (
          <div
            key={i}
            aria-hidden
            className="phone-edge"
            style={{ transform: `translateZ(${-(i + 1) * 1.1}px)` }}
          />
        ))}
        <div aria-hidden className="phone-back" />

        <div className="phone-face">
          <span aria-hidden className="phone-btn phone-btn-power" />
          <span aria-hidden className="phone-btn phone-btn-vol" />
          <div className="phone-screen">
            {SCREEN_IDS.map((id) => (
              <Image
                key={id}
                src={SCREENS[id].src}
                alt={id === screen ? SCREENS[id].alt : ""}
                aria-hidden={id !== screen}
                fill
                sizes="(max-width: 768px) 240px, 320px"
                priority={priority && id === screen}
                className={`phone-shot ${id === screen ? "is-active" : ""}`}
              />
            ))}
            <span aria-hidden className="phone-camera" />
            <span aria-hidden className="phone-glare" />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
