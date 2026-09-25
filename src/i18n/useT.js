import { useEffect, useState } from 'react';
import { LANGUAGE_EVENT, t } from './index.js';

// Returns t() and re-renders the component whenever the language changes.
export function useT() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const onChange = () => setTick((n) => n + 1);
    window.addEventListener(LANGUAGE_EVENT, onChange);
    return () => window.removeEventListener(LANGUAGE_EVENT, onChange);
  }, []);
  return t;
}
