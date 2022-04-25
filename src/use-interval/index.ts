import { useEffect, useRef } from 'react';

export function useInterval(func: Function, delay?: number | null) {
  const savedCallback = useRef<Function>();

  useEffect(() => {
    savedCallback.current = func;
  }, [delay, func]);

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [delay]);
}
