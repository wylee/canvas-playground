import { useEffect, useRef } from "react";

export function useInterval(callback, delay, condition, name) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (condition && savedCallback.current) {
      savedCallback.current();
    }
  }, []);

  useEffect(() => {
    if (condition && savedCallback.current) {
      const tick = () => savedCallback.current?.();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, condition]);
}
