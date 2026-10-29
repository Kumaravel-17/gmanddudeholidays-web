"use client";

import { useRef } from "react";
import { dateParts, formatDate } from "../lib/booking";
import { CalendarIcon, ChevronDownIcon } from "./icons";

type Props = {
  title: string;
  dates: string[];
  today: string;
  value: string;
  onChange: (date: string) => void;
  // Free buses on a date, out of `total`; drives the colour of each day's badge. With total = 1
  // (a single bus) the badge just says Free or Booked.
  freeOn: (date: string) => number;
  total: number;
  // Multi-day picking: these days show as picked instead of the single `value`.
  selected?: string[];
};

// Green when mostly free, amber when filling up, red when nearly full, grey when full.
const tones = {
  plenty: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", dot: "bg-emerald-500", label: "Plenty free" },
  filling: { badge: "bg-amber-50 text-amber-700 ring-amber-600/15", dot: "bg-amber-500", label: "Filling fast" },
  few: { badge: "bg-rose-50 text-rose-700 ring-rose-600/15", dot: "bg-rose-500", label: "Almost full" },
  full: { badge: "bg-slate-100 text-slate-400 ring-slate-300/40", dot: "bg-slate-300", label: "Full" },
};

function toneFor(free: number, total: number) {
  if (!free) return tones.full;
  const share = free / total;
  return share > 0.5 ? tones.plenty : share > 0.25 ? tones.filling : tones.few;
}

// BookMyShow-style row of days, each with a badge showing how many buses are free.
export default function DateStrip({ title, dates, today, value, onChange, freeOn, total, selected }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollDates = (direction: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const pick = (date: string, button: HTMLButtonElement) => {
    onChange(date);
    button.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  // "Oct – Nov 2026", or "Oct 2026" when the range stays in one month.
  const first = dateParts(dates[0]);
  const last = dateParts(dates[dates.length - 1]);
  const year = dates[dates.length - 1].slice(0, 4);
  const range = first.month === last.month ? `${first.month} ${year}` : `${first.month} – ${last.month} ${year}`;

  const arrow =
    "flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary-600 hover:bg-primary-600 hover:text-white";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/30">
            <CalendarIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-950 sm:text-2xl">{title}</h2>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">{range}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ul className="hidden gap-4 text-xs text-slate-500 md:flex">
            {(total === 1 ? [{ ...tones.plenty, label: "Free" }, { ...tones.full, label: "Booked" }] : [tones.plenty, tones.filling, tones.few]).map((t) => (
              <li key={t.label} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${t.dot}`} /> {t.label}
              </li>
            ))}
          </ul>
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => scrollDates(-1)} aria-label="Earlier dates" className={arrow}>
              <ChevronDownIcon className="h-4 w-4 rotate-90" />
            </button>
            <button type="button" onClick={() => scrollDates(1)} aria-label="Later dates" className={arrow}>
              <ChevronDownIcon className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Edges fade out so days cut off by the scroll area don't end abruptly */}
      <div
        ref={scroller}
        className="-mx-4 mt-4 flex snap-x items-stretch gap-2 overflow-x-auto px-4 pb-5 pt-2 [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-1rem),transparent)] [scrollbar-width:none] sm:mx-0 sm:px-2"
      >
        {dates.map((d, i) => {
          const { weekday, day, month } = dateParts(d);
          const active = selected ? selected.includes(d) : d === value;
          const isToday = d === today;
          const free = freeOn(d);
          const tone = toneFor(free, total);
          const weekend = weekday === "Sat" || weekday === "Sun";
          // A thin divider where a new month starts.
          const newMonth = i > 0 && day === 1;
          return (
            <div key={d} className="flex shrink-0 snap-center items-stretch gap-2">
              {newMonth && (
                <span
                  className="my-3 w-px rounded-full bg-primary-500/40"
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                onClick={(e) => pick(d, e.currentTarget)}
                aria-pressed={active}
                aria-label={`${formatDate(d)}, ${total === 1 ? (free ? "free" : "booked") : free ? `${free} of ${total} buses free` : "fully booked"}`}
                className={`relative flex w-14 flex-col items-center rounded-xl px-1 pb-2 pt-1.5 transition duration-300 ${
                  active
                    ? "-translate-y-1 bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : `text-slate-800 ring-1 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-600/10 hover:ring-primary-500/50 ${
                        weekend ? "bg-primary-50/70 ring-primary-600/15" : "bg-white ring-slate-200"
                      }`
                }`}
              >
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    active ? "text-white/90" : isToday || weekend ? "text-primary-600" : "text-slate-400"
                  }`}
                >
                  {isToday ? "Today" : weekday}
                </span>
                {/* Montserrat, not Playfair: Playfair's old-style figures sit at uneven heights */}
                <span className="mt-0.5 text-xl font-bold leading-none tracking-tight tabular-nums">{day}</span>
                <span
                  className={`mt-0.5 text-[9px] font-semibold uppercase tracking-widest ${active ? "text-white/75" : "text-slate-400"}`}
                >
                  {month}
                </span>
                <span
                  className={`mt-1.5 rounded-full px-1.5 py-px text-[9px] font-bold ring-1 ${
                    active ? "bg-white/20 text-white ring-white/30" : tone.badge
                  }`}
                >
                  {total === 1 ? (free ? "Free" : "Booked") : free ? `${free} free` : "Full"}
                </span>
                {/* Pointer under the selected day */}
                {active && !selected && (
                  <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm bg-primary-600" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
