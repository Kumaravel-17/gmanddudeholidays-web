import type { Metadata } from "next";
import Banner from "../components/Banner";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import { ChatIcon, MailIcon, PhoneIcon } from "../components/icons";
import Navbar from "../components/Navbar";
import { EMAIL, MAP_QUERY, PHONE, PHONE_DIGITS } from "../lib/contact";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Contact Us | GM & Dude Holidays",
  description: "Call, WhatsApp or email GM & Dude Holidays to book a tourist bus, tour package or group trip.",
};

const channels = [
  {
    icon: PhoneIcon,
    title: "Call Us",
    detail: PHONE,
    note: "Talk to our booking team",
    href: `tel:+${PHONE_DIGITS}`,
  },
  {
    icon: ChatIcon,
    title: "WhatsApp",
    detail: PHONE,
    note: "Quick replies on chat",
    href: `https://wa.me/${PHONE_DIGITS}`,
  },
  {
    icon: MailIcon,
    title: "Email Us",
    detail: EMAIL,
    note: "For quotes and documents",
    href: `mailto:${EMAIL}`,
  },
];

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <Banner
        image={{
          src: "/images/contact/contact-banner.png",
          alt: "GM & Dude Holidays coach on a mountain highway under a blue sky",
        }}
        mobileFocus="object-[62%_bottom]"
        desktopTrimTop={45}
        desktopTrimBottom={8}
        desktopFocus="object-[50%_bottom]"
        desktopHeight="lg:min-h-[50rem]"
        desktopOverlay="bg-white/10"
        desktopDescription="lg:text-white lg:[text-shadow:0_1px_8px_rgb(0_0_0/0.5)]"
        showBooking={false}
        eyebrow="We're here to help"
        title="Get in Touch."
        highlight="Contact Us."
        description="Call, chat or send us your trip details and we'll help you plan your next journey."
      >
        {/* Phones/tablets: buttons centred in the banner. Desktop: left-aligned under the text. */}
        <div className="mt-6 flex  gap-3 sm:mt-8 sm:gap-4 lg:justify-start">
          <a
            href={`tel:+${PHONE_DIGITS}`}
            className="shine flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:-translate-y-0.5 hover:bg-primary-700 sm:px-6 sm:py-3.5 sm:text-base"
          >
            <PhoneIcon className="h-5 w-5" />
            Call Now
          </a>
          <a
            href={`https://wa.me/${PHONE_DIGITS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-primary-600 sm:px-6 sm:py-3.5 sm:text-base"
          >
            <ChatIcon className="h-5 w-5 text-primary-600" />
            <span className="sm:hidden">WhatsApp</span>
            <span className="hidden sm:inline">Chat on WhatsApp</span>
          </a>
        </div>
      </Banner>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 sm:text-sm">
              Contact us
            </p>
            <h2 className="font-serif text-4xl font-bold text-[#0f1a33] sm:text-5xl lg:text-[3.4rem]">
              Let&apos;s Plan Your <span className="italic text-primary-600">Next Journey.</span>
            </h2>
            <p className="mt-5 text-slate-600 sm:text-lg">
              Have a trip in mind or a question about our buses? Call, chat or send us your details and
              our team will help you book the right bus.
            </p>
          </Reveal>

          <Reveal variant="zoom" stagger className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-3 lg:gap-6">
            {channels.map(({ icon: ChannelIcon, title, detail, note, href }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex flex-col items-center rounded-2xl border border-primary-600/15 bg-white p-6 text-center shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-600/10 lg:p-8"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-xl transition duration-300 group-hover:-rotate-6 group-hover:scale-110 bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-600/30">
                  <ChannelIcon className="h-6 w-6" />
                </span>
                <span className="mt-4 block text-lg font-semibold text-[#0f1a33]">{title}</span>
                <span className="mt-1 block text-sm text-slate-500">{note}</span>
                <span className="mt-2 block break-all font-medium text-primary-600">{detail}</span>
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Map on the left, enquiry form on the right, both the same height */}
      <section className="bg-[#fff8f3] py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
          <Reveal variant="left" className="overflow-hidden rounded-3xl border border-primary-600/10 shadow-xl shadow-primary-600/10">
            <iframe
              title="GM & Dude Holidays location on Google Maps"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full border-0 sm:h-96 lg:h-full lg:min-h-[32rem]"
            />
          </Reveal>

          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
