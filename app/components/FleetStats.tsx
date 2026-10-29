import { BOOKING_DAYS, fleet, seatCount } from "../lib/booking";
import { PHONE_DIGITS } from "../lib/contact";
import Counter from "./Counter";
import { BusIcon, CalendarIcon, ChatIcon, PhoneIcon, SeatIcon, UsersIcon } from "./icons";
import Parallax from "./Parallax";
import Reveal from "./Reveal";

// Figures come from the fleet data, so they stay true as buses are added.
const stats = [
  { icon: BusIcon, value: fleet.length, label: "Buses in our fleet" },
  { icon: SeatIcon, value: fleet.reduce((n, b) => n + seatCount(b.type), 0), suffix: "+", label: "Seats across the fleet" },
  { icon: UsersIcon, value: new Set(fleet.map((b) => b.type)).size, label: "Bus types to choose from" },
  { icon: CalendarIcon, value: BOOKING_DAYS, label: "Days you can book ahead" },
];

export default function FleetStats() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0d1f4a] py-20 text-white sm:py-28">
      {/* Floating shapes on separate depth layers: the further back, the slower they move */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Parallax plain speed={0.15} className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary-600/30 blur-3xl" />
        <Parallax plain speed={-0.25} className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <Parallax plain speed={0.35} className="absolute right-[12%] top-16 h-40 w-40 rounded-full border-2 border-primary-500/30" />
        <Parallax plain speed={-0.4} className="absolute bottom-16 left-[8%] h-24 w-24 rounded-3xl border-2 border-white/10 rotate-12" />
        <Parallax
          plain
          speed={0.2}
          className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle,rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:28px_28px]"
        />
        <Parallax plain speed={0.55} className="absolute left-[18%] top-24 hidden text-primary-500/40 lg:block">
          <BusIcon className="h-12 w-12 animate-float" />
        </Parallax>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal variant="up" className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500 sm:text-sm">
            Our fleet in numbers
          </p>
          <h2 className="font-serif text-3xl font-bold sm:text-5xl">
            Ready when you are, <span className="italic text-primary-500">any day you choose.</span>
          </h2>
        </Reveal>

        <Reveal variant="up" stagger className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {stats.map(({ icon: StatIcon, value, suffix, label }) => (
            <div
              key={label}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-primary-500/50 hover:bg-white/10"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/20 text-primary-500 transition duration-300 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white">
                <StatIcon className="h-6 w-6" />
              </span>
              <p className="mt-4 font-serif text-5xl font-bold text-white">
                <Counter value={value} suffix={suffix} />
              </p>
              <p className="mt-1 text-sm text-slate-300">{label}</p>
            </div>
          ))}
        </Reveal>

        {/* Call to action */}
        <Reveal
          variant="zoom"
          className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl bg-linear-to-r from-primary-600 to-primary-500 p-8 text-center shadow-2xl shadow-primary-600/30 sm:p-10 lg:flex-row lg:text-left"
        >
          <div>
            <h3 className="font-serif text-2xl font-bold sm:text-3xl">Planning a trip? Let&apos;s check your dates.</h3>
            <p className="mt-2 text-white/85">Call or message us and we&apos;ll confirm which buses are free.</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-3">
            <a
              href={`tel:+${PHONE_DIGITS}`}
              className="shine flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-primary-700 shadow-lg transition hover:-translate-y-0.5"
            >
              <PhoneIcon className="h-5 w-5" /> Call Now
            </a>
            <a
              href={`https://wa.me/${PHONE_DIGITS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shine flex items-center gap-2 rounded-xl border border-white/60 px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <ChatIcon className="h-5 w-5" /> WhatsApp Us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
