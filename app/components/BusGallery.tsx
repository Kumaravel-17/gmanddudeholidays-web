"use client";

import Image from "next/image";
import { useState } from "react";
import type { FleetBus } from "../lib/booking";
import { ChevronDownIcon } from "./icons";

// Main photo with arrows and thumbnails; the arrows and thumbnails only appear once a bus has
// more than one photo.
export default function BusGallery({ bus }: { bus: FleetBus }) {
  const [index, setIndex] = useState(0);
  const count = bus.images.length;
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  const arrow =
    "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:bg-white hover:text-primary-600";

  return (
    <div>
      <div className="relative h-72 overflow-hidden rounded-3xl bg-slate-900 shadow-xl shadow-slate-900/15 sm:h-[26rem]">
        <Image
          key={bus.images[index]}
          src={bus.images[index]}
          alt={`${bus.name} bus from the GM & Dude Holidays fleet${count > 1 ? `, photo ${index + 1} of ${count}` : ""}`}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className={`object-cover ${index === 0 ? bus.position : "object-center"}`}
        />
        {bus.tag && (
          <span className="absolute left-4 top-4 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
            {bus.tag}
          </span>
        )}
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={`${arrow} left-4`}>
              <ChevronDownIcon className="h-5 w-5 rotate-90" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className={`${arrow} right-4`}>
              <ChevronDownIcon className="h-5 w-5 -rotate-90" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {bus.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === index}
              className={`relative h-16 overflow-hidden rounded-xl ring-2 ring-offset-2 transition sm:h-20 ${
                i === index ? "ring-primary-600" : "ring-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
