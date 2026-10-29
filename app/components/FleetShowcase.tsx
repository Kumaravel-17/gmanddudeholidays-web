import Image from "next/image";
import { capacityOf, fleet, inr, pricePerKm, type FleetBus } from "../lib/booking";
import { amenityInfo } from "./amenities";
import FleetCarousel from "./FleetCarousel";
import Parallax from "./Parallax";
import Reveal from "./Reveal";

const numberWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

// Tall photo card for one bus; hovering lifts it and reveals the amenities and fare.
function BusCard({ bus, className = "h-[26rem] w-72 shadow-2xl shadow-slate-900/20 hover:-translate-y-3 hover:shadow-primary-600/30 sm:w-80 lg:h-[30rem]" }: { bus: FleetBus; className?: string }) {
  return (
    <article className={`group relative ${className} shrink-0 snap-center overflow-hidden rounded-[2rem] bg-slate-900 transition duration-500`}>
      <Image
        src={bus.images[0]}
        alt={`${bus.name}, ${bus.type}`}
        fill
        sizes="20rem"
        className={`object-cover ${bus.position} transition duration-700 group-hover:scale-110`}
      />
      <span className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
      {bus.tag && (
        <span className="absolute left-5 top-5 rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white shadow-md">
          {bus.tag}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">{bus.type}</p>
        <h3 className="mt-1 font-serif text-3xl font-bold">{bus.name}</h3>
        <p className="mt-1 text-sm text-white/80">
          {capacityOf(bus.type)} · ₹{inr.format(pricePerKm[bus.type])}/km
        </p>
        {/* Amenities slide up on hover (always shown on touch screens, which can't hover) */}
        <ul className="mt-4 flex flex-wrap gap-1.5 transition-all duration-500 [@media(hover:hover)]:max-h-0 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:max-h-40 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
          {bus.amenities.slice(0, 5).map((a) => {
            const { short, icon: AmenityIcon } = amenityInfo[a];
            return (
              <li key={a} className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                <AmenityIcon className="h-3 w-3" /> {short}
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

export default function FleetShowcase() {
  const count = numberWords[fleet.length] ?? String(fleet.length);

  return (
    <section id="fleet" className="relative isolate scroll-mt-20 overflow-hidden bg-white py-16 sm:py-24">
    

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal variant="up" className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 sm:text-sm">
            Meet the fleet
          </p>
          <h2 className="font-serif text-3xl font-bold text-slate-950 sm:text-5xl">
            <span className="capitalize">{count}</span> buses,{" "}
            <span className="italic text-primary-600">one for every trip.</span>
          </h2>
          <p className="mt-4 text-slate-600 sm:text-lg">
            From the Dude luxury coach to our nimble mini buses, every bus is cleaned before each trip and
            driven by an experienced, courteous driver.
          </p>
        </Reveal>
      </div>

      {/* Desktop: a filmstrip that slides sideways as the page scrolls */}
      <Reveal variant="fade" className="mt-14 hidden lg:block">
        <Parallax x plain speed={0.35} className="flex justify-center">
          <div className="flex w-max shrink-0 items-end gap-6 px-6">
            {fleet.map((bus, i) => (
              // Alternate cards sit a little lower, for a staggered row
              <div key={bus.id} className={i % 2 ? "translate-y-10" : ""}>
                <BusCard bus={bus} />
              </div>
            ))}
          </div>
        </Parallax>
      </Reveal>

      {/* Phones and tablets: one bus at a time, swiped or stepped with the arrows */}
      <Reveal variant="left" className="lg:hidden">
        <FleetCarousel labels={fleet.map((bus) => bus.name)}>
          {fleet.map((bus) => (
            <BusCard key={bus.id} bus={bus} className="h-[22rem] w-full sm:h-[24rem]" />
          ))}
        </FleetCarousel>
      </Reveal>
    </section>
  );
}
