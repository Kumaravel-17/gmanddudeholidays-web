"use client";

import { useEffect, useRef, useState } from "react";

// A number that counts up from zero the first time it scrolls into view. The server renders the
// final value, so it reads correctly without JavaScript or with reduced motion.
export default function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("motion")) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Still off screen: wait at zero so the count-up starts from there.
        if (!entry.isIntersecting) return setShown(0);
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1600);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3)))); // ease-out
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
      {suffix}
    </span>
  );
}
