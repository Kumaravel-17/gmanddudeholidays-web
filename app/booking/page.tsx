import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import BusList from "../components/BusList";
import Footer from "../components/Footer";
import PhotoBanner from "../components/PhotoBanner";
import Navbar from "../components/Navbar";
import { todayInIndia } from "../lib/booking";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Book a Bus | GM & Dude Holidays",
  description: "Check which GM & Dude Holidays buses are free on your dates and hire a whole bus by the day.",
};

type Search = Promise<Record<string, string | string[] | undefined>>;

// Reads the search (from the home page booking card or a bus type link) and today's date, so it
// renders per request, inside Suspense.
async function Buses({ searchParams }: { searchParams: Search }) {
  const params = await searchParams;
  // Today's date changes between requests, so wait for the request before reading the clock.
  await connection();
  const get = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : undefined);

  return (
    <BusList
      today={todayInIndia()}
      initialDate={get("date")}
      initialType={get("type")}
      from={get("from")}
      to={get("to")}
      passengers={get("seats")}
    />
  );
}

export default function BookingPage({ searchParams }: PageProps<"/booking">) {
  return (
    <main>
      <Navbar />
      <PhotoBanner
        title="Book a GM & Dude Holidays bus"
        image={{
          src: "/images/booking/booking-banner.png",
          alt: "Premium Bus Travel: comfortable, safe, affordable, memorable journeys. Sabari, Dude and Kiran tourist buses on a waterfront plaza under a blue sky, with temple towers and palaces behind",
        }}
      />
      <div className="bg-cream">
        <Reveal as="section" variant="up" className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 sm:text-sm">
            Bus booking
          </p>
          <h2 className="font-serif text-4xl font-bold text-slate-950 sm:text-5xl">
            Find Your <span className="italic text-primary-600">Perfect Ride.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600 sm:text-lg">
            Choose from our premium fleet, check which buses are free on your date and book your journey in
            a few clicks.
          </p>
        </Reveal>
        <Suspense fallback={<div className="min-h-[70vh]" />}>
          <Buses searchParams={searchParams} />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
