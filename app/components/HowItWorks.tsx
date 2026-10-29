import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BusIcon, CalendarIcon, ChatIcon } from "./icons";
import Parallax from "./Parallax";
import Reveal from "./Reveal";

// Buses are hired whole, by the day, so booking is: pick a bus, pick your days, confirm.
const steps = [
  {
    icon: BusIcon,
    title: "Choose your bus",
    text: "Compare our sleepers, seaters, luxury coach and mini buses, with photos, seats and amenities.",
  },
  {
    icon: CalendarIcon,
    title: "Pick your travel days",
    text: "See which days each bus is free and pick one day or several in a row. The whole bus is yours for each day.",
  },
  {
    icon: ChatIcon,
    title: "Confirm on WhatsApp",
    text: "Send your request in one tap. We call back with the fare, and a small advance confirms your dates.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative isolate scroll-mt-20 overflow-hidden py-20 sm:py-28">
      {/* Parallax photo band behind the steps */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Parallax speed={0.35}>
          <Image
            src="/images/hero-bus-banner.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={75}
            className="object-cover object-[70%_center]"
          />
        </Parallax>
      </div>
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-slate-950/85 via-slate-950/70 to-slate-950/85" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal variant="up" className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500 sm:text-sm">
            How booking works
          </p>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-5xl">
            Hire a bus by the day, <span className="italic text-primary-500">in three steps.</span>
          </h2>
          <p className="mt-4 text-slate-300 sm:text-lg">
            No fixed routes or timings. Tell us where you want to go, and the bus and driver are yours for
            the whole day.
          </p>
        </Reveal>

        <Reveal as="ol" variant="up" stagger className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3">
          {steps.map(({ icon: StepIcon, title, text }, i) => (
            <li
              key={title}
              className="group relative rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-primary-500/60 hover:bg-white/15 sm:p-7"
            >
              <span className="absolute right-6 top-5 font-serif text-5xl font-bold text-white/10 transition group-hover:text-primary-500/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-600/40 transition duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <StepIcon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-serif text-2xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-[15px]">{text}</p>
            </li>
          ))}
        </Reveal>

        <Reveal variant="zoom" className="mt-12 flex justify-center">
          <Link
            href="/booking"
            className="shine flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-primary-600/40 transition hover:-translate-y-0.5 hover:bg-primary-700"
          >
            Check bus availability <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
