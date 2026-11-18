import { useEffect, useRef, useState } from 'react';

type SpeechModule = typeof import('expo-speech-recognition');

let cached: SpeechModule | null | undefined;

/**
 * expo-speech-recognition ships native code, so it only exists in dev/release
 * builds — not in Expo Go. Require it lazily and cache the result so a missing
 * native module degrades to a friendly error instead of crashing at launch.
 */
function getSpeechModule(): SpeechModule | null {
  if (cached !== undefined) return cached;
  try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      cached = require('expo-speech-recognition') as SpeechModule;
  } catch {
    cached = null;
  }
  return cached;
}

/**
 * On-device speech-to-text. Streams interim transcripts while listening and
 * calls `onFinal` once with the final transcript.
 */
export function useSpeech(onFinal: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const finalSent = useRef(false);
  const onFinalRef = useRef(onFinal);
  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => {
    const mod = getSpeechModule();
    if (!mod) return;
    const subscriptions = [
      mod.ExpoSpeechRecognitionModule.addListener('start', () => setListening(true)),
      mod.ExpoSpeechRecognitionModule.addListener('end', () => setListening(false)),
      mod.ExpoSpeechRecognitionModule.addListener('result', (event) => {
        const text = event.results[0]?.transcript ?? '';
        setTranscript(text);
        if (event.isFinal && text.trim() && !finalSent.current) {
          finalSent.current = true;
          onFinalRef.current(text.trim());
        }
      }),
      mod.ExpoSpeechRecognitionModule.addListener('error', (event) => {
        setListening(false);
        // "no-speech" and "aborted" are normal outcomes, not failures worth shouting about.
        if (event.error === 'no-speech' || event.error === 'speech-timeout') setError("Didn't catch that. Try again.");
        else if (event.error !== 'aborted') setError(event.message || 'Speech recognition failed.');
      }),
    ];
    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  const start = async () => {
    const mod = getSpeechModule();
    if (!mod) {
      setError('Voice input is not available in Expo Go — use the installed TunePay app.');
      return;
    }
    setError(null);
    setTranscript('');
    finalSent.current = false;
    const { granted } = await mod.ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      setError('Microphone permission is needed for voice commands.');
      return;
    }
    mod.ExpoSpeechRecognitionModule.start({ lang: 'en-IN', interimResults: true, continuous: false });
  };

  const stop = () => getSpeechModule()?.ExpoSpeechRecognitionModule.stop();

  return { listening, transcript, error, start, stop, setTranscript };
}
