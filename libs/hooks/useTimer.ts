import { useCallback, useEffect, useRef, useState } from "react";

type UseTimerReturnDef = {
  timer: number;
  startTimer: () => void;
  stopTimer: () => void;
};

export function useTimer(
  startAt: number = 1,
  endAt: number = 0,
  increase: boolean = false,
): UseTimerReturnDef {
  const [timer, setTimer] = useState<number>(startAt);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const startTimer = useCallback(() => {
    const timer = setInterval(() => {
      setTimer((prev) => (increase ? prev + 1 : prev - 1));
    }, 1000);
    timerRef.current = timer;
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimer(startAt);
  }, []);

  useEffect(() => {
    if (timer === endAt) {
      stopTimer();
    }
  }, [timer, endAt]);

  return { timer, startTimer, stopTimer };
}
