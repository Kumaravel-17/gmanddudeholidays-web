import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { EMAIL, PHONE, PHONE_DIGITS } from "../lib/contact";
import { BusIcon, MailIcon, PhoneIcon } from "./icons";
import Parallax from "./Parallax";
import Reveal from "./Reveal";

const columns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Book a Bus", href: "/booking" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Our Buses",
    links: [
      { label: "AC Sleeper", href: "/#bus-types" },
      { label: "AC Seater", href: "/#bus-types" },
      { label: "Luxury Coach", href: "/#bus-types" },
      { label: "Mini Bus", href: "/#bus-types" },
    ],
  },
];

// Reading the clock during prerender is not allowed with Cache Components, so cache the year
// and refresh it daily.
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default function Footer() {
  return (
    <footer id="contact" className="relative isolate scroll-mt-20 overflow-hidden bg-[#0d1f4a] text-slate-200">
      {/* Night mountain scene; anchored to the bottom so the lake and glowing wave stay visible */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Parallax speed={-0.15}>
          <Image src="/images/footerimage.png" alt="" fill sizes="100vw" className="object-cover object-bottom" />
        </Parallax>
      </div>
      <Reveal variant="up" stagger className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:pb-24 lg:pt-16">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
              <BusIcon className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl font-bold">
              GM &amp; <span className="text-primary-500">Dude</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
            Comfortable tourist buses for family trips, pilgrimages, weddings and group tours, with
            experienced drivers and easy booking.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 font-serif text-lg font-bold text-white">{column.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-primary-500">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 font-serif text-lg font-bold text-white">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`tel:+${PHONE_DIGITS}`} className="flex items-center gap-3 transition hover:text-primary-500">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600/15 text-primary-500">
                  <PhoneIcon className="h-4 w-4" />
                </span>
                {PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 break-all transition hover:text-primary-500">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600/15 text-primary-500">
                  <MailIcon className="h-4 w-4" />
                </span>
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </Reveal>

      <div>
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-300 sm:px-6 sm:text-sm">
          © <CopyrightYear /> GM &amp; Dude Holidays. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
