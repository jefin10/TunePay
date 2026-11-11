import { createContext, useContext } from 'react';

import { useScheme } from '@/core/theme';

/** Which ground the UI sits on. It follows the app's light/dark scheme; a
 * screen that is always dark (the camera) can force it with ToneProvider. */
export type Tone = 'light' | 'dark';

const ToneContext = createContext<Tone | null>(null);

export const ToneProvider = ToneContext.Provider;

export function useTone(): Tone {
  const forced = useContext(ToneContext);
  const scheme = useScheme();
  return forced ?? scheme;
}
