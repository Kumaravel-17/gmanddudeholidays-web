import Link from "next/link";
import { ArrowRightIcon, BusIcon, CrownIcon, HeartIcon, MapIcon, RouteIcon, UsersIcon } from "./icons";
import Parallax from "./Parallax";
import Reveal from "./Reveal";

const trips = [
  {
    icon: HeartIcon,
    title: "Weddings & Events",
    text: "Bring every guest to the venue together, on time, in a decorated bus.",
  },
  {
    icon: MapIcon,
    title: "Pilgrimages",
    text: "Temple circuits with early pickups and drivers who know every route.",
  },
  {
    icon: UsersIcon,
    title: "Family Trips",
    text: "Room for everyone and all the luggage, for a day out or a week away.",
  },
  {
    icon: BusIcon,
    title: "College & School Tours",
    text: "Safe, comfortable buses for study tours and excursions of any size.",
  },
  {
    icon: CrownIcon,
    title: "Corporate Outings",
    text: "Team offsites and retreats in our luxury coach, with Wi-Fi on board.",
  },
  {
    icon: RouteIcon,
    title: "Hill Station Tours",
    text: "Mini buses that handle the ghat roads to Ooty, Kodaikanal and Munnar.",
  },
];

const band = trips.map((t) => t.title).join(" • ");

export default function TripTypes() {
  return (
    <section id="trips" className="relative scroll-mt-20 overflow-hidden bg-cream py-16 sm:py-24">
      {/* Two giant text bands sliding in opposite directions as the page scrolls */}
      <div aria-hidden="true" className="pointer-events-none select-none space-y-2 font-serif font-bold leading-tight">
        <Parallax x plain speed={0.45} className="flex justify-center">
          <span className="w-max shrink-0 whitespace-nowrap text-3xl text-transparent [-webkit-text-stroke:1px_var(--color-primary-600)] sm:text-5xl lg:text-6xl">
            {band} • {band}
          </span>
        </Parallax>
        <Parallax x plain speed={-0.45} className="flex justify-center">
          <span className="w-max shrink-0 whitespace-nowrap text-3xl italic text-primary-600/10 sm:text-5xl lg:text-6xl">
            {band} • {band}
          </span>
        </Parallax>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:mt-16 sm:px-6">
        <Reveal variant="up" className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 sm:text-sm">
            Trips we love
          </p>
          <h2 className="font-serif text-3xl font-bold text-slate-950 sm:text-5xl">
            Whatever the occasion, <span className="italic text-primary-600">we&apos;ll get you there.</span>
          </h2>
        </Reveal>

        <Reveal variant="zoom" stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map(({ icon: TripIcon, title, text }) => (
            <Link
              key={title}
              href="/booking"
              className="group relative overflow-hidden rounded-3xl border border-primary-600/10 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-primary-500/40 hover:shadow-2xl hover:shadow-primary-600/15"
            >
              {/* Orange wash that rises from the bottom on hover */}
              <span className="absolute inset-0 -z-0 translate-y-full bg-linear-to-t from-primary-50 to-white transition duration-500 group-hover:translate-y-0" />
              <span className="relative flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-600/30">
                  <TripIcon className="h-7 w-7" />
                </span>
                <span>
                  <span className="block font-serif text-xl font-bold text-slate-950">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">{text}</span>
                  <span className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-all group-hover:gap-2.5">
                    Check availability <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
