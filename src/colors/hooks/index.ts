import { useEffect, useRef } from "react";

export function useInterval(callback, delay, condition, name) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    console.log("set callback for", name);
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (condition && savedCallback.current) {
      savedCallback.current();
    }
  }, []);

  useEffect(() => {
    if (condition && savedCallback.current) {
      console.log("run callback for", name);
      const tick = () => savedCallback.current?.();
      const id = setInterval(tick, delay);
      return () => {
        console.log("clear interval for", name);
        clearInterval(id);
      };
    }
  }, [delay, condition]);
}
