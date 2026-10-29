"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PHONE, PHONE_DIGITS } from "../lib/contact";
import { BusIcon, CloseIcon, MenuIcon, PhoneIcon, UserIcon } from "./icons";

// Section links point at "/" so they also work from other pages.
const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Booking", href: "/booking" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Add a shadow once the page scrolls so the sticky header separates from content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "border-slate-200/70 shadow-lg shadow-slate-900/5" : "border-white/60"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px]">
        <Link href="/" className="flex items-center gap-2 text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <BusIcon className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-bold sm:text-2xl">
            GM &amp; <span className="text-primary-600">Dude</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={link.href === pathname ? "page" : undefined}
              className={`relative py-2 text-[15px] font-medium transition hover:text-primary-600 ${link.href === pathname
                  ? "text-primary-600 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary-600"
                  : "text-slate-700"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href={`tel:+${PHONE_DIGITS}`}
            className="hidden items-center gap-2 font-semibold text-slate-800 md:flex"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <PhoneIcon className="h-4 w-4" />
            </span>
            {PHONE}
          </a>
          <a
            href="#login"
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition hover:bg-primary-700 sm:px-5"
          >
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Login / Sign Up</span>
            <span className="sm:hidden">Login</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-slate-100 bg-white px-4 pb-4 lg:hidden"
          aria-label="Mobile"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={link.href === pathname ? "page" : undefined}
              className={`block border-b border-slate-100 py-3 font-medium last:border-0 hover:text-primary-600 ${link.href === pathname ? "text-primary-600" : "text-slate-700"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:+${PHONE_DIGITS}`}
            className="mt-2 flex items-center gap-2 font-semibold text-primary-600"
          >
            <PhoneIcon className="h-4 w-4" /> {PHONE}
          </a>
        </nav>
      )}
    </header>
  );
}
