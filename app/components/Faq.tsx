import Image from "next/image";
import { PHONE, PHONE_DIGITS } from "../lib/contact";
import { ChevronDownIcon, PhoneIcon } from "./icons";
import Parallax from "./Parallax";
import Reveal from "./Reveal";

// Sample answers; replace with the real policies.
const faqs = [
  {
    question: "How can I book a bus ticket?",
    answer:
      "You can book your bus easily through our website. Simply enter your travel details in the booking form, choose your preferred bus type, and confirm your booking with a small advance payment.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept UPI, debit and credit cards, net banking, bank transfer and cash. A small advance confirms your booking and the balance is paid at the end of the trip.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer:
      "Yes. You can reschedule your travel date or change your route subject to availability. Contact our support team as early as possible so we can arrange it for you.",
  },
  {
    question: "Will I get a refund if I cancel my ticket?",
    answer:
      "Cancellations made well before the travel date get the advance refunded, minus a small cancellation fee. Refunds are processed to your original payment method within 5–7 working days.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-20 overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <Parallax plain speed={0.08}>
          <Reveal
            variant="up"
            className="mx-auto mb-12 max-w-4xl text-center sm:mb-14"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 sm:text-sm">
              Frequently asked questions
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#0f1a33] sm:text-5xl lg:text-[3.4rem]">
              Got Questions?{" "}
              <span className="italic text-primary-600">
                We&apos;ve Got{" "}
                <span className="relative inline-block">
                  Answers.
                  {/* Hand-drawn swoosh under "Answers" */}
                  <svg
                    viewBox="0 0 120 14"
                    fill="none"
                    aria-hidden="true"
                    className="absolute -bottom-3 left-[18%] w-[70%] text-primary-600"
                  >
                    <path
                      d="M2 11C30 3 75 1 118 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h2>
            <p className="mt-5 text-slate-600 sm:text-lg">
              Find answers to the most common questions about our bus services,
              bookings, and travel experience.
            </p>
          </Reveal>
        </Parallax>

        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Kept at the photo's own 3:2 shape so the whole bus fits with no gaps */}
          <Reveal
            variant="left"
            className="relative aspect-3/2 w-full overflow-hidden rounded-3xl shadow-xl shadow-primary-700/15"
          >
            <Image
              src="/images/faq-bus.jpg"
              alt="White and blue luxury tourist coach parked on an open lot"
              fill
              sizes="(min-width: 1024px) 40rem, 100vw"
              className="object-cover"
            />
            {/* The call badge drifts against the photo, so it seems to float above it */}
            <Parallax plain speed={-0.12} className="absolute bottom-6 left-4">
              <a
                href={`tel:+${PHONE_DIGITS}`}
                className="flex animate-float items-center gap-2.5 rounded-xl bg-primary-700/90 py-2 pl-2 pr-4 text-white shadow-lg backdrop-blur-sm transition hover:bg-primary-700"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-600">
                  <PhoneIcon className="h-4 w-4" />
                </span>
                <span className="leading-tight">
                  <span className="block text-xs font-semibold sm:text-sm">
                    Call Us Today!
                  </span>
                  <span className="block text-[11px] text-white/85 sm:text-xs">
                    {PHONE}
                  </span>
                </span>
              </a>
            </Parallax>
          </Reveal>

          {/* name="faq" keeps only one answer open at a time */}
          <Reveal variant="right" stagger className="space-y-3.5">
            {faqs.map(({ question, answer }, i) => (
              <details
                key={question}
                name="faq"
                open={i === 0}
                className="group rounded-xl border border-primary-600/10 bg-[#fdebdf] transition open:border-primary-500/40 open:bg-white open:shadow-lg open:shadow-primary-600/10"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary-500 to-primary-600 text-sm font-semibold text-white shadow-md shadow-primary-600/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-[#0f1a33] sm:text-base">
                    {question}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-primary-600 transition group-open:rotate-180" />
                </summary>
                <div className="mx-4 border-t border-primary-600/15 sm:mx-5" />
                <p className="px-4 pb-5 pt-3 text-[13px] leading-relaxed text-slate-600 sm:px-6 sm:text-sm">
                  {answer}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
