"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import {
  BusIcon,
  CalendarIcon,
  ChevronDownIcon,
  MapIcon,
  PinIcon,
  SearchIcon,
  SwapIcon,
  UserIcon,
  UsersIcon,
} from "./icons";
import Parallax from "./Parallax";

type BannerProps = {
  // Wide photo with the bus on the right; the left side sits behind the headline and booking card.
  image: { src: string; alt: string };
  showBooking?: boolean;
  // Headline copy; defaults to the home page text. `highlight` is the orange italic second line.
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
  // Extra content under the description, e.g. call-to-action buttons.
  children?: ReactNode;
  // Crop position on phones/tablets, where only a narrow slice of the photo shows; aim it at the bus.
  mobileFocus?: string;
  // Desktop only: % of the banner height to hide from the photo's top and bottom (the photo zooms
  // in to fill), and the crop position, aimed so the bus clears the text.
  desktopTrimTop?: number;
  desktopTrimBottom?: number;
  desktopFocus?: string;
  // Desktop banner height; defaults to the full screen under the navbar.
  desktopHeight?: string;
  // Desktop tint over the photo; defaults to a white fade on the left behind the text.
  desktopOverlay?: string;
  // Desktop colour for the description line.
  desktopDescription?: string;
};

type Tab = {
  id: string;
  label: string;
  cta: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const tabs: Tab[] = [
  { id: "bus", label: "Bus Booking", cta: "Search Buses", icon: BusIcon },
  { id: "tour", label: "Tour Packages", cta: "Find Packages", icon: MapIcon },
  { id: "group", label: "Group Booking", cta: "Get Group Quote", icon: UsersIcon },
];

const fieldLabel = "mb-1.5 block text-sm font-semibold text-slate-800";
const fieldWrap =
  "flex h-12 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 text-slate-400 transition focus-within:border-primary-500 focus-within:ring-3 focus-within:ring-primary-500/15";
const fieldInput =
  "h-full w-full min-w-0 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400";

export default function Banner({
  image,
  showBooking = true,
  eyebrow = "Your journey starts here",
  title = "Explore More.",
  highlight = "Travel Better.",
  description = "Book comfortable and safe tourist buses for your next adventure.",
  children,
  mobileFocus = "object-[80%_bottom] sm:object-[75%_bottom]",
  desktopTrimTop = 0,
  desktopTrimBottom = 0,
  desktopFocus = "object-[75%_center]",
  desktopHeight = "lg:min-h-[calc(100svh-72px)]",
  desktopOverlay = "bg-linear-to-r from-white/10 via-white/55 via-40% to-white/0 to-60%",
  desktopDescription = "lg:text-slate-700",
}: BannerProps) {
  const [tab, setTab] = useState(tabs[0].id);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");

  const activeTab = tabs.find((t) => t.id === tab)!;
  const router = useRouter();

  // Open the booking page with the search filled in.
  const search = () => {
    const params = new URLSearchParams({ from, to, date, seats: passengers });
    router.push(`/booking?${params}`);
  };

  const swapCities = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <section
      aria-label={showBooking ? "Book a tourist bus" : undefined}
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Desktop: full-width banner image, bus on the right, light fade on the left for the text.
          The frame extends past the section by the trim amounts, which hides that much of the photo. */}
      <div
        className="absolute inset-x-0 -z-20 hidden lg:block"
        style={{ top: `-${desktopTrimTop}%`, bottom: `-${desktopTrimBottom}%` }}
      >
        <Parallax speed={0.3} hero>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 100vw, 1px"
            quality={85}
            className={`object-cover ${desktopFocus} animate-ken-burns`}
          />
        </Parallax>
      </div>
      <div className={`absolute inset-0 -z-10 hidden lg:block ${desktopOverlay}`} />

      <div
        className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:flex ${desktopHeight} lg:flex-col lg:justify-center lg:py-14 ${showBooking ? "pb-12" : ""}`}
      >
        {/* Mobile/tablet: photo behind the headline with a dark fade at the top so the white text
            reads over it; the bus shows below the text */}
        <div className="relative isolate -mx-4 px-4 pt-10 sm:-mx-6 sm:px-6 sm:pt-14 lg:mx-0 lg:p-0">
          <div className="absolute inset-0 -z-10 overflow-hidden lg:hidden">
            <Parallax speed={0.25} hero>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 1px"
                quality={85}
                className={`object-cover ${mobileFocus} animate-ken-burns`}
              />
            </Parallax>
            <div className="absolute inset-0 bg-linear-to-b from-slate-950/75 via-slate-950/45 via-45% to-slate-950/0 to-75%" />
          </div>
          {/* Headline */}
          {/* White text over the dark fade on small screens, dark text over the white fade on desktop */}
          <div className="[text-shadow:0_2px_12px_rgb(0_0_0/0.35)] lg:max-w-130 lg:[text-shadow:none]">
            <p className="animate-fade-in-up mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/85 sm:text-sm lg:text-slate-700">
              {eyebrow}
            </p>
            <h1 className="animate-fade-in-up [animation-delay:120ms] font-serif text-[2.7rem] font-bold leading-[1.08] text-white sm:text-6xl lg:text-7xl lg:text-slate-950">
              {title}
              <br />
              <span className="inline-block animate-fade-in-right [animation-delay:350ms] italic text-primary-500 lg:text-primary-600">
                {highlight}
              </span>
            </h1>
            <p className={`animate-fade-in-up [animation-delay:240ms] mt-5 max-w-md text-base leading-relaxed text-white/90 sm:text-lg ${desktopDescription}`}>
              {description}
            </p>
            {children && <div className="hidden animate-fade-in-up [animation-delay:360ms] lg:block">{children}</div>}
          </div>

          {/* Space so the bus is visible under the text on small screens */}
          <div className="h-56 sm:h-72 md:h-80 lg:hidden" />
          {/* Small screens: extra content (e.g. buttons) moves to the bottom of the banner, below the bus */}
          {children && <div className="pb-6 lg:hidden [&>*:first-child]:mt-0">{children}</div>}
        </div>

        {/* Booking card (overlaps the bottom of the banner on small screens) */}
        {showBooking && (
          <form
            id="book"
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            className="relative scroll-mt-24 -mt-10 rounded-2xl border border-white bg-white/95 p-4 shadow-2xl shadow-slate-900/15 backdrop-blur animate-fade-in-up [animation-delay:300ms] sm:p-5 lg:mt-8 lg:max-w-130"
          >
            <div
              role="tablist"
              aria-label="Booking type"
              className="mb-5 grid grid-cols-3 gap-1 border-b border-slate-100 pb-4"
            >
              {tabs.map(({ id, label, icon: TabIcon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:flex-row sm:text-sm ${tab === id
                      ? "bg-primary-600 text-white shadow-md shadow-primary-600/30"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <TabIcon className="h-5 w-5 shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <label className="block">
                <span className={fieldLabel}>From</span>
                <span className={fieldWrap}>
                  <PinIcon className="h-5 w-5 shrink-0" />
                  <input
                    id="from-city"
                    required
                    placeholder="Leaving from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className={fieldInput}
                  />
                </span>
              </label>

              <button
                type="button"
                onClick={swapCities}
                aria-label="Swap from and to cities"
                className="mx-auto -my-3 flex h-10 w-10 rotate-90 items-center justify-center rounded-full border border-slate-200 bg-white text-primary-600 shadow-sm transition duration-500 hover:rotate-270 hover:bg-primary-50 sm:my-1 sm:rotate-0 sm:hover:rotate-180"
              >
                <SwapIcon className="h-5 w-5" />
              </button>

              <label className="block">
                <span className={fieldLabel}>To</span>
                <span className={fieldWrap}>
                  <PinIcon className="h-5 w-5 shrink-0" />
                  <input
                    id="to-city"
                    required
                    placeholder="Going to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className={fieldInput}
                  />
                </span>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={fieldLabel}>Date of Journey</span>
                <span className={fieldWrap}>
                  <CalendarIcon className="h-5 w-5 shrink-0" />
                  <input
                    id="journey-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={fieldInput}
                  />
                </span>
              </label>

              <label className="block">
                <span className={fieldLabel}>Passengers</span>
                <span className={`${fieldWrap} relative`}>
                  <UserIcon className="h-5 w-5 shrink-0" />
                  <select
                    id="passengers"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className={`${fieldInput} cursor-pointer appearance-none pr-6`}
                  >
                    {[...Array(50)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} Passenger{i ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3.5 h-4 w-4 text-slate-500" />
                </span>
              </label>
            </div>

            <button
              id="search-buses-btn"
              type="submit"
              className="shine mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 text-base font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:-translate-y-0.5 hover:bg-primary-700"
            >
              <SearchIcon className="h-5 w-5" />
              {activeTab.cta}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
