import type { ComponentType, SVGProps } from "react";
import {
  ArrowRightIcon,
  BedIcon,
  BusIcon,
  CheckIcon,
  CrownIcon,
  SeatIcon,
  UsersIcon,
} from "./icons";
import Reveal from "./Reveal";

type BusType = {
  name: string;
  tagline: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  capacity: string;
  pricePerKm: number;
  features: string[];
  popular?: boolean;
};

// Sample fleet details and fares; replace with real figures.
const busTypes: BusType[] = [
  {
    name: "AC Sleeper",
    tagline: "Rest easy on overnight journeys",
    icon: BedIcon,
    capacity: "30–36 berths",
    pricePerKm: 65,
    features: ["Full-length berths", "Blankets & pillows", "Reading lights", "Charging points"],
  },
  {
    name: "AC Seater",
    tagline: "Comfortable push-back seating",
    icon: SeatIcon,
    capacity: "40–45 seats",
    pricePerKm: 55,
    features: ["Push-back seats", "Ample legroom", "LED TV & music", "Charging points"],
  },
  {
    name: "Luxury Coach",
    tagline: "Premium travel, first-class comfort",
    icon: CrownIcon,
    capacity: "45–49 seats",
    pricePerKm: 85,
    features: ["Recliner seats", "Wi-Fi on board", "Washroom", "GPS live tracking"],
    popular: true,
  },
  {
    name: "Mini Bus",
    tagline: "Perfect for family & small groups",
    icon: BusIcon,
    capacity: "20–28 seats",
    pricePerKm: 40,
    features: ["Comfortable seating", "Luggage space", "Music system", "Easy hill-route access"],
  },
];

export default function BusTypes() {
  return (
    <section id="bus-types" className="scroll-mt-20 bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal variant="up" className="mx-auto mb-12 max-w-7xl text-center sm:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 sm:text-sm">
            Our fleet
          </p>
          <h2 className="font-serif text-3xl font-bold text-slate-950 sm:text-5xl">
            Choose your <span className="italic text-primary-600">perfect ride</span>
          </h2>
          <p className="mt-4 text-slate-600">
            Well-maintained buses with experienced drivers, for every group size and budget.
          </p>
        </Reveal>

        {/* Flex-wrap (not grid) so a short last row stays centred */}
        <Reveal variant="up" stagger className="flex flex-wrap justify-center gap-6">
          {busTypes.map(({ name, tagline, icon: TypeIcon, capacity, pricePerKm, features, popular }) => (
            <article
              key={name}
              className={`group relative flex w-full flex-col rounded-2xl p-6 transition duration-300 hover:-translate-y-1 sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-4.5rem)/4)] ${
                popular
                  ? "bg-primary-600 text-white shadow-2xl shadow-primary-600/30"
                  : "border border-primary-600/10 bg-white text-slate-900 shadow-sm hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-600/10"
              }`}
            >
              {popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 animate-float whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700 shadow-md">
                  Most popular
                </span>
              )}

              <span
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 group-hover:-rotate-6 group-hover:scale-110 ${
                  popular ? "bg-white/20 text-white" : "bg-primary-50 text-primary-600"
                }`}
              >
                <TypeIcon className="h-7 w-7" />
              </span>

              <h3 className="whitespace-nowrap font-serif text-2xl font-bold lg:text-xl xl:text-2xl">{name}</h3>
              <p className={`mt-1 text-sm ${popular ? "text-white/85" : "text-slate-500"}`}>{tagline}</p>

              <p className={`mt-4 flex items-center gap-2 text-sm font-medium ${popular ? "text-white" : "text-slate-700"}`}>
                <UsersIcon className="h-4 w-4" /> {capacity}
              </p>

              <ul className={`my-6 space-y-2.5 text-sm ${popular ? "text-white" : "text-slate-600"}`}>
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckIcon className={`h-4 w-4 shrink-0 ${popular ? "text-white" : "text-primary-600"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className={`mt-auto border-t pt-5 ${popular ? "border-white/25" : "border-slate-100"}`}>
                <p className={`text-xs ${popular ? "text-white/80" : "text-slate-500"}`}>Starting from</p>
                <p className="mb-4 text-2xl font-bold">
                  ₹{pricePerKm}
                  <span className={`text-sm font-medium ${popular ? "text-white/80" : "text-slate-500"}`}> /km</span>
                </p>
                <a
                  href={`/booking?type=${encodeURIComponent(name)}`}
                  className={`shine flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                    popular
                      ? "bg-white text-primary-700 hover:bg-primary-50"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  Get a Quote <ArrowRightIcon className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
