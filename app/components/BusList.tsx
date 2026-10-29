"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  bookingDates,
  capacityOf,
  dateParts,
  fleet,
  formatDate,
  inr,
  isBusBooked,
  pricePerKm,
} from "../lib/booking";
import { amenityInfo } from "./amenities";
import FavouriteButton from "./FavouriteButton";
import {
  ArrowRightIcon,
  BusIcon,
  CalendarIcon,
  PinIcon,
  SearchIcon,
  SwapIcon,
  UsersIcon,
} from "./icons";
import Reveal from "./Reveal";

type Props = {
  // Today's date (YYYY-MM-DD) from the server, so server and client render the same dates.
  today: string;
  initialDate?: string;
  initialType?: string;
  from?: string;
  to?: string;
  passengers?: string;
};

type Sort = "recommended" | "price-asc" | "price-desc" | "available";

const sorts: { id: Sort; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "available", label: "Most Available" },
];

const fieldWrap =
  "flex h-14 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 text-slate-400 transition focus-within:border-primary-500 focus-within:ring-3 focus-within:ring-primary-500/15";
const fieldLabel = "block text-[11px] font-medium text-slate-500";
const fieldInput = "w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400";

export default function BusList({ today, initialDate, initialType, from = "", to = "", passengers = "1" }: Props) {
  const dates = bookingDates(today);

  const [date, setDate] = useState(initialDate && dates.includes(initialDate) ? initialDate : today);
  const [search, setSearch] = useState({ from, to, seats: passengers });
  const [sort, setSort] = useState<Sort>("recommended");

  const buses = [...fleet].sort((a, b) => {
    if (sort === "price-asc") return pricePerKm[a.type] - pricePerKm[b.type];
    if (sort === "price-desc") return pricePerKm[b.type] - pricePerKm[a.type];
    if (sort === "available") return Number(isBusBooked(a.id, date)) - Number(isBusBooked(b.id, date));
    // Recommended: buses of the type picked on the home page (?type=) come first.
    return Number(b.type === initialType) - Number(a.type === initialType);
  });

  const query = new URLSearchParams(
    Object.entries({ ...search, date }).filter(([, v]) => v),
  ).toString();

  return (
    <>
      {/* Search card */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal
          as="form"
          variant="up"
          onSubmit={(e) => {
            e.preventDefault();
            document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="grid gap-3 rounded-3xl border border-primary-600/10 bg-white p-4 shadow-xl shadow-primary-600/10 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1fr_auto_1fr_1fr_0.8fr_auto] lg:items-center"
        >
          <label className={fieldWrap}>
            <PinIcon className="h-5 w-5 shrink-0 text-primary-600" />
            <span className="min-w-0 flex-1">
              <span className={fieldLabel}>From</span>
              <input
                value={search.from}
                onChange={(e) => setSearch((s) => ({ ...s, from: e.target.value }))}
                placeholder="Pickup city"
                className={fieldInput}
              />
            </span>
          </label>
          <button
            type="button"
            onClick={() => setSearch((s) => ({ ...s, from: s.to, to: s.from }))}
            aria-label="Swap pickup and destination"
            className="hidden h-10 w-10 items-center justify-center justify-self-center rounded-full bg-primary-50 text-primary-600 transition hover:bg-primary-600 hover:text-white lg:flex"
          >
            <SwapIcon className="h-5 w-5" />
          </button>
          <label className={fieldWrap}>
            <PinIcon className="h-5 w-5 shrink-0 text-primary-600" />
            <span className="min-w-0 flex-1">
              <span className={fieldLabel}>To</span>
              <input
                value={search.to}
                onChange={(e) => setSearch((s) => ({ ...s, to: e.target.value }))}
                placeholder="Destination"
                className={fieldInput}
              />
            </span>
          </label>
          <label className={fieldWrap}>
            <CalendarIcon className="h-5 w-5 shrink-0 text-primary-600" />
            <span className="min-w-0 flex-1">
              <span className={fieldLabel}>Date of Journey</span>
              <input
                type="date"
                required
                min={dates[0]}
                max={dates[dates.length - 1]}
                value={date}
                onChange={(e) => dates.includes(e.target.value) && setDate(e.target.value)}
                className={fieldInput}
              />
            </span>
          </label>
          <label className={fieldWrap}>
            <UsersIcon className="h-5 w-5 shrink-0 text-primary-600" />
            <span className="min-w-0 flex-1">
              <span className={fieldLabel}>Passengers</span>
              <input
                type="number"
                min={1}
                value={search.seats}
                onChange={(e) => setSearch((s) => ({ ...s, seats: e.target.value }))}
                className={fieldInput}
              />
            </span>
          </label>
          <button
            type="submit"
            className="shine flex h-14 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:-translate-y-0.5 hover:bg-primary-700 sm:col-span-2 lg:col-span-1"
          >
            <SearchIcon className="h-5 w-5" />
            Search Buses
          </button>
        </Reveal>
      </div>

      <section id="results" className="scroll-mt-20 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-slate-950">
                {buses.length} {buses.length === 1 ? "Bus" : "Buses"} Found
                <span className="ml-2 font-sans text-sm font-medium text-slate-500">on {formatDate(date)}</span>
              </h2>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                Sort by:
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="cursor-pointer bg-transparent font-semibold text-slate-900 outline-none"
                >
                  {sorts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Reveal variant="up" stagger className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {buses.map((bus) => {
                const href = `/booking/${bus.id}?${query}`;
                const free = !isBusBooked(bus.id, date);
                // The chosen day and the six after it, so a multi-day trip can be checked at a glance.
                const week = dates.slice(dates.indexOf(date), dates.indexOf(date) + 7);
                const extra = bus.amenities.length - 4;
                return (
                  <article
                    key={bus.id}
                    className="group isolate flex transform-gpu flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-primary-600/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-600/15"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-slate-900">
                      <Link href={href} tabIndex={-1} aria-hidden="true">
                        <Image
                          src={bus.images[0]}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className={`object-cover ${bus.position} transition duration-700 group-hover:scale-105`}
                        />
                      </Link>
                      {bus.tag && (
                        <span className="absolute left-3 top-3 rounded-lg bg-primary-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                          {bus.tag}
                        </span>
                      )}
                      <div className="absolute right-3 top-3">
                        <FavouriteButton busId={bus.id} name={bus.name} small />
                      </div>
                      <span
                        className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow ${
                          free ? "bg-emerald-500 text-white" : "bg-slate-900/85 text-white"
                        }`}
                      >
                        {free ? `Free on ${formatDate(date)}` : `Booked on ${formatDate(date)}`}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-serif text-xl font-bold text-slate-950">
                        <Link href={href} className="hover:text-primary-600">
                          {bus.name}
                        </Link>
                      </h3>
                      <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <BusIcon className="h-4 w-4 text-slate-400" /> {bus.type}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <UsersIcon className="h-4 w-4 text-slate-400" /> {capacityOf(bus.type)}
                        </span>
                      </p>

                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {bus.amenities.slice(0, 4).map((a) => {
                          const { short, icon: AmenityIcon } = amenityInfo[a];
                          return (
                            <li
                              key={a}
                              className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                            >
                              <AmenityIcon className="h-3 w-3" /> {short}
                            </li>
                          );
                        })}
                        {extra > 0 && (
                          <li className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            +{extra}
                          </li>
                        )}
                      </ul>

                      {/* The chosen day and the next six: green when free, grey and struck through when booked */}
                      <div className="mt-4">
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Availability
                        </p>
                        <div className="grid grid-cols-7 gap-1">
                          {week.map((d) => {
                            const booked = isBusBooked(bus.id, d);
                            const { weekday, day } = dateParts(d);
                            return (
                              <span
                                key={d}
                                title={`${formatDate(d)}: ${booked ? "booked" : "free"}`}
                                className={`rounded-lg border py-1 text-center transition ${
                                  booked
                                    ? "border-slate-200 bg-slate-100 text-slate-400"
                                    : "border-emerald-500/60 bg-emerald-50 text-emerald-700"
                                } ${d === date ? "ring-2 ring-primary-500/60 ring-offset-1" : ""}`}
                              >
                                <span className="block text-[9px] font-semibold uppercase">{weekday}</span>
                                <span className={`block text-xs font-bold ${booked ? "line-through" : ""}`}>{day}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                        <p className="text-sm text-slate-500">
                          <span className="text-2xl font-bold tabular-nums text-slate-950">₹{inr.format(pricePerKm[bus.type])}</span> /km
                        </p>
                        <Link
                          href={href}
                          className="shine flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition hover:bg-primary-700"
                        >
                          View &amp; Book
                          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

