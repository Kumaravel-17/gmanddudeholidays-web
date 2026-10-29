import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { amenityInfo } from "../../components/amenities";
import BusBooking from "../../components/BusBooking";
import BusGallery from "../../components/BusGallery";
import FavouriteButton from "../../components/FavouriteButton";
import Footer from "../../components/Footer";
import {
  ArrowRightIcon,
  BusIcon,
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  ChevronDownIcon,
  ShieldIcon,
  UsersIcon,
} from "../../components/icons";
import Navbar from "../../components/Navbar";
import { busById, capacityOf, fleet, inr, pricePerKm, todayInIndia, type FleetBus } from "../../lib/booking";
import Reveal from "../../components/Reveal";

export function generateStaticParams() {
  return fleet.map((bus) => ({ busId: bus.id }));
}

export async function generateMetadata({ params }: PageProps<"/booking/[busId]">): Promise<Metadata> {
  const bus = busById((await params).busId);
  if (!bus) return {};
  return {
    title: `Book ${bus.name} | GM & Dude Holidays`,
    description: `Check ${bus.name} (${bus.type}, ${capacityOf(bus.type)}) availability and hire it for your travel days.`,
  };
}

const whyChoose = [
  "Well maintained and clean",
  "Experienced, courteous drivers",
  "On-time pickups",
  "Premium comfort and safety",
];

// Summarised from the FAQ on the home page; keep the two in step.
const bookingInfo = [
  { icon: CalendarIcon, text: "Reschedule your date or route, subject to availability" },
  { icon: ShieldIcon, text: "A small advance confirms your booking; pay the balance after the trip" },
  { icon: ChatIcon, text: "Booking confirmation on WhatsApp and call" },
];

type Search = Promise<Record<string, string | string[] | undefined>>;

// Reads the search and today's date, so it renders per request, inside Suspense.
async function Availability({ bus, searchParams }: { bus: FleetBus; searchParams: Search }) {
  const params = await searchParams;
  // Today's date changes between requests, so wait for the request before reading the clock.
  await connection();
  const get = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : undefined);

  return (
    <BusBooking
      bus={bus}
      today={todayInIndia()}
      initialDate={get("date")}
      from={get("from")}
      to={get("to")}
      passengers={get("seats")}
    />
  );
}

function Card({
  title,
  className = "",
  reveal,
  children,
}: {
  title: string;
  className?: string;
  reveal?: boolean;
  children: ReactNode;
}) {
  return (
    <Reveal
      variant={reveal ? "up" : undefined}
      className={`rounded-3xl border border-primary-600/10 bg-white p-5 shadow-lg shadow-slate-900/5 sm:p-6 ${className}`}
    >
      <h2 className="font-serif text-xl font-bold text-slate-950 sm:text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </Reveal>
  );
}

// The bus comes from the URL, so it's read inside Suspense: the navbar and footer show instantly.
export default function BusPage({ params, searchParams }: PageProps<"/booking/[busId]">) {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="min-h-[80vh] animate-pulse bg-cream" />}>
        <BusDetails params={params} searchParams={searchParams} />
      </Suspense>
      <Footer />
    </main>
  );
}

async function BusDetails({ params, searchParams }: { params: PageProps<"/booking/[busId]">["params"]; searchParams: Search }) {
  const bus = busById((await params).busId);
  if (!bus) notFound();

  return (
      <section className="bg-cream py-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:space-y-8">
          <Link
            href="/booking"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 transition hover:text-primary-600"
          >
            <ChevronDownIcon className="h-4 w-4 rotate-90" />
            Back to all buses
          </Link>

          {/* Photos and the key facts */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
            <Reveal variant="left" className="min-w-0">
              <BusGallery bus={bus} />
            </Reveal>

            <Reveal variant="right" className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-4xl font-bold text-slate-950 sm:text-5xl">{bus.name}</h1>
                <FavouriteButton busId={bus.id} name={bus.name} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-700">
                  <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1">
                    <BusIcon className="h-4 w-4 text-primary-600" /> {bus.type}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1">
                    <UsersIcon className="h-4 w-4 text-primary-600" /> {capacityOf(bus.type)}
                  </span>
                </div>
                <p className="text-slate-500">
                  <span className="text-3xl font-bold tabular-nums text-slate-950">₹{inr.format(pricePerKm[bus.type])}</span>{" "}
                  /km
                </p>
              </div>

              <Reveal as="ul" variant="zoom" stagger className="mt-6 grid grid-cols-4 gap-2 rounded-3xl border border-primary-600/10 bg-white p-3 sm:gap-3 sm:p-4">
                {bus.amenities.slice(0, 8).map((id) => {
                  const { short, icon: AmenityIcon } = amenityInfo[id];
                  return (
                    <li key={id} className="group flex flex-col items-center gap-1.5 rounded-xl p-2 text-center">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition duration-300 group-hover:-translate-y-1 group-hover:bg-primary-600 group-hover:text-white">
                        <AmenityIcon className="h-5 w-5" />
                      </span>
                      <span className="text-[11px] font-medium leading-tight text-slate-600 sm:text-xs">{short}</span>
                    </li>
                  );
                })}
              </Reveal>

              <a
                href="#availability"
                className="shine mt-6 flex h-13 items-center justify-center gap-2 rounded-xl bg-primary-600 text-base font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:-translate-y-0.5 hover:bg-primary-700 lg:mt-auto"
              >
                Book This Bus
                <ArrowRightIcon className="h-5 w-5" />
              </a>
            </Reveal>
          </div>

          <Reveal variant="up" stagger className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
            <Card title="Bus Description">
              <p className="leading-relaxed text-slate-600">{bus.description}</p>
            </Card>
            <Card title="Why Choose This Bus?" className="bg-primary-50/60">
              <ul className="space-y-2.5">
                {whyChoose.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckIcon className="h-4 w-4 shrink-0 text-primary-600" /> {point}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          {/* Availability calendar and trip details, with booking info beside them */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
            <div className="min-w-0 space-y-6 lg:space-y-8">
              <Suspense fallback={<div className="h-[36rem] animate-pulse rounded-3xl bg-white" />}>
                <Availability bus={bus} searchParams={searchParams} />
              </Suspense>
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Card title="Booking Information" className="bg-primary-50/60" reveal>
                <ul className="space-y-3">
                  {bookingInfo.map(({ icon: InfoIcon, text }) => (
                    <li key={text} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" /> {text}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>
  );
}
