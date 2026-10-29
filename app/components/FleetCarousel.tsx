"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

// Phones and tablets: one card per view, swiped or stepped with the arrows; the dots show which
// card is in view.
export default function FleetCarousel({ children, labels }: { children: ReactNode; labels: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = track.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const arrow =
    "flex h-10 w-10 items-center justify-center rounded-full border border-primary-600/20 bg-white text-primary-600 shadow-md transition hover:bg-primary-600/5 disabled:opacity-40";

  return (
    <div className="mx-auto mt-10 max-w-md px-4 sm:px-6">
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className="w-full shrink-0 snap-center px-1 pb-6">{child}</div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button type="button" aria-label="Previous bus" onClick={() => go(active - 1)} disabled={active === 0} className={arrow}>
          <ChevronDownIcon className="h-5 w-5 rotate-90" />
        </button>
        <div className="flex gap-2">
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-label={`Show ${label}`}
              aria-current={i === active}
              onClick={() => go(i)}
              className={`h-2.5 rounded-full transition-all ${i === active ? "w-6 bg-primary-600" : "w-2.5 bg-primary-600/25"}`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next bus"
          onClick={() => go(active + 1)}
          disabled={active === count - 1}
          className={arrow}
        >
          <ChevronDownIcon className="h-5 w-5 -rotate-90" />
        </button>
      </div>
    </div>
  );
}
