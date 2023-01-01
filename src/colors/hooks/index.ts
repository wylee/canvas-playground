import { useEffect, useRef } from "react";

export function useInterval(callback, condition, delay) {
  const callbackRef = useRef<() => void>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Run callback right away to avoid delayed start.
  useEffect(() => {
    if (callbackRef.current && condition) {
      callbackRef.current();
    }
  }, [condition]);

  // Run callback periodically when condition is set.
  useEffect(() => {
    if (callbackRef.current && condition) {
      const id = setInterval(() => callbackRef.current?.(), delay);
      return () => clearInterval(id);
    }
  }, [condition, delay]);
}
