import { useRef, useEffect } from 'react';

export function useDebounce<A extends any[]>(func: (...args: A) => void, delay: number, cleanUp = false) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  function clearTimer() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }

  useEffect(() => (cleanUp ? clearTimer : undefined), [cleanUp]);

  return (...args: A) => {
    clearTimer();
    timeoutRef.current = setTimeout(() => func(...args), delay);
  };
}
