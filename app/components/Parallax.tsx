"use client";

import { useEffect, useRef, type ReactNode } from "react";

// A layer that moves at a different speed from the page while scrolling. Each layer moves itself
// once it has mounted, so it never touches HTML that React hasn't hydrated yet.
//
// speed  how far it moves: 0.2 drifts slowly, negative moves the other way
// x      slide sideways instead of up and down
// hero   for banners at the very top: sits exactly in place at the top of the page and only moves
//        once you scroll, so the photo isn't cropped or zoomed.
// plain  move ordinary content (text, columns, shapes) laid out with className. Otherwise the
//        layer is a photo backdrop, oversized (see .parallax-media) so its edges never show.
type Props = {
  speed?: number;
  x?: boolean;
  hero?: boolean;
  plain?: boolean;
  className?: string;
  children?: ReactNode;
};

const layers = new Set<{ el: HTMLElement; speed: number; x: boolean; hero: boolean }>();
let frame = 0;

function update() {
  frame = 0;
  const vh = window.innerHeight;
  for (const { el, speed, x, hero } of layers) {
    // Measure the frame around the layer, not the layer itself, which is the one moving.
    const box = (el.parentElement ?? el).getBoundingClientRect();
    if (box.bottom < -vh * 0.5 || box.top > vh * 1.5) continue;
    const offset = hero ? Math.max(0, -box.top) * speed : (box.top + box.height / 2 - vh / 2) * -speed;
    el.style.transform = x ? `translate3d(${offset.toFixed(1)}px, 0, 0)` : `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update);
}

export default function Parallax({ speed = 0.2, x = false, hero = false, plain = false, className = "", children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    // The "motion" class on <html> is left off when the visitor prefers reduced motion.
    if (!el || !document.documentElement.classList.contains("motion")) return;
    const layer = { el, speed, x, hero };
    layers.add(layer);
    if (layers.size === 1) {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
    }
    schedule();
    return () => {
      layers.delete(layer);
      if (layers.size === 0) {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    };
  }, [speed, x, hero]);

  return (
    <div ref={ref} className={`${hero ? "absolute inset-0" : plain || x ? "" : "parallax-media"} will-change-transform ${className}`}>
      {children}
    </div>
  );
}
