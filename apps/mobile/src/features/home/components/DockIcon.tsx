import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * The dock's own icon set: one 24-unit grid, one stroke weight, one corner
 * radius, so the row reads as a single family. Drawn here rather than taken
 * from a general icon font, where the shapes are built on different grids.
 *
 * The shapes are soft-cornered outlines — a squircle house, a microphone, a
 * flat-shouldered figure — so nothing has a sharp corner except where a
 * corner is the point of the glyph.
 */
export type DockIconName = 'home' | 'voice' | 'profile';

export function DockIcon({
  name,
  color,
  active,
  size = 22,
}: {
  name: DockIconName;
  color: string;
  /** The current tab is drawn a touch heavier, never a different shape. */
  active?: boolean;
  size?: number;
}) {
  const common = {
    stroke: color,
    strokeWidth: active ? 2 : 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' ? (
        <>
          <Path
            d="M3.8 10.6 10 5.3a3.1 3.1 0 0 1 4 0l6.2 5.3c.4.3.6.8.6 1.3v5.4a3.4 3.4 0 0 1-3.4 3.4H6.6a3.4 3.4 0 0 1-3.4-3.4v-5.4c0-.5.2-1 .6-1.3Z"
            {...common}
          />
          <Path d="M9.6 17h4.8" {...common} />
        </>
      ) : null}

      {name === 'voice' ? (
        // A capsule microphone on its stand.
        <>
          <Rect x="8.6" y="3" width="6.8" height="11.4" rx="3.4" {...common} />
          <Path d="M5.4 11.2a6.6 6.6 0 0 0 13.2 0" {...common} />
          <Path d="M12 17.8v3.2" {...common} />
        </>
      ) : null}

      {name === 'profile' ? (
        <>
          <Circle cx="12" cy="8.2" r="3.7" {...common} />
          <Path d="M4.6 20.2v-.6a4.6 4.6 0 0 1 4.6-4.6h5.6a4.6 4.6 0 0 1 4.6 4.6v.6" {...common} />
        </>
      ) : null}
    </Svg>
  );
}
