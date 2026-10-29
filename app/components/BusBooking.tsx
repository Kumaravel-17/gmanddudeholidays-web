"use client";

import { useRef, useState, type FormEvent } from "react";
import { bookingDates, dateParts, dateRuns, formatDate, isBusBooked, type FleetBus } from "../lib/booking";
import { PHONE_DIGITS } from "../lib/contact";
import DateStrip from "./DateStrip";
import { CloseIcon, SendIcon } from "./icons";
import Reveal from "./Reveal";

type Props = {
  bus: FleetBus;
  // Today's date (YYYY-MM-DD) from the server, so server and client render the same dates.
  today: string;
  initialDate?: string;
  from?: string;
  to?: string;
  passengers?: string;
};

const fieldLabel = "mb-1.5 block text-sm font-semibold text-slate-800";
const fieldInput =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/15";

const daysLabel = (n: number) => `${n} day${n > 1 ? "s" : ""}`;

// The bus is hired whole, by the day: tap free days to add them to the trip.
export default function BusBooking({ bus, today, initialDate, from = "", to = "", passengers = "" }: Props) {
  const dates = bookingDates(today);
  const free = (d: string) => !isBusBooked(bus.id, d);

  const [date, setDate] = useState(initialDate && dates.includes(initialDate) ? initialDate : today);
  // The date searched for on the booking page starts picked, if the bus is free that day.
  const [picks, setPicks] = useState<string[]>(() => (initialDate && dates.includes(initialDate) && free(initialDate) ? [initialDate] : []));
  const [form, setForm] = useState({ name: "", phone: "", from, to, passengers, notes: "" });
  const dialog = useRef<HTMLDialogElement>(null);

  const toggle = (d: string) => setPicks((ps) => (ps.includes(d) ? ps.filter((x) => x !== d) : [...ps, d]));
  const removeRun = (start: string, end: string) => setPicks((ps) => ps.filter((d) => d < start || d > end));

  const onDate = (d: string) => {
    setDate(d);
    if (free(d)) toggle(d);
  };

  const update = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const runs = dateRuns(picks);
  const describe = (r: (typeof runs)[number]) =>
    r.days === 1 ? formatDate(r.start) : `${formatDate(r.start)} – ${formatDate(r.end)} (${daysLabel(r.days)})`;

  // There's no backend yet, so the booking request is sent as a prefilled WhatsApp message.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = [
      `Hi GM & Dude Holidays, I'd like to book ${bus.name} (${bus.type}) for:`,
      ...runs.map((r) => `• ${describe(r)}`),
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.from && `Pickup: ${form.from}`,
      form.to && `Destination: ${form.to}`,
      form.passengers && `Passengers: ${form.passengers}`,
      form.notes && `Details: ${form.notes}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const { weekday, day, month } = dateParts(date);
  const dateFree = free(date);
  const datePicked = picks.includes(date);

  return (
    <>
      <Reveal
        variant="up"
        id="availability"
        className="scroll-mt-24 rounded-3xl border border-primary-600/10 bg-white p-4 shadow-xl shadow-primary-600/10 sm:p-6"
      >
        <DateStrip
          title="Pick your travel days"
          dates={dates}
          today={today}
          value={date}
          onChange={onDate}
          freeOn={(d) => (free(d) ? 1 : 0)}
          total={1}
          selected={picks}
        />

        {/* The last tapped day: free to add, already picked, or booked by someone else */}
        <div
          key={date}
          className={`mt-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 p-4 animate-pop-in ${
            !dateFree
              ? "border-slate-200 bg-slate-50"
              : datePicked
                ? "border-primary-600 bg-primary-50"
                : "border-emerald-500/60 bg-emerald-50/60"
          }`}
        >
          <div>
            <p className="font-serif text-lg font-bold text-slate-950">
              {weekday}, {day} {month}
            </p>
            <p className={`text-sm font-semibold ${!dateFree ? "text-slate-500" : datePicked ? "text-primary-700" : "text-emerald-700"}`}>
              {!dateFree
                ? `${bus.name} is already booked on this day`
                : datePicked
                  ? "Added to your trip · full day"
                  : `${bus.name} is free all day`}
            </p>
          </div>
          {dateFree && (
            <button
              type="button"
              onClick={() => toggle(date)}
              aria-pressed={datePicked}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
                datePicked
                  ? "border border-primary-600/30 bg-white text-primary-700 hover:bg-primary-50"
                  : "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700"
              }`}
            >
              {datePicked ? "Remove day" : "Add this day"}
            </button>
          )}
        </div>

        {/* Trip details: one line per run of consecutive days */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="font-serif text-xl font-bold text-slate-950">Trip Details</h3>
          {runs.length ? (
            <ul className="mt-3 space-y-3">
              {runs.map((r) => (
                <li key={r.start} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 animate-pop-in">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-950">{formatDate(r.start)}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-800">{form.from || "Your pickup"}</p>
                  </div>
                  <div className="flex flex-1 flex-col items-center px-1">
                    <span className="text-[11px] font-semibold text-slate-500">{daysLabel(r.days)}</span>
                    <span className="relative my-1 h-0.5 w-full rounded-full bg-primary-500/30">
                      <span className="absolute -left-1 -top-0.75 h-2 w-2 rounded-full bg-primary-600" />
                      <span className="absolute -right-1 -top-0.75 h-2 w-2 rounded-full bg-primary-600" />
                    </span>
                    <span className="text-[11px] font-semibold text-primary-600">Full-day hire</span>
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="font-bold text-slate-950">{formatDate(r.end)}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-800">{form.to || "Your destination"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRun(r.start, r.end)}
                    aria-label={`Remove ${describe(r)}`}
                    className="shrink-0 self-start text-slate-400 hover:text-primary-600"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              Tap the free days above to add them to your trip. Pick several days in a row for a multi-day tour.
            </p>
          )}
        </div>

        {/* Summary and book button */}
        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-cream p-4">
          <div className="min-w-0">
            <p className="font-semibold text-slate-950">
              {picks.length ? `${daysLabel(picks.length)} selected` : "No days selected"}
            </p>
            <p className="truncate text-sm text-slate-500">
              {bus.name} · {bus.type}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {picks.length > 0 && (
              <button
                type="button"
                onClick={() => setPicks([])}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-white"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              disabled={!picks.length}
              onClick={() => dialog.current?.showModal()}
              className="shine rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:px-8 sm:text-base"
            >
              Book Now
            </button>
          </div>
        </div>
      </Reveal>

      <dialog
        ref={dialog}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl p-0 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={onSubmit} className="max-h-[85svh] overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-serif text-2xl font-bold text-slate-950">Book {bus.name}</h2>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <ul className="mt-4 space-y-2 rounded-2xl bg-cream p-4 text-sm text-slate-800">
            {runs.map((r) => (
              <li key={r.start} className="flex items-start justify-between gap-3">
                <span>{describe(r)}</span>
                <button
                  type="button"
                  onClick={() => removeRun(r.start, r.end)}
                  aria-label={`Remove ${describe(r)}`}
                  className="shrink-0 text-slate-400 hover:text-primary-600"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={fieldLabel}>Your Name</span>
              <input required value={form.name} onChange={update("name")} placeholder="Full name" className={fieldInput} />
            </label>
            <label className="block">
              <span className={fieldLabel}>Phone Number</span>
              <input
                required
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={update("phone")}
                placeholder="10-digit mobile number"
                className={fieldInput}
              />
            </label>
            <label className="block">
              <span className={fieldLabel}>Pickup</span>
              <input value={form.from} onChange={update("from")} placeholder="Pickup city" className={fieldInput} />
            </label>
            <label className="block">
              <span className={fieldLabel}>Destination</span>
              <input value={form.to} onChange={update("to")} placeholder="Where to?" className={fieldInput} />
            </label>
            <label className="block sm:col-span-2">
              <span className={fieldLabel}>Passengers</span>
              <input
                type="number"
                min={1}
                value={form.passengers}
                onChange={update("passengers")}
                placeholder="Number of passengers"
                className={fieldInput}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={fieldLabel}>Trip Details</span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={update("notes")}
                placeholder="Pickup time, stops, places to visit…"
                className={`${fieldInput} resize-none`}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={picks.length === 0}
            className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 text-base font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 disabled:opacity-50"
          >
            <SendIcon className="h-5 w-5" />
            Send Booking Request on WhatsApp
          </button>
        </form>
      </dialog>
    </>
  );
}
