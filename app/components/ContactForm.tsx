"use client";

import { useState, type FormEvent } from "react";
import { PHONE_DIGITS } from "../lib/contact";
import { SendIcon } from "./icons";

const tripTypes = ["Bus Booking", "Tour Package", "Group Booking", "Wedding / Event", "Other"];

const fieldLabel = "mb-1.5 block text-sm font-semibold text-slate-800";
const fieldInput =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/15";

// There's no backend yet, so the enquiry is sent as a prefilled WhatsApp message.
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", trip: tripTypes[0], date: "", message: "" });

  const update = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = [
      `Hi GM & Dude Holidays, I'd like to enquire about a ${form.trip}.`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.date && `Travel date: ${form.date}`,
      form.message && `Details: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-primary-600/10 bg-white p-5 shadow-xl shadow-primary-600/10 sm:p-8"
    >
      <h2 className="font-serif text-2xl font-bold text-[#0f1a33] sm:text-3xl">Send us an enquiry</h2>
      <p className="mt-2 text-sm text-slate-500">
        Fill in your trip details and we&apos;ll get back to you with the best bus and price.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
          <span className={fieldLabel}>Enquiry For</span>
          <select value={form.trip} onChange={update("trip")} className={`${fieldInput} cursor-pointer`}>
            {tripTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={fieldLabel}>Travel Date</span>
          <input type="date" value={form.date} onChange={update("date")} className={fieldInput} />
        </label>
        <label className="block sm:col-span-2">
          <span className={fieldLabel}>Trip Details</span>
          <textarea
            rows={4}
            value={form.message}
            onChange={update("message")}
            placeholder="From, to, number of passengers, bus type…"
            className={`${fieldInput} resize-none`}
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 text-base font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:-translate-y-0.5 hover:bg-primary-700"
      >
        <SendIcon className="h-5 w-5" />
        Send Enquiry on WhatsApp
      </button>
    </form>
  );
}
