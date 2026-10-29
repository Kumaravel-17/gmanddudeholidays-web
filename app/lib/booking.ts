// Sample fleet and availability for the booking flow. There's no booking backend yet, so
// availability is generated; replace it with real data from the booking system (the admin's
// "Export website data" includes each bus's booked dates).
// Buses are hired whole, by the day: a bus is either free or booked on a date, there are no time slots.

export type BusType = "AC Sleeper" | "AC Seater" | "Luxury Coach" | "Mini Bus";

// Seat layouts. Each row is a list of seat ids; null is the aisle.
export type Deck = { name: string; rows: (string | null)[][]; berth: boolean };

function grid(prefix: string, rows: number, pattern: number[]): (string | null)[][] {
  // pattern like [2, 2] = two seats, aisle, two seats
  const letters = "ABCD";
  return Array.from({ length: rows }, (_, r) => {
    const row: (string | null)[] = [];
    let col = 0;
    pattern.forEach((count, g) => {
      if (g > 0) row.push(null);
      for (let s = 0; s < count; s++) row.push(`${prefix}${r + 1}${letters[col++]}`);
    });
    return row;
  });
}

export function layoutFor(type: BusType): Deck[] {
  switch (type) {
    case "AC Sleeper":
      return [
        { name: "Lower deck", rows: grid("L", 6, [1, 2]), berth: true },
        { name: "Upper deck", rows: grid("U", 6, [1, 2]), berth: true },
      ];
    case "Luxury Coach":
      return [{ name: "Seats", rows: grid("", 12, [2, 2]), berth: false }];
    case "Mini Bus":
      return [{ name: "Seats", rows: grid("", 9, [2, 1]), berth: false }];
    default:
      return [{ name: "Seats", rows: grid("", 10, [2, 2]), berth: false }];
  }
}

// Stable pseudo-random number, so sample availability looks the same on every visit.
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export const inr = new Intl.NumberFormat("en-IN");

// Whole-bus hire: the five buses in the fleet.
// Types, amenities and fares are sample figures; correct them to match the real buses.
export type Amenity =
  | "ac"
  | "recliner"
  | "pushback"
  | "berth"
  | "wifi"
  | "tv"
  | "charging"
  | "music"
  | "blanket"
  | "reading-light"
  | "gps"
  | "first-aid"
  | "luggage";

export type FleetBus = {
  id: string;
  name: string;
  type: BusType;
  // First photo is the main one; add more (interior, seats) and the detail page shows a gallery.
  images: string[];
  // object-position so the bus stays in frame when the main photo is cropped
  position: string;
  tag?: string;
  description: string;
  amenities: Amenity[];
};

// Hire fare per km by bus type, the same figures as the home page "Our fleet" section.
export const pricePerKm: Record<BusType, number> = {
  "AC Sleeper": 65,
  "AC Seater": 55,
  "Luxury Coach": 85,
  "Mini Bus": 40,
};

export const fleet: FleetBus[] = [
  {
    id: "dude",
    name: "Dude",
    type: "Luxury Coach",
    images: ["/images/fleet/bus5.jpeg"],
    position: "object-[30%_center]",
    tag: "Most Popular",
    description:
      "Travel in comfort with our Dude luxury coach. Spacious recliner seats, a premium interior and modern amenities make it ideal for long tours, weddings and corporate trips.",
    amenities: ["ac", "recliner", "wifi", "tv", "charging", "music", "reading-light", "gps", "first-aid"],
  },
  {
    id: "sabari-1",
    name: "Sabari 1",
    type: "AC Seater",
    images: ["/images/fleet/bus2.jpeg"],
    position: "object-[center_55%]",
    description:
      "Sabari is a comfortable AC seater with push-back seats and plenty of legroom, a great fit for family trips, pilgrimages and college tours.",
    amenities: ["ac", "pushback", "tv", "charging", "music", "luggage", "gps", "first-aid"],
  },
  {
    id: "sabari-2",
    name: "Sabari 2",
    type: "AC Sleeper",
    images: ["/images/fleet/bus4.jpeg"],
    position: "object-[center_40%]",
    description:
      "Rest easy on overnight journeys in Sabari's full-length berths, with blankets, pillows and reading lights for every passenger.",
    amenities: ["ac", "berth", "blanket", "reading-light", "charging", "music", "gps", "first-aid"],
  },
  {
    id: "kiran",
    name: "Kiran",
    type: "Mini Bus",
    images: ["/images/fleet/bus3.jpeg"],
    position: "object-[center_45%]",
    description:
      "Kiran is a lively mini bus for smaller groups. It handles hill routes with ease and has room for everyone's luggage.",
    amenities: ["ac", "pushback", "music", "charging", "luggage", "first-aid"],
  },
  {
    id: "sri-girimurugan",
    name: "Sri Girimurugan",
    type: "Mini Bus",
    images: ["/images/fleet/bus1.jpeg"],
    position: "object-[center_50%]",
    description:
      "Sri Girimurugan is a compact, comfortable mini bus for family outings and temple trips, with a great sound system for the journey.",
    amenities: ["ac", "pushback", "music", "charging", "luggage", "first-aid"],
  },
];

export function seatCount(type: BusType) {
  return layoutFor(type).flatMap((d) => d.rows.flat()).filter(Boolean).length;
}

export function capacityOf(type: BusType) {
  return `${seatCount(type)} ${layoutFor(type)[0].berth ? "berths" : "seats"}`;
}

// Sample bookings until there's a booking backend; stable for the same bus and date.
export function isBusBooked(busId: string, date: string) {
  return hash(`${busId}|${date}`) % 100 < 35;
}

export const busById = (id: string) => fleet.find((b) => b.id === id);

// Dates are passed around as YYYY-MM-DD strings and handled in UTC, so server and browser agree
// whatever timezone each is in.
export const BOOKING_DAYS = 14;
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The business runs on Indian time, whatever timezone the server is in.
export function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function bookingDates(today: string) {
  return Array.from({ length: BOOKING_DAYS }, (_, i) => addDays(today, i));
}

export function dateParts(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return { weekday: weekdays[d.getUTCDay()], day: d.getUTCDate(), month: months[d.getUTCMonth()] };
}

export function formatDate(iso: string) {
  const { weekday, day, month } = dateParts(iso);
  return `${weekday}, ${day} ${month}`;
}

// Sorted dates grouped into runs of consecutive days, e.g. a 3-day trip and a separate day trip.
export function dateRuns(dates: string[]) {
  const runs: { start: string; end: string; days: number }[] = [];
  for (const d of [...dates].sort()) {
    const last = runs[runs.length - 1];
    if (last && addDays(last.end, 1) === d) {
      last.end = d;
      last.days++;
    } else runs.push({ start: d, end: d, days: 1 });
  }
  return runs;
}
