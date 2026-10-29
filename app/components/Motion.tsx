"use client";

import { useEffect, useRef } from "react";

// Site-wide scroll progress bar along the top of the window. Scroll effects live in <Reveal> and
// <Parallax>. The "motion" class on <html> (set before paint in layout.tsx) turns them all on;
// it's left off when the visitor prefers reduced motion, so everything just shows.
export default function Motion() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.documentElement.classList.contains("motion")) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={bar} aria-hidden="true" className="scroll-progress" />;
}
